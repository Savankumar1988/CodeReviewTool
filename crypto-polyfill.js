// Polyfill for crypto.getRandomValues on Node.js 16
import crypto from 'crypto';

// Patch globalThis.crypto or global.crypto
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {};
}

if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  globalThis.crypto.getRandomValues = function(typedArray) {
    return crypto.randomFillSync(typedArray);
  };
}

// Also patch global.crypto for Node.js environments
if (typeof global !== 'undefined') {
  if (typeof global.crypto === 'undefined') {
    global.crypto = globalThis.crypto;
  }

  if (typeof global.crypto.getRandomValues === 'undefined') {
    global.crypto.getRandomValues = globalThis.crypto.getRandomValues;
  }
}

// This helps ensure the polyfill is registered before any code runs
console.log('Crypto polyfill loaded for Node.js 16');