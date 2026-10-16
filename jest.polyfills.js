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

if (typeof globalThis.Headers === 'undefined') {
  const HeadersPolyfill = class Headers {
    constructor(init) {
      this._map = new Map();
      if (init && typeof init === 'object') {
        for (const [key, value] of Object.entries(init)) {
          this._map.set(String(key).toLowerCase(), String(value));
        }
      }
    }
    append(name, value) {
      this._map.set(String(name).toLowerCase(), String(value));
    }
    get(name) {
      return this._map.get(String(name).toLowerCase()) ?? null;
    }
    has(name) {
      return this._map.has(String(name).toLowerCase());
    }
    set(name, value) {
      this._map.set(String(name).toLowerCase(), String(value));
    }
    delete(name) {
      this._map.delete(String(name).toLowerCase());
    }
  };
  globalThis.Headers = HeadersPolyfill;
  if (typeof global !== 'undefined') {
    global.Headers = HeadersPolyfill;
  }
}
