/* eslint-env jasmine, jquery */
/* global loadFixtures */

'use strict';

describe('options', function() {

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('options.html');

    $('#forceRenderAbove select').selectric({ forceRenderAbove: true });
    $('#forceRenderBelow select').selectric({ forceRenderBelow: true });
  });

  it('should always have above class after initial open when using forceRenderAbove option', function() {
    // initial open
    $('#forceRenderAbove').find('.selectric').trigger('click');
    expect($('#forceRenderAbove').find('.selectric-wrapper').hasClass('selectric-above')).toBe(true);
    // close afterwards
    $('#forceRenderAbove').find('.selectric').trigger('click');
    expect($('#forceRenderAbove').find('.selectric-wrapper').hasClass('selectric-above')).toBe(true);
  });

  it('should always have below class after initial open when using forceRenderBelow option', function() {
    // initial open
    $('#forceRenderBelow').find('.selectric').trigger('click');
    expect($('#forceRenderBelow').find('.selectric-wrapper').hasClass('selectric-below')).toBe(true);
    // close afterwards
    $('#forceRenderBelow').find('.selectric').trigger('click');
    expect($('#forceRenderBelow').find('.selectric-wrapper').hasClass('selectric-below')).toBe(true);
  });

});
