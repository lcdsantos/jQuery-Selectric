/* eslint-env jasmine, jquery */
/* global loadFixtures */

'use strict';

describe('events', function() {
  var select = false;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('basic.html');

    select = $('#basic');
    select.selectric();
  });

  it('should trigger change event', function() {
    var changedFn = jasmine.createSpy('changedFn');
    select.on('change', changedFn);
    $('.selectric').click();
    $('.selectric-items').find('li:eq(4)').click();
    expect(changedFn).toHaveBeenCalled();
  });

  it('should not trigger change event', function() {
    var notChangedFn = jasmine.createSpy('notChangedFn');
    select.on('change', notChangedFn);
    $('.selectric').click();
    $('.selectric-items').find('li.selected').click();
    expect(notChangedFn).not.toHaveBeenCalled();
  });

  it('should trigger events', function() {
    var events = jasmine.createSpyObj('events', [
      'beforeInit',
      'init',
      'beforeOpen',
      'open',
      'beforeClose',
      'close',
      'beforeHighlight',
      'highlight',
      'beforeSelect',
      'select',
      'beforeChange',
      'change',
      'refresh'
    ]);

    select.selectric('destroy');
    select.on('selectric-before-init',      events.beforeInit);
    select.on('selectric-init',             events.init);
    select.on('selectric-before-open',      events.beforeOpen);
    select.on('selectric-open',             events.open);
    select.on('selectric-before-close',     events.beforeClose);
    select.on('selectric-close',            events.close);
    select.on('selectric-before-highlight', events.beforeHighlight);
    select.on('selectric-highlight',        events.highlight);
    select.on('selectric-before-select',    events.beforeSelect);
    select.on('selectric-select',           events.select);
    select.on('selectric-before-change',    events.beforeChange);
    select.on('selectric-change',           events.change);
    select.on('selectric-refresh',          events.refresh);
    select.selectric();

    $('.selectric').click();
    $('.selectric-items').find('li:eq(4)').click();
    select.selectric('refresh');

    expect(events.beforeInit).toHaveBeenCalled();
    expect(events.init).toHaveBeenCalled();
    expect(events.beforeOpen).toHaveBeenCalled();
    expect(events.open).toHaveBeenCalled();
    expect(events.beforeClose).toHaveBeenCalled();
    expect(events.close).toHaveBeenCalled();
    expect(events.beforeHighlight).toHaveBeenCalled();
    expect(events.highlight).toHaveBeenCalled();
    expect(events.beforeSelect).toHaveBeenCalled();
    expect(events.select).toHaveBeenCalled();
    expect(events.beforeChange).toHaveBeenCalled();
    expect(events.change).toHaveBeenCalled();
    expect(events.refresh).toHaveBeenCalled();
  });

  it('should trigger callbacks', function() {
    var callbacks = jasmine.createSpyObj('callbacks', [
      'beforeInit',
      'init',
      'beforeOpen',
      'open',
      'beforeClose',
      'close',
      'beforeChange',
      'change',
      'refresh'
    ]);

    select.selectric({
      onBeforeInit:   callbacks.beforeInit,
      onInit:         callbacks.init,
      onBeforeOpen:   callbacks.beforeOpen,
      onOpen:         callbacks.open,
      onBeforeClose:  callbacks.beforeClose,
      onClose:        callbacks.close,
      onBeforeChange: callbacks.beforeChange,
      onChange:       callbacks.change,
      onRefresh:      callbacks.refresh
    });

    $('.selectric').click();
    $('.selectric-items').find('li:eq(4)').click();
    select.selectric('refresh');

    expect(callbacks.beforeInit).toHaveBeenCalled();
    expect(callbacks.init).toHaveBeenCalled();
    expect(callbacks.beforeOpen).toHaveBeenCalled();
    expect(callbacks.open).toHaveBeenCalled();
    expect(callbacks.beforeClose).toHaveBeenCalled();
    expect(callbacks.close).toHaveBeenCalled();
    expect(callbacks.beforeChange).toHaveBeenCalled();
    expect(callbacks.change).toHaveBeenCalled();
    expect(callbacks.refresh).toHaveBeenCalled();
  });

  it('should not bind events when select is disabled after init', function() {
    select.prop('disabled', true).selectric('refresh');
    $('.selectric').trigger('click');
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(false);
  });
});
