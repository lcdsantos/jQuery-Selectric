'use strict';

describe('mobile', function() {
  var select;
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
    select.selectric();
    expect($('.selectric-wrapper').length).toBe(0);
  });

  it('should not enabled on ipad', function() {
    setUserAgent(window, 'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10');
    select.selectric();
    expect($('.selectric-wrapper').length).toBe(0);
  });

  it('should not enabled on ipod', function() {
    setUserAgent(window, 'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3');
    select.selectric();
    expect($('.selectric-wrapper').length).toBe(0);
  });

  it('should not enabled on iphone', function() {
    setUserAgent(window, 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3');
    select.selectric();
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
});