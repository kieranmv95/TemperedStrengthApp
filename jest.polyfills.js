/* Runs before jest-expo preset setup (see jest.config.js setupFiles). */
if (typeof globalThis.FormData === 'undefined') {
  const Polyfill = class FormData {
    append() {}
  };
  globalThis.FormData = Polyfill;
  if (typeof global !== 'undefined') {
    global.FormData = Polyfill;
  }
}
