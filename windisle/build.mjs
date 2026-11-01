import {build} from 'esbuild';
import {mkdir, copyFile} from 'node:fs/promises';
await mkdir('dist', {recursive: true});
await build({entryPoints: ['src/main.mjs'], outfile: 'dist/windisle.js', bundle: true, minify: true, format: 'esm', target: 'es2022', legalComments: 'linked'});
await copyFile('node_modules/three/LICENSE', 'dist/LICENSE.txt');
console.log('Built Wind Isle. All runtime assets are generated locally.');
