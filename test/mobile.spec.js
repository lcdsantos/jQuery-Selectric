/* eslint-env jasmine, jquery */
/* global loadFixtures */

'use strict';

describe('mobile', function() {
  var select;
  var multiple;
  var oldUserAgent = window.navigator.userAgent;

  function setUserAgent(window, userAgent) {
    if (window.navigator.userAgent != userAgent) {
      var userAgentProp = { get: function () { return userAgent; } };
      try {
        Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
      } catch (e) {
        window.navigator = Object.create(navigator, {
          userAgent: userAgentProp
        });
      }
    }
  }

  describe('Single Selects', function () {

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
      loadFixtures('basic.html');

      select = $('#basic');
      select.selectric();
    });

    afterEach(function() {
      setUserAgent(window, oldUserAgent);
    });

    it('should not enabled on android', function() {
      setUserAgent(window, 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19');
      select.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should not enabled on ipad', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10');
      select.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should not enabled on ipod', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3');
      select.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should not enabled on iphone', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3');
      select.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should enabled on android', function() {
      setUserAgent(window, 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19');
      select.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    it('should enabled on ipad', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10');
      select.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    it('should enabled on ipod', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3');
      select.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    it('should enabled on iphone', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3');
      select.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    it('should refresh the select after change', function () {
      setUserAgent(window, 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19');
      select.selectric({
        disableOnMobile: false,
        nativeOnMobile: true
      });
      var spy = spyOn(select.data('selectric'), 'refresh');
      select.trigger('change');
      expect(spy).toHaveBeenCalled();
    });

    describe('nativeOnMobile',  function () {
      beforeEach(function () {
        setUserAgent(window, 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3');
        select.selectric({
          disableOnMobile: false,
          nativeOnMobile: true
        });
      });

      afterEach(function() {
        setUserAgent(window, oldUserAgent);
      });

      it('should add class `selectric-is-native`', function () {
        expect($('.selectric-wrapper').find('.selectric-is-native').length).toBe(1);
      });

      it('should update the label', function () {
        select.find('option').eq(2).prop('selected', true);
        select.find('option').eq(3).prop('selected', false);
        select.selectric('refresh');
        expect($('.selectric-wrapper').find('.label').text()).toBe('Apple');
      });
    });

    it('open() should return false on mobile', function () {
      select.selectric();
      spyOn(select.data('selectric').utils, 'isMobile').and.returnValue(true);
      spyOn(select.data('selectric').options, 'nativeOnMobile').and.returnValue(true);
      expect(select.data('selectric').open()).toBe(false);
    });

  });

  describe('Multi Selects', function () {

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
      loadFixtures('multiple.html');

      multiple = $('#multiple');
      multiple.selectric();
    });

    afterEach(function() {
      setUserAgent(window, oldUserAgent);
    });

    it('should not enabled on android', function() {
      setUserAgent(window, 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19');
      multiple.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should not enabled on ipad', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10');
      multiple.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should not enabled on ipod', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3');
      multiple.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should not enabled on iphone', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3');
      multiple.selectric({
        disableOnMobile: true,
        nativeOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(0);
    });

    it('should enabled on android', function() {
      setUserAgent(window, 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19');
      multiple.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    it('should enabled on ipad', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10');
      multiple.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    it('should enabled on ipod', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3');
      multiple.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    it('should enabled on iphone', function() {
      setUserAgent(window, 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3');
      multiple.selectric({
        disableOnMobile: false
      });
      expect($('.selectric-wrapper').length).toBe(1);
    });

    describe('nativeOnMobile',  function () {
      beforeEach(function () {
        setUserAgent(window, 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3');
        multiple.selectric({
          disableOnMobile: false,
          nativeOnMobile: true
        });
      });

      it('should add class `selectric-is-native`', function () {
        expect($('.selectric-wrapper').find('.selectric-is-native').length).toBe(1);
      });

      it('should update the label', function () {
        multiple.find('option').eq(2).prop('selected', true);
        multiple.find('option').eq(3).prop('selected', false);
        multiple.selectric('refresh');
        expect($('.selectric-wrapper').find('.label').text()).toBe('Cat');
      });

      it('should update the label with multiple selected values', function () {
        multiple.find('option').eq(2).prop('selected', true);
        multiple.find('option').eq(3).prop('selected', true);
        multiple.selectric('refresh');
        expect($('.selectric-wrapper').find('.label').text()).toBe('Cat, Dog');
      });
    });
  });
});
