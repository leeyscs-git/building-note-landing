const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function headerFixture() {
  const events = new Map(), observations = [], values = {};
  const button = {addEventListener() {}};
  const menu = {hidden: true};
  const header = {
    dataset: {page: 'journal'}, contentHeight: 136, paddingTop: 16,
    get offsetHeight() { return this.contentHeight + this.paddingTop + 1; },
    querySelector: selector => selector === '.menu-toggle' ? button : menu,
    querySelectorAll: () => [],
    addEventListener() {}, classList: {toggle() {}}
  };
  const doc = {
    documentElement: {dataset: {}, style: {setProperty(name, value) { values[name] = value; }}},
    querySelector: () => header, querySelectorAll: () => [], addEventListener() {}
  };
  class ResizeObserver {
    constructor(callback) { this.callback = callback; }
    observe(target, options) {
      observations.push({target, callback: this.callback, box: options?.box || 'content-box'});
    }
  }
  const win = {addEventListener(name, callback) {
    if (!events.has(name)) events.set(name, []);
    events.get(name).push(callback);
  }};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../jll-remix-header.js'), 'utf8'), {
    document: doc, window: win, ResizeObserver, URL, scrollY: 0,
    location: new URL('http://localhost:3000/jll-remix-journal-v2.html'),
    matchMedia: () => ({addEventListener() {}})
  });
  // The browser may deliver the first measurement before saved theme padding arrives.
  observations.forEach(item => item.callback([]));
  return {header, values, emit(name) {events.get(name)?.forEach(callback => callback());},
    padding(value) {
      header.paddingTop = value;
      // Padding changes border-box size, but leave the observed content box unchanged.
      observations.filter(item => item.box === 'border-box').forEach(item => item.callback([]));
    }
  };
}

test('saved header padding changes cannot leave a 16px gap below the header', () => {
  const h = headerFixture();
  assert.equal(h.values['--sps-header-height'], '153px');
  h.padding(0);
  assert.equal(h.values['--sps-header-height'], '137px');
  h.padding(24);
  assert.equal(h.values['--sps-header-height'], '161px');
});

test('theme changes and history restore update the sticky boundary immediately', () => {
  const h = headerFixture();
  h.header.paddingTop = 0;
  h.emit('sps-theme-change');
  assert.equal(h.values['--sps-header-height'], '137px');
  h.header.contentHeight = 76;
  h.emit('pageshow');
  assert.equal(h.values['--sps-header-height'], '77px');
});
