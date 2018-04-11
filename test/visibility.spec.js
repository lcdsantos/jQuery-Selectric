/* eslint-env jasmine, jquery */
/* global loadFixtures */

'use strict';

describe('visibility', function() {
  var select = false;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('basic.html');

    select = $('#basic');
    select.selectric();
  });

  it('should toggle visibility on click', function() {
    $('.selectric').click();
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(true);
    $('.selectric').click();
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(false);
  });

  it('should open on focus', function() {
    $('.selectric-wrapper').find('ul[role="listbox"]').focusin();
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(true);
  });

  it('should add .selectric-focus on focus', function() {
    $('.selectric-wrapper').find('ul[role="listbox"]').focusin();
    expect($('.selectric-wrapper').hasClass('selectric-focus')).toBe(true);
  });

  it('should remove .selectric-focus on focusout', function() {
    $('select').focus();
    $(document.activeElement).blur();
    expect($('.selectric-wrapper').hasClass('selectric-focus')).toBe(false);
  });

  it('should prevent the flicker when focusing out and back again', function() {
    var spy = spyOn($.fn, 'blur');
    $('.selectric').click();
    $(document.activeElement).blur();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open/close on click', function() {
    $('.selectric').click();
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(true);
    $('.selectric').click();
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(false);
  });

  it('should open/close programmatically', function() {
    select.selectric('open');
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(true);
    select.selectric('close');
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(false);
  });

  it('should open on mouseover and close after timeout', function(done) {
    select.selectric({
      openOnHover: true,
      hoverIntentTimeout: 30
    });

    var $wrapper = $('.selectric-wrapper');

    $wrapper.trigger('mouseenter');
    expect($wrapper.hasClass('selectric-open')).toBe(true);

    $wrapper.trigger('mouseleave');
    setTimeout(function() {
      expect($wrapper.hasClass('selectric-open')).toBe(false);
      done();
    }, 40);
  });
});
