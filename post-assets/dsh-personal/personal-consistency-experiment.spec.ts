/**
 * Copy this file to dsh-personal/tests/blog-consistency-experiment.spec.ts.
 * From the enclosing deepseek-harness checkout, run:
 *   node node_modules/vitest/vitest.mjs run --config dsh-personal/vitest.config.ts dsh-personal/tests/blog-consistency-experiment.spec.ts
 * Set PERSONAL_EXPERIMENT_TRACE to an output JSON path to retain observations.
 * Uses the real service and SQLite; no provider, network, or API key is needed.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import { expect, it } from 'vitest'
import { PersonalService } from '../src/index.ts'
import { resolveSearchWeights } from '../src/config.ts'
import { openPersonalDatabase } from '../src/store/open.ts'
import { personalSearchIndex, tokenizeSearch } from '../src/store/search.ts'

type SearchResult = Awaited<ReturnType<PersonalService['searchPersonal']>>

function titles(result: SearchResult): string[] {
  return result.hits.map(hit => {
    const row = hit.row as Record<string, unknown>
    return String(row.title ?? row.name ?? row.summary)
  })
}

async function withFixture<T>(work: (service: PersonalService, path: string) => Promise<T>): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), 'personal-blog-experiment-'))
  const path = join(root, 'personal.db')
  const service = new PersonalService(new Context(), { databasePath: path, timezone: 'UTC' })
  try {
    return await work(service, path)
  } finally {
    service.close()
    await rm(root, { recursive: true, force: true })
  }
}

it('observes lexical ranking, stale revisions, and connection-local index consistency', async () => {
  const retrieval = await withFixture(async service => {
    await service.createIdea({ title: '整理运维笔记', content: '检查博客的 HTTPS 证书' })
    await service.createTask({ title: '检查博客的 HTTPS 证书' })
    const all = await service.searchPersonal({ text: '博客证书' })
    const topOne = await service.searchPersonal({ text: '博客证书', limit: 1 })
    expect(all.terms).toEqual(['博客', '证书'])
    expect(titles(all)).toEqual(['检查博客的 HTTPS 证书', '整理运维笔记'])
    expect(all.hits.map(hit => hit.type)).toEqual(['task', 'idea'])
    expect(all.hits[0]!.score).toBeGreaterThan(all.hits[1]!.score)
    expect(titles(topOne)).toEqual(['检查博客的 HTTPS 证书'])
    return {
      query: '博客证书',
      terms: all.terms,
      literalSubstringExists: '检查博客的 HTTPS 证书'.includes('博客证书'),
      ranked: all.hits.map((hit, index) => ({ type: hit.type, title: titles(all)[index], score: hit.score })),
      globalLimitOne: titles(topOne),
    }
  })

  const guardedEdit = await withFixture(async (service, path) => {
    const task = await service.createTask({ title: '检查博客证书' })
    const selected = await service.getRecord('task', task.id)
    const edited = await (async () => {
      const writer = await openPersonalDatabase(path)
      try {
        // A direct SQLite writer need not know about revision tokens or updated_at.
        writer.prepare('UPDATE tasks SET title = ? WHERE id = ?').run('检查生产证书', task.id)
        await expect(service.updateTask(task.id, { status: 'DONE' }, selected.revision)).rejects.toThrow('record changed')
        await expect(service.deleteRecord('task', task.id, selected.revision)).rejects.toThrow('record changed')
        const preserved = await service.getRecord('task', task.id)
        expect(preserved.row).toMatchObject({ title: '检查生产证书', status: 'TODO' })
        expect(preserved.revision).not.toBe(selected.revision)
        const changed = await service.updateTask(task.id, { status: 'DONE' }, preserved.revision)
        expect(changed).toMatchObject({ title: '检查生产证书', status: 'DONE' })
        return {
          selectedTitle: selected.row.title,
          externalTitle: preserved.row.title,
          staleUpdateRejected: true,
          staleDeleteRejected: true,
          statusAfterRejections: preserved.row.status,
          freshRevisionUpdate: { title: changed.title, status: changed.status },
        }
      } finally {
        writer.close()
      }
    })()
    const beforeReopen = await service.getRecord('task', task.id)
    expect(titles(await service.searchPersonal({ text: '生产证书' }))).toEqual(['检查生产证书'])
    service.close()
    const reopened = new PersonalService(new Context(), { databasePath: path, timezone: 'UTC' })
    try {
      const afterReopen = await reopened.getRecord('task', task.id)
      const rebuiltSearch = titles(await reopened.searchPersonal({ text: '生产证书' }))
      expect(afterReopen).toEqual(beforeReopen)
      expect(rebuiltSearch).toEqual(['检查生产证书'])
      return {
        ...edited,
        coldReopen: {
          rowEqual: JSON.stringify(afterReopen.row) === JSON.stringify(beforeReopen.row),
          revisionEqual: afterReopen.revision === beforeReopen.revision,
          title: afterReopen.row.title,
          status: afterReopen.row.status,
          rebuiltSearch,
        },
      }
    } finally {
      reopened.close()
    }
  })

  const indexConsistency = await withFixture(async (service, path) => {
    const task = await service.createTask({ title: '旧证书' })
    const reader = await openPersonalDatabase(path)
    const writer = await openPersonalDatabase(path)
    try {
      const index = personalSearchIndex(reader)
      const input = { text: '证书', weights: resolveSearchWeights({}) }
      expect(titles(index.search(input))).toEqual(['旧证书'])
      writer.prepare('UPDATE tasks SET title = ? WHERE id = ?').run('新证书', task.id)
      let injected = false
      reader.function('personal_search_tokens', value => {
        // The production index calls this function during its rebuild. Commit
        // from a second connection while the reader holds its WAL snapshot.
        if (!injected) {
          injected = true
          writer.prepare('UPDATE tasks SET title = ? WHERE id = ?').run('域名续费', task.id)
        }
        return tokenizeSearch(String(value), true).join(' ')
      })
      const pinnedSnapshot = titles(index.search(input))
      expect(injected).toBe(true)
      expect(pinnedSnapshot).toEqual(['新证书'])
      const nextCertificateSearch = titles(index.search(input))
      const nextDomainSearch = titles(index.search({ ...input, text: '域名' }))
      expect(nextCertificateSearch).toEqual([])
      expect(nextDomainSearch).toEqual(['域名续费'])

      reader.exec('BEGIN IMMEDIATE')
      reader.prepare('UPDATE tasks SET title = ? WHERE id = ?').run('回滚记录', task.id)
      reader.exec('ROLLBACK')
      const afterLocalRollback = titles(index.search({ ...input, text: '域名' }))
      expect(afterLocalRollback).toEqual(['域名续费'])
      expect(titles(index.search({ ...input, text: '回滚记录' }))).toEqual([])

      writer.prepare('UPDATE tasks SET title = ? WHERE id = ?').run('证书续期', task.id)
      reader.function('personal_search_tokens', (_value) => { throw new Error('index build interrupted by experiment') })
      expect(() => index.search(input)).toThrow('index build interrupted by experiment')
      reader.function('personal_search_tokens', value => tokenizeSearch(String(value), true).join(' '))
      const afterFailedRebuildRetry = titles(index.search(input))
      expect(afterFailedRebuildRetry).toEqual(['证书续期'])
      expect(reader.prepare("SELECT name FROM main.sqlite_schema WHERE name LIKE 'personal_search%'").all()).toEqual([])
      expect(reader.prepare('PRAGMA user_version').get()).toEqual({ user_version: 4 })
      return {
        externalCommitDuringRebuild: '域名续费',
        pinnedSnapshot,
        nextCertificateSearch,
        nextDomainSearch,
        afterLocalRollback,
        failedRebuildRejected: true,
        afterFailedRebuildRetry,
        durableSearchTables: [],
        durableSchemaVersion: 4,
      }
    } finally {
      writer.close()
      reader.close()
    }
  })

  const observations = { node: process.version, retrieval, guardedEdit, indexConsistency }
  const json = JSON.stringify(observations, null, 2) + '\n'
  if (process.env.PERSONAL_EXPERIMENT_TRACE !== undefined) {
    await writeFile(process.env.PERSONAL_EXPERIMENT_TRACE, json, 'utf8')
  }
  console.log(json)
})
