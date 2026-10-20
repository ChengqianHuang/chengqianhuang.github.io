/**
 * Reproduce turn attribution with dsh-lark commit 1165fe8 and its published DSH dependencies.
 * Copy this file into that checkout's tests/ directory, then run:
 * node node_modules/vitest/vitest.mjs run tests/turn-ownership-experiment.spec.ts --reporter=verbose
 *
 * The existing runtime fixture keeps inboxes, loops, sessions and persistence real;
 * its scripted model replaces network inference. This experiment does not contact Lark.
 * Printed producer names identify the two synthetic inputs; no random ids or paths are printed.
 */
import { expect, it, onTestFinished } from 'vitest'
import type { Agent, AgentHandle } from '@deepseek-ai/dsh-agent'
import { createUserMessage, type GenerateOptions, type StreamChunk, type UserMessage } from '@deepseek-ai/dsh-llm'
import { SessionId, SessionSeq } from '@deepseek-ai/dsh-session'
import { runMessageTurn, summarizeTurn } from '../src/summary.ts'
import { runtime, textResponse } from './helpers/runtime.ts'

type Method = 'whole-agent-idle' | 'claimed-turn'
type Observation =
  | { event: 'agent/inbox/claimed'; producer: 'lark' | 'ui'; turn: number }
  | { event: 'assistant/message'; turn: number; text: string }
  | { event: 'turn/end'; turn: number; reason: string }

/** Intentionally wrong: whole-agent idle identifies no particular submitted input. */
async function wholeAgentIdle(agent: Agent, message: UserMessage): Promise<string> {
  const firstSeq = agent.session.seq
  agent.followup(message)
  await agent.whenIdle()
  for (let seq = agent.session.seq - 1; seq >= firstSeq; seq--) {
    const event = agent.session.eventAt(SessionSeq(seq))
    if (event?.type === 'turn/end') return summarizeTurn(agent.session, firstSeq, event.data.turn)
  }
  throw new Error('Expected a completed turn')
}

/** Wait for an explicit release, while allowing failed assertions to cancel the stream. */
async function waitForRelease(release: Promise<void>, signal: AbortSignal | undefined): Promise<void> {
  const aborted = Promise.withResolvers<never>()
  const abort = (): void => { aborted.reject(new Error('Experiment stream canceled')) }
  if (signal?.aborted) abort()
  else signal?.addEventListener('abort', abort, { once: true })
  try { await Promise.race([release, aborted.promise]) }
  finally { signal?.removeEventListener('abort', abort) }
}

async function scenario(method: Method) {
  const uiStarted = Promise.withResolvers<void>()
  const releaseUi = Promise.withResolvers<void>()
  const uiEnded = Promise.withResolvers<void>()
  const uiScript = async function* (options: GenerateOptions): AsyncIterable<StreamChunk> {
    try {
      uiStarted.resolve()
      await waitForRelease(releaseUi.promise, options.signal)
      yield* textResponse('ui answer')
    } finally { uiEnded.resolve() }
  }
  const h = await runtime(['lark answer', uiScript])
  let handle: AgentHandle | undefined
  let result: Promise<string> | undefined
  const listeners: Array<() => void> = []
  let disposal: Promise<void> | undefined
  const close = (): Promise<void> => {
    disposal ??= (async () => {
      for (const off of listeners.splice(0)) off()
      releaseUi.resolve()
      try {
        await handle?.dispose()
        if (result !== undefined) await Promise.allSettled([result])
      } finally { await h.close() }
    })()
    return disposal
  }
  onTestFinished(close)
  try {
    handle = await h.ctx.agents.create({
      sessionId: SessionId(`lark-ownership-experiment-${method}`),
      agentOptions: { provider: 'mock', model: 'mock' },
    })
    const agent = handle.agent
    const lark = createUserMessage({ content: [{ type: 'text', text: 'Synthetic Lark request' }], source: { kind: 'user' } })
    const ui = createUserMessage({ content: [{ type: 'text', text: 'Synthetic UI request' }], source: { kind: 'user' } })
    const events: Observation[] = []
    listeners.push(agent.ctx.on('agent/inbox/claimed', payload => {
      if (payload.agent !== agent) return
      const producer = payload.message.id === lark.id ? 'lark' : payload.message.id === ui.id ? 'ui' : undefined
      if (producer !== undefined) events.push({ event: 'agent/inbox/claimed', producer, turn: payload.turn })
    }))
    listeners.push(agent.ctx.on('session/event', (session, event) => {
      if (session !== agent.session) return
      if (event.type === 'assistant/message') {
        const text = event.data.message.content.flatMap(block => block.type === 'text' ? [block.text] : []).join('')
        events.push({ event: 'assistant/message', turn: event.data.turn, text })
      } else if (event.type === 'turn/end') {
        events.push({ event: 'turn/end', turn: event.data.turn, reason: event.data.reason.kind })
      }
    }))
    // This event occurs after the first response and before the driver decides whether to stop.
    const off = agent.ctx.on('agent/turn-stopping', ({ turn }) => {
      if (turn !== 1) return
      off()
      agent.followup(ui)
    })
    listeners.push(off)

    result = method === 'whole-agent-idle'
      ? wholeAgentIdle(agent, lark)
      : runMessageTurn(agent, lark, new AbortController().signal).then(outcome => {
          if (outcome.kind !== 'finished' || outcome.reason.kind !== 'completed') throw new Error('Expected the owned turn to complete')
          return outcome.text
        })
    let consumer: 'pending' | 'fulfilled' | 'rejected' = 'pending'
    void result.then(() => { consumer = 'fulfilled' }, () => { consumer = 'rejected' })

    await uiStarted.promise
    expect(agent.status).toBe('running')
    expect(events).toEqual([
      { event: 'agent/inbox/claimed', producer: 'lark', turn: 1 },
      { event: 'assistant/message', turn: 1, text: 'lark answer' },
      { event: 'turn/end', turn: 1, reason: 'completed' },
      { event: 'agent/inbox/claimed', producer: 'ui', turn: 2 },
    ])
    // UI cannot finish until releaseUi.resolve(); no sleep or scheduler flush establishes this checkpoint.
    const checkpointText = method === 'claimed-turn' ? await result : null
    const whileUiBlocked = { agentStatus: agent.status, consumer, text: checkpointText }
    expect(whileUiBlocked).toEqual({
      agentStatus: 'running',
      consumer: method === 'whole-agent-idle' ? 'pending' : 'fulfilled',
      text: method === 'whole-agent-idle' ? null : 'lark answer',
    })

    releaseUi.resolve()
    await uiEnded.promise
    const returned = await result
    await agent.whenIdle()
    expect(agent.status).toBe('idle')
    expect(returned).toBe(method === 'whole-agent-idle' ? 'ui answer' : 'lark answer')
    expect(events.slice(4)).toEqual([
      { event: 'assistant/message', turn: 2, text: 'ui answer' },
      { event: 'turn/end', turn: 2, reason: 'completed' },
    ])
    return { method, whileUiBlocked, afterUiReleased: { agentStatus: agent.status, returned }, observedRuntimeEvents: events }
  } finally { await close() }
}

it('compares whole-agent idle with message-owned completion while a later UI turn is blocked', async () => {
  const legacy = await scenario('whole-agent-idle')
  const owned = await scenario('claimed-turn')
  console.log(JSON.stringify({ dshLarkCommit: '1165fe8', dshPackages: '0.1.2-alpha.5', scenarios: [legacy, owned] }, null, 2))
})
