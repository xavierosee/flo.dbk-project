/**
 * router.test.js — unit tests for src/lib/router.js
 *
 * matchRoute is internal; we exercise it indirectly through route() and the
 * exported navigate() function.  Global stubs for window/location are set up
 * before the module is imported.
 *
 * Important note on module state: `routes` is a module-level array — every
 * call to route() accumulates permanently for the lifetime of the test run.
 * Tests are written so that unique patterns are registered per test and
 * verified via vi.fn() call-count checks that are isolated to each test's spy.
 */

import { describe, it, expect, vi } from 'vitest';

// ── Minimal browser-global stubs ────────────────────────────────────────────
const listeners = {};
global.window = {
  addEventListener: (event, cb) => {
    listeners[event] = cb;
  },
};
global.location = { hash: '#/' };

import { route, startRouter, navigate } from '../src/lib/router.js';

// Helper: simulate a hashchange dispatch to a given hash
function dispatch(hash) {
  global.location = { hash };
  if (listeners['hashchange']) {
    listeners['hashchange']();
  }
}

// ── navigate() ──────────────────────────────────────────────────────────────
describe('navigate()', () => {
  it('sets location.hash to the given path', () => {
    navigate('/pub/le-zinc-caen');
    expect(global.location.hash).toBe('/pub/le-zinc-caen');
  });

  it('sets location.hash to "/" for root', () => {
    navigate('/');
    expect(global.location.hash).toBe('/');
  });
});

// ── startRouter / dispatch exact paths ──────────────────────────────────────
describe('startRouter() — initial dispatch', () => {
  it('dispatches the current hash on startup', () => {
    const handler = vi.fn();
    // Use a unique pattern not used elsewhere to avoid false positives
    route('/startup-test', handler);
    global.location = { hash: '#/startup-test' };
    startRouter();
    expect(handler).toHaveBeenCalledWith({});
  });
});

// ── matchRoute through hashchange events ────────────────────────────────────
describe('route matching — exact static paths', () => {
  it('calls handler for exact "/exact-a" match', () => {
    const handler = vi.fn();
    route('/exact-a', handler);
    dispatch('#/exact-a');
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({});
  });

  it('does not call "/exact-b" handler when path is "/exact-b-other"', () => {
    const handler = vi.fn();
    route('/exact-b', handler);
    dispatch('#/exact-b-other'); // different segment — length differs
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call "/seg1/seg2" handler when path is "/seg1"', () => {
    const handler = vi.fn();
    route('/seg1/seg2', handler);
    dispatch('#/seg1'); // fewer segments
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('route matching — parameterised paths', () => {
  it('extracts a single :id param', () => {
    const handler = vi.fn();
    route('/pub/:id', handler);
    dispatch('#/pub/le-coq-rouennais');
    expect(handler).toHaveBeenCalledWith({ id: 'le-coq-rouennais' });
  });

  it('decodes URI-encoded param values', () => {
    const handler = vi.fn();
    route('/item/:slug', handler);
    dispatch('#/item/caf%C3%A9-du-port');
    expect(handler).toHaveBeenCalledWith({ slug: 'café-du-port' });
  });

  it('does not match when segment count differs from pattern', () => {
    const handler = vi.fn();
    route('/article/:id', handler);
    dispatch('#/article/foo/extra'); // one extra segment
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not match when a static segment in pattern does not equal path segment', () => {
    const handler = vi.fn();
    route('/wrong-prefix/:id', handler);
    dispatch('#/right-prefix/bar');
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('route matching — empty / missing hash', () => {
  it('treats empty hash as "/"', () => {
    // Register a unique catch-all path to confirm dispatch resolves to "/"
    const handler = vi.fn();
    route('/empty-hash-root', handler);

    // Register "/" handler to verify it is hit when hash is empty
    const rootHandler = vi.fn();
    route('/', rootHandler);

    dispatch(''); // empty hash → should dispatch to "/"
    expect(rootHandler).toHaveBeenCalled();
  });
});
