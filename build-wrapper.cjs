#!/usr/bin/env node

// Run our patched Vite build command
const { spawn } = require('child_process');
const vite = spawn('node', ['vite-crypto-patch.cjs', 'build'], { 
  stdio: 'inherit',
  shell: true 
});

vite.on('close', (code) => {
  if (code !== 0) {
    process.exit(code);
  }
  
  // Run esbuild if Vite succeeds
  const esbuild = spawn('esbuild', [
    'server/index.ts',
    '--platform=node',
    '--packages=external',
    '--bundle',
    '--format=esm',
    '--outdir=dist'
  ], { 
    stdio: 'inherit',
    shell: true 
  });
  
  esbuild.on('close', (esbuildCode) => {
    process.exit(esbuildCode);
  });
});
