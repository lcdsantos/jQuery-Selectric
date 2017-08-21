/*! Selectric AddNew ϟ v0.2.0 (2017-08-21) - git.io/tjl9sQ - Copyright (c) 2017 David Shen (git.io/mhQmLQ) - MIT License */
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

  $.fn.selectricAddNew = function(opts) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('selectric');
      var options = $.extend({
        createNewAutoSelect: true,
        createNewMarkup: '<input type="text" /><button>Create</button>',
        allowCreateNew: true,
        createNewCallback: $.noop,
        createNewError: function() {
          $.error('Title required.');
        }
      }, opts);
      var $original = data.$element;
      var $itemsScroll = data.elements.itemsScroll;
      var $createNew = $('<div/>', { 'class': 'create-new', 'html': options.createNewMarkup });

      if ( options.allowCreateNew ) {
        $itemsScroll.prepend($createNew);

        var createNewInput = $createNew.find('input[type=text]');
        var createNewButton = $createNew.find('button');

        createNewInput.add(createNewButton).on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
        });

        createNewButton.on('click', function() {
          if ( createNewInput.val() ) {
            var newValue = createNewInput.val();

            $original.append($('<option>', {
              value: newValue,
              text : newValue
            }));

            if ( options.createNewAutoSelect ) {
              $original.prop('selectedIndex', $original.children().length - 1);
            }

            data.refresh();
            data.open();

            options.createNewCallback.call(data.element, newValue);

            createNewInput.add(createNewButton).off('click');
          } else {
            options.createNewError.call(data.element);
          }
        });
      }
    });
  };
}));