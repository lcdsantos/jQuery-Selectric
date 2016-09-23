/* eslint-env jasmine, jquery */
/* global loadFixtures, keyvent */

'use strict';

describe('keyboard', function() {
  var select = false;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('basic.html');

    select = $('#basic');
    select.selectric();
  });

  it('should open if has focus', function() {
    $('.selectric-input').focus();
    $('.selectric-items').find('li').click();
    var inputElm = document.activeElement;
    keyvent.on(inputElm).down('down');
    expect($('.selectric-items').is(':visible')).toBe(true);
  });

  it('should close on tab keypress', function() {
    $('.selectric').click();
    var inputElm = document.activeElement;
    keyvent.on(inputElm).down('tab');
    expect($('.selectric-items').is(':visible')).toBe(false);
  });

  it('should close on enter keypress', function() {
    $('.selectric').click();
    var inputElm = document.activeElement;
    keyvent.on(inputElm).down('enter');
    expect($('.selectric-items').is(':visible')).toBe(false);
  });

  it('should close on esc keypress', function() {
    $('.selectric').click();
    var inputElm = document.activeElement;
    keyvent.on(inputElm).down('enter');
    expect($('.selectric-items').is(':visible')).toBe(false);
  });

  it('should change value on keyboard navigation', function() {
    $('.selectric').click();
    var inputElm = document.activeElement;
    var kb = keyvent.on(inputElm);
    kb.down('down');
    kb.down('right');
    kb.down('down');
    kb.down('down');
    kb.down('up');
    kb.down('left');
    kb.down('down');
    kb.down('enter');
    expect(select.val()).toBe('blackberry');
  });

  it('should wrap navigating with keyboard forwards', function() {
    $('.selectric').click();
    var inputElm = document.activeElement;
    var kb = keyvent.on(inputElm);
    for (var i = 0; i < 57; i++) {
      kb.down('down');
    }
    kb.down('enter');
    expect(select.val()).toBe('apple');
  });

  it('should wrap navigating with keyboard backwards', function() {
    $('.selectric').click();
    var inputElm = document.activeElement;
    var kb = keyvent.on(inputElm);
    kb.down('up');
    kb.down('up');
    kb.down('up');
    kb.down('up');
    kb.down('enter');
    expect(select.val()).toBe('watermelon');
  });

  it('should not wrap navigating with keyboard', function() {
    select.selectric({
      allowWrap: false
    });
    $('.selectric').click();
    var inputElm = document.activeElement;
    var kb = keyvent.on(inputElm);
    kb.down('up');
    kb.down('up');
    kb.down('up');
    kb.down('up');
    for (var i = 0; i < 100; i++) {
      kb.down('down');
    }
    kb.down('enter');
    expect(select.val()).toBe('watermelon');
  });
});