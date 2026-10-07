const test = require('node:test');
const assert = require('node:assert/strict');
const { shouldUseDesktop } = require('../jll-remix-viewport.js');
const phone = { width:412, screenWidth:412, screenHeight:915, touchPoints:5, userAgent:'Android Mobile', visualScale:1 };
test('a normal phone, landscape phone and desktop window retain responsive layout', () => {
  assert.equal(shouldUseDesktop(phone), false);
  assert.equal(shouldUseDesktop({...phone,width:915,screenWidth:915,screenHeight:412}), false);
  assert.equal(shouldUseDesktop({...phone,width:980,screenWidth:1440,screenHeight:900,touchPoints:0,userAgent:'Windows'}), false);
  assert.equal(shouldUseDesktop({...phone,width:1024,screenWidth:1024,screenHeight:768,userAgent:'Macintosh'}), false);
});
test('wide desktop viewport on a touch phone uses the desktop composition', () => {
  assert.equal(shouldUseDesktop({...phone,width:980,userAgent:'X11 Linux x86_64',visualScale:412/980}), true);
  assert.equal(shouldUseDesktop({...phone,width:980,screenWidth:915,screenHeight:412,userAgent:'X11 Linux x86_64',visualScale:915/980}), true);
  assert.equal(shouldUseDesktop({...phone,width:980,screenWidth:980,screenHeight:1600,userAgent:'X11 Linux x86_64',visualScale:.42}), true);
});
test('explicit URLs work without device detection and allow opting out', () => {
  assert.equal(shouldUseDesktop({...phone,mode:'desktop'}), true);
  assert.equal(shouldUseDesktop({...phone,width:980,mode:'responsive',visualScale:.42}), false);
});
