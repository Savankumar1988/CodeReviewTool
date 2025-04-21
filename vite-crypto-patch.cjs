#!/usr/bin/env node

// Create a global shim for crypto that will be applied before loading Vite
global.nodeCrypto = require('crypto');

// Store the original Module.prototype.require
const originalRequire = module.constructor.prototype.require;

// Override the require function to intercept crypto imports
module.constructor.prototype.require = function(id) {
  if (id === 'crypto' || id.endsWith('/crypto') || id.includes('/crypto/')) {
    const cryptoModule = originalRequire.call(this, id);
    
    // Only patch if getRandomValues doesn't exist
    if (!cryptoModule.getRandomValues) {
      cryptoModule.getRandomValues = function(typedArray) {
        return global.nodeCrypto.randomFillSync(typedArray);
      };
    }
    
    return cryptoModule;
  }
  
  return originalRequire.call(this, id);
};

// Get command line arguments
const args = process.argv.slice(2);

// Run Vite with the provided arguments
require('./node_modules/.bin/vite')(args);
