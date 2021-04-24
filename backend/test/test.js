// The testing framework for the server is 'Mocha'
// Run tests using 'npm run test'

const assert = require('assert');

describe('Simple Math Test', () => {
  it('should return 2', () => {
    assert.strictEqual(1+1, 2);
  });
  it('should return 9', () => {
    assert.strictEqual(3*3, 9);
  });
});