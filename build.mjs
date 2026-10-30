import { build } from 'esbuild';
await build({entryPoints:{'hero-3d':'src/hero.js','illustrations-3d':'src/illustrations.js'},outdir:'dist/assets',bundle:true,splitting:true,format:'esm',minify:true,target:['es2020'],chunkNames:'shared-[hash]',legalComments:'linked'});
