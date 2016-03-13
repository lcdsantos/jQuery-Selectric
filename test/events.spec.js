'use strict';

describe('events', function() {
  var select;

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

  it('should trigger events', function() {
    var events = jasmine.createSpyObj('events', [
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

    select.selectric('destroy');
    select.on('selectric-before-init',   events.beforeInit);
    select.on('selectric-init',          events.init);
    select.on('selectric-before-open',   events.beforeOpen);
    select.on('selectric-open',          events.open);
    select.on('selectric-before-close',  events.beforeClose);
    select.on('selectric-close',         events.close);
    select.on('selectric-before-change', events.beforeChange);
    select.on('selectric-change',        events.change);
    select.on('selectric-refresh',       events.refresh);
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

  it('should trigger hooks callbacks', function() {
    var hooks = jasmine.createSpyObj('hooks', [
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

    select.selectric('destroy');
    $.fn.selectric.hooks.add('BeforeInit',   'test', hooks.beforeInit);
    $.fn.selectric.hooks.add('BeforeInit',   'test2', hooks.beforeInit);
    $.fn.selectric.hooks.add('BeforeInit',   'test3', hooks.beforeInit);
    $.fn.selectric.hooks.remove('BeforeInit', 'test3');
    $.fn.selectric.hooks.add('Init',         'test', hooks.init);
    $.fn.selectric.hooks.add('BeforeOpen',   'test', hooks.beforeOpen);
    $.fn.selectric.hooks.add('Open',         'test', hooks.open);
    $.fn.selectric.hooks.add('BeforeClose',  'test', hooks.beforeClose);
    $.fn.selectric.hooks.add('Close',        'test', hooks.close);
    $.fn.selectric.hooks.add('BeforeChange', 'test', hooks.beforeChange);
    $.fn.selectric.hooks.add('Change',       'test', hooks.change);
    $.fn.selectric.hooks.add('Refresh',      'test', hooks.refresh);
    select.selectric();

    $('.selectric').click();
    $('.selectric-items').find('li:eq(4)').click();
    select.selectric('refresh');

    expect(hooks.beforeInit).toHaveBeenCalledTimes(2);
    expect(hooks.init).toHaveBeenCalled();
    expect(hooks.beforeOpen).toHaveBeenCalled();
    expect(hooks.open).toHaveBeenCalled();
    expect(hooks.beforeClose).toHaveBeenCalled();
    expect(hooks.close).toHaveBeenCalled();
    expect(hooks.beforeChange).toHaveBeenCalled();
    expect(hooks.change).toHaveBeenCalled();
    expect(hooks.refresh).toHaveBeenCalled();
  });
});