/*! Selectric Search ϟ v0.1.0 (<%= date %>) - git.io/tjl9sQ - Copyright (c) <%= year %> Leonardo Santos - MIT License */
(function(factory) {
  /* global define */
  if ( typeof define === 'function' && define.amd ) {
    define(['jquery'], factory);
  } else if ( typeof module === 'object' && module.exports ) {
    // Node/CommonJS
    module.exports = function( root, jQuery ) {
      if ( jQuery === undefined ) {
        if ( typeof window !== 'undefined' ) {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  'use strict';

  if ( !$.fn.selectric ) {
    $.error('Selectric not initialized');
  }

  $.fn.selectricSearch = function(opts) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('selectric');
      var options = $.extend({
        matcher: function(value, items) {
          var reg = new RegExp(value.split('').join('.*'), 'i');

          return $.grep(items, function(item) {
            if ( !item.disabled && item.text.match(reg) ) {
              item.matchedContent = item.text.replace(reg, '<span class="match">$&</span>');
              return true;
            }

            item.disabled = true;
          });
        }
      }, opts);

      var items = data.lookupItems;
      var $searchInputWrapper = $('<div/>', { class: 'selectric-search-wrapper' });
      var $searchInput = data.elements.input.toggleClass('selectric-input selectric-search').detach().appendTo($searchInputWrapper);

      data.elements.itemsScroll.before($searchInputWrapper);

      $.each(items, function(index, item) {
        item.oldDisabled = item.disabled;
      });

      var resetItems = function() {
        $.each(items, function(index, item) {
          data.$li.eq(item.index).show().html(item.text);
          item.disabled = item.oldDisabled;
        });
      };

      $this.on('selectric-before-open selectric-close', function() {
        resetItems();
      });

      $searchInput
        .on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
        })
        .on('input', function() {
          // prevent input reset
          clearTimeout(data.resetStr);

          var val = $.trim(data.elements.input.val());

          if ( val.length === 0 ) {
            resetItems();
            return;
          }

          data.$li.hide();

          // filter elements
          var filteredItems = options.matcher(val, items);

          // select first highlighted element
          if (filteredItems.length > 0) {
            data.highlight(filteredItems[0].index);

            // highlight searched string
            $.each(filteredItems, function(index, item) {
              data.$li.eq(item.index).show().html(item.matchedContent);
            });

            // set options box height
            data.elements.items.removeAttr('style');
            data.setOptionsDimensions();
          }
        });
    });
  };
}));