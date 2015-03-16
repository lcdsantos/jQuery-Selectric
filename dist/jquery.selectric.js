/*!
 *         ,/
 *       ,'/
 *     ,' /
 *   ,'  /_____,
 * .'____    ,'
 *      /  ,'
 *     / ,'
 *    /,'
 *   /'
 *
 * Selectric Ϟ v1.7.2 - http://lcdsantos.github.io/jQuery-Selectric/
 *
 * Copyright (c) 2014 Leonardo Santos; Dual licensed: MIT/GPL
 *
 */

;(function ($) {
  'use strict';

  var pluginName = 'selectric',
      classList = 'Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive Above',
      bindSufix = '.sl',
      defaults = {
        onOpen: $.noop,
        onClose: $.noop,
        onChange: function(elm) { $(elm).change(); },
        maxHeight: 300,
        keySearchTimeout: 500,
        arrowButtonMarkup: '<b class="button">&#x25be;</b>',
        disableOnMobile: true,
        openOnHover: false,
        expandToItemText: false,
        responsive: false,
        preventWindowScroll: true,
        customClass: {
          prefix: pluginName,
          postfixes: classList,
          camelCase: true
        },
        optionsItemBuilder: '{text}' // function(itemData, element, index)
      },
      _utils = {
        // Replace diacritics
        replaceDiacritics: function(s) {
          // /[\340-\346]/g, // a
          // /[\350-\353]/g, // e
          // /[\354-\357]/g, // i
          // /[\362-\370]/g, // o
          // /[\371-\374]/g, // u
          // /[\361]/g,      // n
          // /[\347]/g,      // c
          // /[\377]/g       // y
          var d = '40-46 50-53 54-57 62-70 71-74 61 47 77'.replace(/\d+/g, '\\3$&').split(' '),
              k = d.length;

          while (k--)
            s = s.toLowerCase().replace(RegExp('[' + d[k] + ']', 'g'), 'aeiouncy'.charAt(k));

          return s;
        },
        // https://gist.github.com/atesgoral/984375
        format: function(f) {var a=arguments;return(""+f).replace(/{(\d+|(\w+))}/g,function(s,i,p){return p&&a[1]?a[1][p]:a[i]})},
        nextEnabledItem: function(selectItems, selected) {
          while ( selectItems[ selected = (selected + 1) % selectItems.length ].disabled ){}
          return selected;
        },
        previousEnabledItem: function(selectItems, selected) {
          while ( selectItems[ selected = (selected > 0 ? selected : selectItems.length) - 1 ].disabled ){}
          return selected;
        }
      },
      $doc = $(document),
      $win = $(window),
      Selectric = function(element, opts) {
        var _this = this,
            $original = $(element),
            $input, $items, $wrapper, $label, $outerWrapper, $li,
            isOpen = false,
            isEnabled = false,
            selected,
            currValue,
            itemsHeight,
            itemsInnerHeight,
            finalWidth,
            optionsLength,
            eventTriggers,
            isMobile = /android|ip(hone|od|ad)/i.test(navigator.userAgent);

        function _init(opts) {
          _this.options = $.extend(true, {}, defaults, _this.options, opts);
          _this.classes = {};

          // Disable on mobile browsers
          if ( _this.options.disableOnMobile && isMobile ){
            _this.disableOnMobile = true;
            return;
          }

          // Preserve data
          _destroy(true);

          // Generate classNames for elements
          var customClass = _this.options.customClass,
              postfixes = customClass.postfixes.split(' ');

          $.each(classList.split(' '), function(i, elm){
            var c = customClass.prefix + postfixes[i];
            _this.classes[elm.toLowerCase()] = customClass.camelCase ? c : c.replace(/([A-Z])/g, "-$&").toLowerCase();
          });

          $input        = $('<input class="' + _this.classes.input + '"/>').prop('readonly', isMobile);
          $items        = $('<div class="' + _this.classes.items + '" tabindex="-1"></div>');
          $wrapper      = $('<div class="' + customClass.prefix + '">' + _this.options.arrowButtonMarkup + '</div>');
          $label        = $('<p class="label"/>');
          $outerWrapper = $original.wrap('<div>').parent().append($wrapper.prepend($label), $items, $input);

          eventTriggers = {
            open    : _open,
            close   : _close,
            destroy : _destroy,
            refresh : _populate,
            init    : _init
          };

          $original.on(eventTriggers).wrap('<div class="' + _this.classes.hideselect + '">');
          $.extend(_this, eventTriggers);

          isEnabled = true;

          _populate();
        }

        // Generate options markup and event binds
        function _populate() {
          _this.items = [];

          var $options = $original.children(),
              _$li = '<ul>',
              selectedIndex = $options.filter(':selected').index();

          currValue = (selected = ~selectedIndex ? selectedIndex : 0);

         // trace("sectric options", $options);
          
          if ( optionsLength = $options.length ) {
            // Build options markup
        	var i = 0;
            $options.each(function(){
            
            	//trace($(this)[0].tagName);
            if($(this)[0].tagName == "OPTION"){
            	buildOption($(this));	
            }
            else if($(this)[0].tagName == "OPTGROUP"){
            	_$li += '<ul class="option-group ' + $(this).prop("class") +'">';
            	_$li += '<li class="group-title"><p>' + $(this).prop("label") + '</p></li>';
            	
            	var options = $(this).children();
            	options.each(function(){
            		buildOption($(this));
            	})
            	_$li += "</ul>";
            }
            
            function buildOption(target){
	              var $elm = target,
	                  optionText = $elm.html(),
	                  selectDisabled = $elm.prop('disabled'),
	                  itemBuilder = _this.options.optionsItemBuilder;
	
	              _this.items[i] = {
	                value    : $elm.val(),
	                text     : optionText,
	                slug     : _utils.replaceDiacritics(optionText),
	                disabled : selectDisabled
	              };
	
	              _$li += _utils.format('<li data-index="' + i +'" class="option {1}">{2}</li>',
	                $.trim([i == currValue ? 'selected' : '', i == optionsLength - 1 ? 'last' : '', selectDisabled ? 'disabled' : ''].join(' ')),
	                $.isFunction(itemBuilder) ? itemBuilder(_this.items[i], $elm, i) : _utils.format(itemBuilder, _this.items[i])
	              );
	              i ++;
            };
              
            });

            $items.html(_$li + '</ul>');

            $label.html(_this.items[currValue].text);
          }

          $wrapper.add($original).off(bindSufix);

          $outerWrapper.prop('class', [_this.classes.disabled, _this.classes.wrapper, $original.prop('class').replace(/\S+/g, pluginName + '-$&'), _this.options.responsive ? _this.classes.responsive : ''].join(' '));

          if ( !$original.prop('disabled') ){
            // Not disabled, so... Removing disabled class and bind hover
            $outerWrapper.removeClass(_this.classes.disabled).hover(function(){
              $(this).toggleClass(_this.classes.hover);
            });

            // Click on label and :focus on original select will open the options box
            _this.options.openOnHover && $wrapper.on('mouseenter' + bindSufix, _open);

            // Toggle open/close
            $wrapper.on('click' + bindSufix, function(e){
              isOpen ? _close() : _open(e);
            });

            $input.prop('disabled', false).off().on({
              keypress: _handleSystemKeys,
              keydown: function(e){
                _handleSystemKeys(e);

                // Clear search
                clearTimeout(_this.resetStr);
                _this.resetStr = setTimeout(function(){
                  $input.val('');
                }, _this.options.keySearchTimeout);

                var key = e.keyCode || e.which;

                // If it's a directional key
                // 37 => Left
                // 38 => Up
                // 39 => Right
                // 40 => Down
                if ( key > 36 && key < 41 )
                  _select(_utils[(key < 39 ? 'previous' : 'next') + 'EnabledItem'](_this.items, selected));
              },
              focusin: function(e){
                // Stupid, but necessary... Prevent the flicker when
                // focusing out and back again in the browser window
                $input.one('blur', function(){
                  $input.blur();
                });

                isOpen || _open(e);
              }
            }).on('oninput' in $input[0] ? 'input' : 'keyup', function(){
              if ( $input.val().length ){
                // Search in select options
                $.each(_this.items, function(i, elm){
                  if ( RegExp('^' + $input.val(), 'i').test(elm.slug) && !elm.disabled ){
                    _select(i);
                    return false;
                  }
                });
              }
            });

            // Remove styles from items box
            // Fix incorrect height when refreshed is triggered with fewer options
            $li = $('li.option', $items.removeAttr('style')).click(function(){
              // The second parameter is to close the box after click
              _select($(this).attr("data-index"), true);

              // Chrome doesn't close options box if select is wrapped with a label
              // We need to 'return false' to avoid that
              return false;
            });
          } else
            $input.prop('disabled', true);
        }

        // Behavior when system keys is pressed
        function _handleSystemKeys(e) {
          var key = e.keyCode || e.which;

          if ( key == 13 )
            e.preventDefault();

          // Tab / Enter / ESC
          if ( /^(9|13|27)$/.test(key) ) {
            e.stopPropagation();
            _select(selected, true);
          }
        }

        // Set options box width/height
        function _calculateOptionsDimensions() {
          var visibleParent = $items.closest(':visible').children(':hidden'),
              maxHeight = _this.options.maxHeight;

          // Calculate options box height
          // Set a temporary class on the hidden parent of the element
          visibleParent.addClass(_this.classes.tempshow);

          var itemsWidth = $items.outerWidth(),
              wrapperWidth = $wrapper.outerWidth() - (itemsWidth - $items.width());

          // Set the dimensions, minimum is wrapper width, expand for long items if option is true
          if ( !_this.options.expandToItemText || wrapperWidth > itemsWidth )
            finalWidth = wrapperWidth;
          else {
            // Make sure the scrollbar width is included
            $items.css('overflow', 'scroll');

            // Set a really long width for $outerWrapper
            $outerWrapper.width(9e4);
            finalWidth = $items.width();
            // Set scroll bar to auto
            $items.css('overflow', '');
            $outerWrapper.width('');
          }

          $items.width(finalWidth).height() > maxHeight && $items.height(maxHeight);

          // Remove the temporary class
          visibleParent.removeClass(_this.classes.tempshow);
        }

        // Open the select options box
        function _open(e) {
          if (e){
            e.preventDefault();
            e.stopPropagation();
          }

          if (isEnabled){
            _calculateOptionsDimensions();

            // Find any other opened instances of select and close it
            $('.' + _this.classes.open).removeClass(_this.classes.open);

            isOpen = true;
            itemsHeight = $items.outerHeight(),
            itemsInnerHeight = $items.height();

            // Give dummy input focus
            $input.val('').is(':focus') || $input.focus();

            $doc.on('click' + bindSufix, _close).on('scroll' + bindSufix, _isInViewport);
            _isInViewport();

            // Prevent window scroll when using mouse wheel inside items box
            if ( _this.options.preventWindowScroll ){
              $doc.on('mousewheel' + bindSufix + ' DOMMouseScroll' + bindSufix, '.' + _this.classes.items, function(e){
                var orgEvent = e.originalEvent,
                    scrollTop = $items.scrollTop(),
                    deltaY = 0;

                if ( 'detail' in orgEvent ) { deltaY = orgEvent.detail * -1; }
                if ( 'wheelDelta' in orgEvent ) { deltaY = orgEvent.wheelDelta; }
                if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY; }
                if ( 'deltaY' in orgEvent ) { deltaY = orgEvent.deltaY * -1; }

                if ( scrollTop == (this.scrollHeight - itemsInnerHeight) && deltaY < 0 || scrollTop == 0 && deltaY > 0 )
                  e.preventDefault();
              });
            }

            // Delay close effect when openOnHover is true
            if ( _this.options.openOnHover ){
              clearTimeout(_this.closeTimer);
              $outerWrapper.one('mouseleave' + bindSufix, function(){
                _this.closeTimer = setTimeout(_close, 500);
              });
            }

            // Toggle options box visibility
            $outerWrapper.addClass(_this.classes.open);
            _detectItemVisibility(selected);

            _this.options.onOpen(element);
          }
        }

        // Detect is the options box is inside the window
        function _isInViewport() {
          _calculateOptionsDimensions();
          $outerWrapper.toggleClass(_this.classes.above, $outerWrapper.offset().top + $outerWrapper.outerHeight() + itemsHeight > $win.scrollTop() + $win.height());
        }

        // Close the select options box
        function _close(e) {
          if ( !e && currValue != selected ){
            var text = _this.items[selected].text;

            // Apply changed value to original select
            $original
              .prop('selectedIndex', currValue = selected)
              .data('value', text);

            _this.options.onChange(element);

            // Change label text
            $label.html(text);
          }

          // Remove click on document
          $doc.off(bindSufix);

          // Remove visible class to hide options box
          $outerWrapper.removeClass(_this.classes.open);

          isOpen = false;

          _this.options.onClose(element);
        }

        // Select option
        function _select(index, close) {
          // If element is disabled, can't select it
          if ( !_this.items[selected = index].disabled ){
            // If 'close' is false (default), the options box won't close after
            // each selected item, this is necessary for keyboard navigation
            $li.removeClass('selected').eq(index).addClass('selected');
            _detectItemVisibility(index);
            close && _close();
          }
        }

        // Detect if currently selected option is visible and scroll the options box to show it
        function _detectItemVisibility(index) {
          var liHeight = $li.eq(index).outerHeight(),
              liTop = $li[index].offsetTop,
              itemsScrollTop = $items.scrollTop(),
              scrollT = liTop + liHeight * 2;

          $items.scrollTop(
            scrollT > itemsScrollTop + itemsHeight ? scrollT - itemsHeight :
              liTop - liHeight < itemsScrollTop ? liTop - liHeight :
                itemsScrollTop
          );
        }

        // Unbind and remove
        function _destroy(preserveData) {
          if ( isEnabled ){
            $items.add($wrapper).add($input).remove();
            !preserveData && $original.removeData(pluginName).removeData('value');
            $original.off(bindSufix).off(eventTriggers).unwrap().unwrap();
            isEnabled = false;
          }
        }

        _init(opts);
      };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(args) {
    return this.each(function() {
      var data = $.data(this, pluginName);

      if ( data && !data.disableOnMobile )
        (''+args === args && data[args]) ? data[args]() : data.init(args);
      else
        $.data(this, pluginName, new Selectric(this, args));
    });
  };
}(jQuery));
