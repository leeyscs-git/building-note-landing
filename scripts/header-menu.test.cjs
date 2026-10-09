const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require.resolve('../jll-remix-header.js'), 'utf8');

function fixture() {
  const events = () => ({
    listeners: new Map(),
    addEventListener(type, fn) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(fn);
    },
    emit(type, event = {}) { this.listeners.get(type)?.forEach(fn => fn(event)); }
  });
  const classes = () => ({
    names: new Set(), contains(name) { return this.names.has(name); },
    toggle(name, on) { on ? this.names.add(name) : this.names.delete(name); }
  });
  let scroll = 4200;
  const doc = {...events(), activeElement: null};
  const element = () => ({...events(), attrs: {}, focusOptions: [],
    setAttribute(name, value) { this.attrs[name] = value; },
    getClientRects() { return [{}]; }, closest() { return null; },
    focus(options) {
      this.focusOptions.push(options); doc.activeElement = this;
      if (!options?.preventScroll) scroll = 0;
    }
  });
  const button = element(), brand = element(), link = element(), locale = element();
  const inactiveLink = {...element(), closest: () => ({inert: true})};
  const service = {closed: 0, close() { this.closed++; }};
  const services = [service, {}]; // A custom element may not yet be upgraded.
  const menu = {hidden: true, scrollTop: 90, querySelector: () => link,
    contains: node => node === link || node === locale};
  const background = [{inert: false}, {inert: true}];
  const header = {...events(), dataset: {page: 'hanwha'}, offsetHeight: 76,
    classList: classes(), contains: node => [button, brand, link, locale].includes(node),
    querySelector: selector => selector === '.menu-toggle' ? button : selector === '.brand' ? brand : menu,
    querySelectorAll: selector => selector === 'sps-service-menu' ? services : [brand, button, link, locale, inactiveLink]
  };
  doc.documentElement = {dataset: {}, style: {setProperty() {}}};
  doc.body = {classList: classes()};
  doc.querySelector = () => header;
  doc.querySelectorAll = () => background;
  const win = events(), mobile = events();
  class ResizeObserver { observe() {} }
  vm.runInNewContext(source, {document: doc, window: win, ResizeObserver, URL,
    scrollY: scroll, matchMedia: () => mobile,
    location: new URL('http://localhost/jll-remix-main-v4.html')});
  return {doc, win, header, menu, button, brand, link, locale, service, background, mobile,
    scroll: () => scroll, open: () => button.emit('click'),
    key: (key, extra = {}) => doc.emit('keydown', {key, preventDefault() {}, ...extra})};
}

test('opening and closing after a long scroll preserves position, focus and previous inert state', () => {
  const h = fixture();
  for (let i = 0; i < 20; i++) {
    h.open();
    assert.equal(h.menu.hidden, false);
    assert.equal(h.button.attrs['aria-expanded'], 'true');
    assert.ok(h.doc.body.classList.contains('sps-menu-open'));
    assert.equal(h.menu.scrollTop, 0);
    assert.ok(h.background.every(node => node.inert));
    assert.equal(h.doc.activeElement, h.link);
    assert.equal(h.scroll(), 4200);
    h.button.emit('click');
    assert.equal(h.menu.hidden, true);
    assert.equal(h.button.attrs['aria-expanded'], 'false');
    assert.ok(!h.doc.body.classList.contains('sps-menu-open'));
    assert.deepEqual(h.background.map(node => node.inert), [false, true]);
    assert.equal(h.scroll(), 4200);
  }
  assert.equal(h.service.closed, 20);
});

test('escape, outside click and inquiry handoff all release the menu without a scroll jump', () => {
  const h = fixture();
  h.open(); h.key('Escape', {defaultPrevented: true});
  assert.equal(h.menu.hidden, false, 'submenu Escape can be handled first');
  h.key('Escape');
  assert.equal(h.menu.hidden, true);
  h.open(); h.doc.emit('click', {target: {closest: () => null}, button: 0});
  assert.equal(h.menu.hidden, true);
  h.open(); h.win.SPSHeader.close();
  assert.equal(h.menu.hidden, true);
  assert.equal(h.background[0].inert, false);
  assert.equal(h.scroll(), 4200);
});

test('rotation and cached-page restoration cannot leave the page locked', () => {
  const h = fixture();
  h.open(); h.mobile.emit('change', {matches: false});
  assert.equal(h.menu.hidden, true);
  assert.equal(h.doc.activeElement, h.brand);
  h.open(); h.win.emit('pagehide');
  assert.equal(h.background[0].inert, false);
  h.open(); h.win.emit('pageshow');
  assert.equal(h.menu.hidden, true);
  assert.ok(!h.doc.body.classList.contains('sps-menu-open'));
  assert.equal(h.scroll(), 4200);
});

test('keyboard focus wraps around usable header controls, excluding inert submenu links', () => {
  const h = fixture();
  h.open(); h.doc.activeElement = h.locale;
  h.key('Tab'); assert.equal(h.doc.activeElement, h.brand);
  h.key('Tab', {shiftKey: true}); assert.equal(h.doc.activeElement, h.locale);
  assert.equal(h.scroll(), 4200);
});
