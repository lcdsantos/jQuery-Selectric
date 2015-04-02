/*! Selectric AddNew ϟ v0.1.0 (2014-01-14) - git.io/tjl9sQ - Copyright (c) 2015 David Shen (git.io/mhQmLQ) - Dual licensed: MIT/GPL */
;(function($) {
  'use strict';

  $(function() {
    if (!$.fn.selectric) {
      $.error('Selectric not initialized');
    }

    var hooks = $.fn.selectric.hooks;

    hooks.add('BeforeInit', 'addNew', function(element, data) {
      data.options = $.extend({
        createNewAutoSelect: true,
        createNewMarkup: '<input type="text" /><button>Create</button>',
        allowCreateNew: false,
        createNewCallback: $.noop,
        createNewError: function(){
          alert('Title required.');
        }
      }, data.options);
    });

    hooks.add('Init', 'addNew', function(element, data) {
      var $original = $(element),
          $wrapper = $original.closest('.' + data.classes.wrapper),
          $itemsScroll = $wrapper.find('.' + data.classes.scroll),
          $createNew = $('<div/>', { 'class': 'createNew', 'html': data.options.createNewMarkup });

      if ( data.options.allowCreateNew ){
        $itemsScroll.prepend($createNew);

        var createNewInput = $createNew.find('input[type=text]'),
            createNewButton = $createNew.find('button');

        createNewInput.add(createNewButton).on('click', function(e){
          e.preventDefault();
          e.stopPropagation();
        });

        createNewButton.on('click', function(e){
          if ( createNewInput.val() ){
            var newValue = createNewInput.val();

            $original.append($('<option>', {
              value: newValue,
              text : newValue
            }));

            if ( data.options.createNewAutoSelect ){
              $original.prop('selectedIndex', $original.children().length - 1);
            }

            data.refresh();
            data.open();

            data.options.createNewCallback.call(element, newValue);

            createNewInput.add(createNewButton).off('click');
          } else {
            data.options.createNewError.call(element);
          }
        });
      }
    });
  });
}(jQuery));
