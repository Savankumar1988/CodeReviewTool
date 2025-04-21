#!/usr/bin/env node

// Set up the crypto polyfill
if (!globalThis.crypto) {
  globalThis.crypto = {};
}
if (!globalThis.crypto.getRandomValues) {
  const crypto = require('crypto');
  globalThis.crypto.getRandomValues = function(array) {
    return crypto.randomFillSync(array);
  };
}

// Run the Vite build command
const { spawn } = require('child_process');
const vite = spawn('./node_modules/.bin/vite', ['build'], { 
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
