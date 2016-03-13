'use strict';

describe('basic suite', function() {
  var select;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('basic.html');

    select = $('#basic');
    select.selectric();
  });

  it('should be defined', function() {
    expect(jQuery.fn.selectric).toBeDefined();
  });

  it('should create very basic selectric', function() {
    expect(select.size()).toBe(1);
  });

  it('should have $.data defined', function() {
    expect(typeof $.data(select)).toBe('object');
  });

  it('should not be empty', function() {
    expect(select.val()).toBe('apricot');
  });

  it('should hide original <select>', function() {
    expect(select.is(':visible')).toBe(false);
  });

  it('should add disabled class', function() {
    select.prop('disabled', true);
    select.selectric('refresh')
    expect($('.selectric-wrapper').hasClass('selectric-disabled')).toBe(true);
  });

  it('should support <optgroup>', function() {
    loadFixtures('optgroup.html');

    select = $('#optgroup');
    select.selectric();

    expect($('.selectric-wrapper').find('.selectric-group').length).toBe(3);
    expect($('.selectric-wrapper').find('.selectric-group.disabled').length).toBe(1);
    expect($('.selectric-wrapper').find('.selectric-group-label').length).toBe(3);
  });

  it('should add class on hover', function() {
    $('.selectric').trigger('mouseenter');
    expect($('.selectric-wrapper').hasClass('selectric-hover')).toBe(true);
  });

  it('should search an option', function() {
    $('.selectric-input').val('banana').trigger('input');
    $('.selectric-items').find('.selected').click();
    expect(select.val()).toBe('banana');
  });

  it('should not be bigger than max-height', function() {
    select.selectric({
      maxHeight: 120
    }).selectric('open');
    expect($('.selectric-items').height()).toBe(120);
  });

  it('should be able to change button markup', function() {
    var char = String.fromCharCode(0x30A0 + Math.random() * (0x30FF-0x30A0+1));

    select.selectric({
      arrowButtonMarkup: '<b class="button">' + char + '</b>',
    });

    expect($('.button').html()).toBe(char);
  });

  it('should be bigger than wrapper', function() {
    select.selectric({
      expandToItemText: true
    });

    $('.selectric-wrapper').width(80);
    select.selectric('open');
    expect($('.selectric-items').width()).toBeGreaterThan(80);
  });

  it('should add new items', function() {
    var len = $('.selectric-items').find('li').length;
    select.append('<option>New</option>');
    select.selectric('refresh');
    expect($('.selectric-items').find('li').length).toBe(len+1);
  });

  it('should remove items', function() {
    var len = $('.selectric-items').find('li').length;
    select.find('option:eq(1)').remove();
    select.selectric('refresh');
    expect($('.selectric-items').find('li').length).toBe(len-1);
  });

  it('should disable items', function() {
    select.find('option:eq(1)').prop('disabled', true);
    select.selectric('refresh');
    expect($('.selectric-items').find('li:eq(1)').hasClass('disabled')).toBe(true);
  });

  it('should update label', function() {
    $('.selectric').click();
    $('.selectric-items').find('li:eq(4)').click();
    expect($('.selectric-wrapper').find('.label').text()).toBe('Banana');
  });

  it('should original select value', function() {
    $('.selectric').click();
    $('.selectric-items').find('li:eq(4)').click();
    expect(select.val()).toBe('banana');
  });

  it('should have custom label', function() {
    select.selectric({
      labelBuilder: function(currItem) {
        return '<strong>' + currItem.text + '</strong>';
      }
    });
    expect($('.selectric-wrapper').find('.label').find('strong').length).toBe(1);
  });

  it('should have custom option item text', function() {
    select.selectric({
      optionsItemBuilder: function(itemData, element, index) {
        return '<span>' + itemData.text + '</span>';
      }
    });
    $('.selectric').click();
    expect($('.selectric-items').find('li.selected').find('span').length).toBe(1);
  });

  it('should have same width of original <select>', function() {
    var selectWidth = select.width();
    select.selectric({
      inheritOriginalWidth: true
    });
    expect($('.selectric-wrapper').width()).toBe(selectWidth);
  });

  it('should replace diacritics', function() {
    select.append('<option>áàãéèíìóòõúùñçÿ</option>');
    select.selectric('refresh');
    var newItem = select.data('selectric').items.pop();
    expect(newItem.slug).toBe('aaaeeiiooouuncy');
  });

  it('should change classes prefix', function() {
    select.selectric({
      customClass: {
        prefix: 'custom'
      }
    });
    expect($('.custom-wrapper').length).toBe(1);
  });

  it('should change classes to camelcase', function() {
    select.selectric({
      customClass: {
        camelCase: true
      }
    });
    expect($('.selectricWrapper').length).toBe(1);
  });

  it('should destroy and remove created elements', function() {
    select.selectric('destroy');
    expect(select.data('selectric')).toBeUndefined();
    expect($('.selectric-wrapper').length).toBe(0);
  });
});
