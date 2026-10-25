import {build} from 'esbuild';
import {copyFile,mkdir,readFile,writeFile,chmod} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['src/main.mjs'],outfile:'dist/racing.js',bundle:true,minify:true,format:'esm',target:'es2022',external:['node:module'],legalComments:'linked'});
await copyFile('node_modules/jolt-physics/dist/jolt-physics.wasm.wasm','dist/jolt-physics.wasm.wasm');
await chmod('dist/jolt-physics.wasm.wasm',0o644);
await writeFile('dist/LICENSES.txt',`Three.js\n${await readFile('node_modules/three/LICENSE','utf8')}\nJolt Physics\n${await readFile('node_modules/jolt-physics/LICENSE','utf8')}`);
console.log('Built racing/dist/racing.js and local Jolt WASM.');
