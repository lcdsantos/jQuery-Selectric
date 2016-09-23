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
    $('.selectric-wrapper').find('.selectric').trigger('click');
    expect($('.selectric-items').is(':visible')).toBe(true);
    $('.selectric-wrapper').find('.selectric').trigger('click');
    expect($('.selectric-items').is(':visible')).toBe(false);
  });

  it('should open on focus', function() {
    $('.selectric-input').focusin();
    expect($('.selectric-items').is(':visible')).toBe(true);
  });

  it('should add .selectric-focus on focusin', function() {
    $('.selectric-input').focusin();
    expect($('.selectric-wrapper').hasClass('selectric-focus')).toBe(true);
  });

  it('should remove .selectric-focus on focusout', function() {
    $('.selectric-input').focusin().focusout();
    expect($('.selectric-wrapper').hasClass('selectric-focus')).toBe(false);
  });

  it('should prevent the flicker when focusing out and back again', function() {
    var spy = spyOn($.fn, 'blur');
    $('.selectric-input').focusin().trigger('blur').trigger('blur').trigger('blur');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open/close on click', function() {
    $('.selectric').click();
    expect($('.selectric-items').is(':visible')).toBe(true);
    $('.selectric').click();
    expect($('.selectric-items').is(':visible')).toBe(false);
  });

  it('should open/close programmatically', function() {
    select.selectric('open');
    expect($('.selectric-items').is(':visible')).toBe(true);
    select.selectric('close');
    expect($('.selectric-items').is(':visible')).toBe(false);
  });

  it('should open on mouseover and close after timeout', function(done) {
    select.selectric({
      openOnHover: true,
      hoverIntentTimeout: 30
    });

    var $wrapper = $('.selectric-wrapper');
    var $optionsBox = $('.selectric-items');

    $wrapper.trigger('mouseenter');
    expect($optionsBox.is(':visible')).toBe(true);

    $wrapper.trigger('mouseleave');
    setTimeout(function() {
      expect($optionsBox.is(':visible')).toBe(false);
      done();
    }, 40);
  });
});
