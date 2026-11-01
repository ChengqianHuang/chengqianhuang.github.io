import {build} from 'esbuild';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['src/main.mjs'],outfile:'dist/pinball.js',bundle:true,minify:true,format:'esm',target:'es2022',legalComments:'linked'});
await writeFile('dist/LICENSES.txt',await readFile('node_modules/three/LICENSE','utf8'));
