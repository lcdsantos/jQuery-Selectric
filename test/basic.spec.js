/* eslint-env jasmine, jquery */
/* global loadFixtures */

'use strict';

describe('basic suite', function() {
  var select = false;

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
    expect(select.parent().is(':visible')).toBe(false);
  });

  it('should add disabled class', function() {
    select.prop('disabled', true);
    select.selectric('refresh');
    expect($('.selectric-wrapper').hasClass('selectric-disabled')).toBe(true);
  });

  it('should add responsive class', function() {
    select.selectric({
      responsive: true
    });
    expect($('.selectric-wrapper').hasClass('selectric-responsive')).toBe(true);
  });

  it('should support <optgroup>', function() {
    loadFixtures('optgroup.html');

    select = $('#optgroup');
    select.selectric();

    expect($('.selectric-wrapper').find('.selectric-group').length).toBe(3);
    expect($('.selectric-wrapper').find('.selectric-group.disabled').length).toBe(1);
    expect($('.selectric-wrapper').find('.selectric-group-label').length).toBe(3);
  });

  it('should not select <optgroup> label', function() {
    loadFixtures('optgroup.html');

    select = $('#optgroup');
    select.selectric();

    $('.selectric').click();
    $('.selectric-wrapper').find('.selectric-group-label').click();
    expect(select.val()).toBe('0');
  });

  it('should add class on hover', function() {
    $('.selectric').trigger('mouseenter');
    expect($('.selectric-wrapper').hasClass('selectric-hover')).toBe(true);
  });

  it('should search an option', function() {
    $('.selectric-input').val('banana').trigger('input');
    $('.selectric-items').find('.highlighted').click();
    expect(select.val()).toBe('banana');
  });

  it('partial search should return first match', function() {
    $('.selectric-input').val('b').trigger('input');
    $('.selectric-items').find('.highlighted').click();
    expect(select.val()).toBe('banana');
  });

  it('should not search a disabled option', function() {
    select.find('option:eq(4)').prop('disabled', 'disabled');
    select.selectric('refresh');
    $('.selectric-input').val('banana').trigger('input');
    $('.selectric-items').find('.highlighted').lenght;
    expect($('.selectric-items').find('.highlighted').length).toBe(0);
  });  

  it('should search alternative text', function () {
    select.find('option:eq(6)').attr('data-alt', 'alt blackberry');
    select.selectric('refresh');
    $('.selectric-input').val('alt blackberry').trigger('input');
    $('.selectric-items').find('.highlighted').click();
    expect(select.val()).toBe('blackberry');
  });

  it('should search alternative text with separator', function () {
    select.find('option:eq(6)').attr('data-alt', 'alt blackberry | another berry');
    select.selectric('refresh');
    $('.selectric-input').val('alt blackberry').trigger('input');
    $('.selectric-items').find('.highlighted').click();
    expect(select.val()).toBe('blackberry');
  });

  it('should match first alternative text', function () {
    select.find('option:eq(8)').attr('data-alt', 'alt blueberry | zebra');
    select.find('option:eq(9)').attr('data-alt', 'alt cantalope | zilch');
    select.selectric('refresh');
    $('.selectric-input').val('z').trigger('input');
    $('.selectric-items').find('.highlighted').click();
    expect(select.val()).toBe('blueberry');
  });

  it('should search alternative text with separator 2', function () {
    select.find('option:eq(6)').attr('data-alt', 'alt blackberry | another berry');
    select.selectric('refresh');
    $('.selectric-input').val('another berry').trigger('input');
    $('.selectric-items').find('.highlighted').click();
    expect(select.val()).toBe('blackberry');
  });  

  it('should skip blank alternative text', function () {
    select.find('option:eq(6)').attr('data-alt', '');
    select.selectric('refresh');
    $('.selectric-input').val('a text that does not exist').trigger('input');
    expect($('.selectric-items').find('.highlighted').length).toBe(0);
  });    

  it('should skip blank alternative text with separator', function () {
    select.find('option:eq(6)').attr('data-alt', '|');
    select.selectric('refresh');
    $('.selectric-input').val('a text that does not exist').trigger('input');
    expect($('.selectric-items').find('.highlighted').length).toBe(0);
  });    

  it('highlight() should return undefined if index is undefined', function () {
    expect(select.data('selectric').highlight(undefined)).toBe(undefined);
  });

  it('should not be bigger than max-height', function() {
    select.selectric({
      maxHeight: 120
    }).selectric('open');
    expect($('.selectric-items').height()).toBe(120);
  });

  it('should be able to change button markup', function() {
    var char = String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));

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
    expect($('.selectric-items').find('li').length).toBe(len + 1);
  });

  it('should remove items', function() {
    var len = $('.selectric-items').find('li').length;
    select.find('option:eq(1)').remove();
    select.selectric('refresh');
    expect($('.selectric-items').find('li').length).toBe(len - 1);
  });

  it('should disable items', function() {
    select.find('option:eq(1)').prop('disabled', true);
    select.selectric('refresh');
    expect($('.selectric-items').find('li:eq(1)').hasClass('disabled')).toBe(true);
  });

  it('should not select disabled item', function() {
    select.find('option:eq(2)').prop('disabled', true);
    select.selectric('refresh');
    $('.selectric').click();
    $('.selectric-items').find('li:eq(2)').click();
    expect(select.val()).toBe('apricot');
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

  describe('optionsItemBuilder', function () {

    it('should have custom option item text', function() {
      select.selectric({
        optionsItemBuilder: function(itemData) {
          return '<span>' + itemData.text + '</span>';
        }
      });
      $('.selectric').click();
      expect($('.selectric-items').find('li.selected').find('span').length).toBe(1);
    });

    it('should have element available',function () {
      select.selectric({
        optionsItemBuilder: function(itemData, element) {
          element.addClass('testtest');
          return '<span>' + itemData.text + '</span>';
        }
      });
      expect(select).toHaveClass('testtest');
    });

    it('should have index available',function () {
      select.selectric({
        optionsItemBuilder: function(itemData, element, index) {
          return '<span class="item-' + index +'">' + itemData.text + '</span>';
        }
      });
      expect($('.selectric-items').find('li:first').find('.item-0').length).toBe(1);
    });
  });

  it('should have same width of original <select>', function() {
    var selectWidth = select.width();
    select.selectric({
      inheritOriginalWidth: true
    });
    expect($('.selectric-wrapper').width()).toBe(selectWidth);
  });

  it('should have same width of original <select> even if parent is hidden', function() {
    loadFixtures('hidden.html');
    var selectHidden = $('#select-hidden').selectric({
      inheritOriginalWidth: true
    });
    selectHidden.closest('.wrapper').show();
    var selectWidth = selectHidden.width();
    selectHidden.closest('.wrapper').hide();
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

  it('should change classes even if last char is a number', function() {
    select.selectric({
      customClass: {
        prefix: 'custom2'
      }
    });
    expect($('.custom2-wrapper').length).toBe(1);
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

  it('should prevent default event action on mousedown', function() {
    var event = new $.Event('mousedown');
    $('.selectric').click();
    $('.selectric-wrapper').find('li').eq(2).trigger(event);
    expect(event.isDefaultPrevented()).toBeTruthy();
  });

  it('should open on label click', function() {
    $('label').click();
    expect($('.selectric-wrapper').hasClass('selectric-open')).toBe(true);
  });

  it('should inherit option tag class', function() {
    expect(select.find('.customOptionClass').length).toBe(1);
  });

  it('should use the listBuilder', function() {
    select.selectric({
      listBuilder: function (items) {
        return $.each(items, function (index, ele) {
          ele.text = ele.text.toUpperCase();
        });
      }
    });
    $('.selectric').click();
    $('.selectric-items').find('li:eq(4)').click();
    expect($('.selectric-wrapper').find('.label').text()).toBe('BANANA');
  });
});
