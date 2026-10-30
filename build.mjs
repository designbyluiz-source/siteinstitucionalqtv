import { build } from 'esbuild';
await build({entryPoints:['src/hero.js'],outfile:'dist/assets/hero-3d.js',bundle:true,format:'esm',minify:true,target:['es2020'],legalComments:'linked'});
