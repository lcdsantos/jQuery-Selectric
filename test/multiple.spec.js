/* eslint-env jasmine, jquery */
/* global loadFixtures */

'use strict';

describe('multiple selects', function() {
  var select = false;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('multiple.html');
    select = $('#multiple');
    select.selectric();
  });

  it('should set a proper state for multiple', function() {
    expect(select.data('selectric').state.multiple).toBe(true);
  });

  it('should set a proper state for currValue', function() {
    select.find('option').eq(2).prop('selected', true);
    select.find('option').eq(3).prop('selected', true);
    select.selectric('refresh');
    expect(select.data('selectric').state.currValue.length).toBe(2);
  });

  it('should render the default option (please choose)', function () {
    $('.selectric').click();
    expect($('.selectric-wrapper').find('.label').text()).toBe('Please choose...');
  });

  it('should render the default option (please choose) even if no value were given', function () {
    $('.selectric').click();
    select.find('option').first().removeAttr('value');
    expect($('.selectric-wrapper').find('.label').text()).toBe('Please choose...');
  });

  it('should set the first option if no default option (please choose) is given', function () {
    $('.selectric').click();
    select.find('option').first().remove();
    select.selectric('refresh');
    expect($('.selectric-wrapper').find('.label').text()).toBe('Ant');
  });

  it('should update label', function () {
    var listItems = $('.selectric-items');
    $('.selectric').click();
    listItems.find('li').eq(1).click();
    listItems.find('li').eq(3).click();
    expect($('.selectric-wrapper').find('.label').text()).toBe('Ant, Dog');
  });

  it('should update label after a option was deselected', function () {
    var listItems = $('.selectric-items');
    $('.selectric').click();
    listItems.find('li').eq(1).click();
    listItems.find('li').eq(3).click();
    listItems.find('li').eq(1).click();
    expect($('.selectric-wrapper').find('.label').text()).toBe('Dog');
  });

  it('should restore default option after all options were deselected', function () {
    var listItems = $('.selectric-items');
    $('.selectric').click();
    listItems.find('li').eq(1).click();
    listItems.find('li').eq(3).click();
    listItems.find('li').eq(1).click();
    listItems.find('li').eq(3).click();
    expect($('.selectric-wrapper').find('.label').text()).toBe('Please choose...');
  });

  it('should use the label builder', function() {
    select = $('#multiple');
    select.selectric({
      labelBuilder: function(item) {
        return '<h2>' + item.text + '</h2>';
      }
    });

    $('.selectric').click();
    expect($('.selectric-wrapper').find('.label > h2').length).toBe(1);
  });

  it('should not select disabled items', function() {
    var listItems = $('.selectric-items');
    select.find('option').eq(3).prop('disabled', true);
    select.selectric('refresh');
    listItems.find('li').eq(3).click();

    $('.selectric').click();
    expect($('.selectric-wrapper').find('.label').text()).toBe('Please choose...');
  });

  describe('maxLabelEntries', function() {
    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
      loadFixtures('multiple.html');
      select = $('#multiple');
      select.selectric({
        multiple: {
          maxLabelEntries: 3,
          keepMenuOpen: true
        }
      });
    });

    it('should respect maxLabelEntries and add three dots to the last element', function() {
      var listItems = $('.selectric-items');

      $('.selectric').click();
      listItems.find('li').eq(1).click();
      listItems.find('li').eq(2).click();
      listItems.find('li').eq(3).click();
      listItems.find('li').eq(4).click();
      $('.selectric').click();

      expect($('.selectric-wrapper').find('.label').text()).toBe('Ant, Cat, Dog, ...');
    });

    it('should remove three dots if amount of selected items is less then maxLabelEntries', function() {
      var listItems = $('.selectric-items');
      $('.selectric').click();
      listItems.find('li').eq(1).click();
      listItems.find('li').eq(2).click();
      listItems.find('li').eq(3).click();
      listItems.find('li').eq(4).click();
      listItems.find('li').eq(4).click();
      $('.selectric').click();
      expect($('.selectric-wrapper').find('.label').text()).toBe('Ant, Cat, Dog');
    });

    it('should build the label correctly by ignoring case or whitespace', function() {
      var listItems = $('.selectric-items');
      $('.selectric').click();
      listItems.find('li').eq(5).click();
      listItems.find('li').eq(6).click();
      $('.selectric').click();
      expect($('.selectric-wrapper').find('.label').text()).toBe('Losabim Oxigenium, Dagobert Duck');
    });
  });

});
