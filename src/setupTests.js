// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom (used by jest-environment-jsdom in CRA 5) does not provide the
// WHATWG encoding globals. Modern libraries - react-router v7 among them -
// rely on TextEncoder/TextDecoder being available, so polyfill them from
// Node's `util` module before any application code is imported.
import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// jsdom does not implement matchMedia, which some components query on mount.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom logs "Not implemented: window.scrollTo" on every route change
// (see src/components/ScrollToTop.js). Stub it out.
if (typeof window !== 'undefined' && !window.scrollTo) {
  window.scrollTo = () => {};
}
