import * as esbuild from 'esbuild'

esbuild
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.js',
    minify: true,
    sourcemap: true,
  })
  .catch(() => {
    process.exit(1)
  })
