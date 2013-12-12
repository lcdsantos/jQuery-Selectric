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
 * Selectric Ϟ v1.5.5 - http://lcdsantos.github.io/jQuery-Selectric/
 *
 * Copyright (c) 2013 Leonardo Santos; Dual licensed: MIT/GPL
 *
 */

;(function ($) {
  var pluginName = 'selectric',
      emptyFn = function() {},
      // Replace diacritics
      _replaceDiacritics = function(s) {
        /*
          /[\340-\346]/g, // a
          /[\350-\353]/g, // e
          /[\354-\357]/g, // i
          /[\362-\370]/g, // o
          /[\371-\374]/g, // u
          /[\361]/g, // n
          /[\347]/g, // c
          /[\377]/g // y
        */
        var k, d = '40-46 50-53 54-57 62-70 71-74 61 47 77'.replace(/\d+/g, '\\3$&').split(' ');

        for (k in d)
          s = s.toLowerCase().replace(RegExp('[' + d[k] + ']', 'g'), 'aeiouncy'.charAt(k));

        return s;
      },
      init = function(element, options) {
        var options = $.extend({
              onOpen: emptyFn,
              onClose: emptyFn,
              maxHeight: 300,
              keySearchTimeout: 500,
              arrowButtonMarkup: '<b class="button">&#9662;</b>',
              disableOnMobile: true,
              border: 1,
              openOnHover: false,
              expandToItemText: false
            }, options);

        if (options.disableOnMobile && /android|ip(hone|od|ad)/i.test(navigator.userAgent)) return;

        var $original = $(element),
            $wrapper = $('<div class="' + pluginName + '"><p class="label"/>' + options.arrowButtonMarkup + '</div>'),
            $items = $('<div class="' + pluginName + 'Items" tabindex="-1"><ul/></div>'),
            $outerWrapper = $original.data(pluginName, options).wrap('<div>').parent().append($wrapper).append($items),
            selectItems = [],
            isOpen = false,
            $label = $('.label', $wrapper),
            $ul = $('ul', $items),
            $li,
            bindSufix = '.sl',
            $doc = $(document),
            $win = $(window),
            keyBind = 'keydown' + bindSufix,
            clickBind = 'click' + bindSufix,
            searchStr = '',
            resetStr,
            classOpen = pluginName + 'Open',
            classDisabled = pluginName + 'Disabled',
            tempClass = pluginName + 'TempShow',
            selectStr = 'selected',
            selected,
            itemsHeight,
            closeTimer,
            finalWidth;

        function _populate() {
          var $options = $('option', $original.wrap('<div class="' + pluginName + 'HideSelect">')),
              _$li = '',
              visibleParent = $items.closest(':visible').children().not(':visible'),
              maxHeight = options.maxHeight,
              optionsLength;

          selected = $options.filter(':' + selectStr).index();

          if ( optionsLength = $options.length ) {
            // Build options markup
            $options.each(function(i, elm){
              var selectText = $(elm).text(),
                  selectDisabled = $(elm).prop('disabled');

              selectItems[i] = {
                value: $(elm).val(),
                text: selectText,
                slug: _replaceDiacritics(selectText),
                disabled: selectDisabled
              };

              // _$li += '<li class="' + (i == selected ? selectStr : '') + (i == optionsLength - 1 ? ' last' : '') + '">' + selectText + '</li>';
              _$li += '<li class="' + (i == selected ? selectStr : '') + (i == optionsLength - 1 ? ' last' : '') + (selectDisabled ? ' disabled' : '') + '">' + selectText + '</li>';

            });

            $ul.empty().append(_$li);
            $label.text(selectItems[selected].text);
          }

          $wrapper.add($original).off(bindSufix);
          $outerWrapper.prop('class', pluginName + 'Wrapper ' + $original.prop('class') + ' ' + classDisabled);

          if (!$original.prop('disabled')){
            // Not disabled, so... Removing disabled class and bind hover
            $outerWrapper.removeClass(classDisabled).hover(function(){
              $(this).toggleClass(pluginName + 'Hover');
            });

            // Click on label and :focus on original select will open the options box
            options.openOnHover && $wrapper.on('mouseenter' + bindSufix, _open);

            $wrapper.on(clickBind, function(e){
              isOpen ? _close(e) : _open(e);
            });

            $original.on(keyBind, function(e){
              var key = e.which;

              // Tab / Enter / ESC
              if (/^(9|13|27)$/.test(key)) {
                e.stopPropagation();
                _select(selected, true);
              }

              // Enter / ESC
              /^(13|27)$/.test(key) && e.preventDefault();

              // Search in select options
              clearTimeout(resetStr);

              // If it's not a directional key
              if (key < 37 || key > 40) {
                var rSearch = RegExp('^' + (searchStr += String.fromCharCode(key)), 'i');

                $.each(selectItems, function(i, elm){
                  if (rSearch.test([elm.slug, elm.text]))
                    _select(i);
                });

                resetStr = setTimeout(function(){
                  searchStr = '';
                }, options.keySearchTimeout);
              } else {
                searchStr = '';

                // Right / Down : Left / Up
                _select(/^(39|40)$/.test(key) ? nextEnabledItem(selected) : previousEnabledItem(selected));
              }
            }).on('focusin' + bindSufix, function(e){
              isOpen || _open(e);
            });

            function nextEnabledItem(idx){
              var next = (idx + 1) % optionsLength;

              while (selectItems[next].disabled)
                next++;

              return next;
            }

            function previousEnabledItem(idx){
              var previous = (idx > 0 ? idx : optionsLength) - 1;

              while ( selectItems[previous].disabled )
                previous--;

              return previous;
            }

            // Remove styles from items box
            // Fix incorrect height when refreshed is triggered with fewer options
            $li = $('li', $items.removeAttr('style')).click(function(){
              // The second parameter is to close the box after click
              _select($(this).index(), true);

              // Chrome doesn't close options box if select is wrapped with a label
              // We need to 'return false' to avoid that
              return false;
            });
          }

          // Calculate options box height
          // Set a temporary class on the hidden parent of the element
          visibleParent.addClass(tempClass);

          var wrapperWidth = $wrapper.outerWidth() - (options.border * 2);

          // Set the dimensions, minimum is wrapper width, expand for long items if option is true
          if ( !options.expandToItemText || wrapperWidth > $items.outerWidth() )
            finalWidth = wrapperWidth;
          else {
            // Make sure the scrollbar width is included
            $items.css('overflow', 'scroll');

            // Set a really long width for $outerWrapper
            $outerWrapper.width(9e4);
            finalWidth = $items.outerWidth();
            // Set scroll bar to auto
            $items.css('overflow', '');
            $outerWrapper.width('');
          }

          $items.width(finalWidth).height() > maxHeight && $items.height(maxHeight);

          // Remove the temporary class
          visibleParent.removeClass(tempClass);
        }

        _populate();

        // Open the select options box
        function _open(e) {
          e.preventDefault();
          e.stopPropagation();

          // Find any other opened instances of select and close it
          $('.' + classOpen + ' select')[pluginName]('close');

          isOpen = true;
          itemsHeight = $items.outerHeight();

          _isInViewport();

          var scrollTop = $win.scrollTop();
          e.type == 'click' && $original.focus();
          $win.scrollTop(scrollTop);

          $doc.off(bindSufix).on(clickBind, _close);

          clearTimeout(closeTimer);
          if (options.openOnHover){
            $outerWrapper.off(bindSufix).on('mouseleave' + bindSufix, function(e){
              closeTimer = setTimeout(function(){ $doc.click() }, 500);
            });
          }

          $outerWrapper.addClass(classOpen);
          _detectItemVisibility(selected);

          options.onOpen.call(this);
        }

        // Detect is the options box is inside the window
        function _isInViewport() {
          if (isOpen){
            $items.css('top', ($outerWrapper.offset().top + $outerWrapper.outerHeight() + itemsHeight > $win.scrollTop() + $win.height()) ? -itemsHeight : '');
            setTimeout(_isInViewport, 100);
          }
        }

        // Close the select options box
        function _close() {
          var selectedTxt = selectItems[selected].text;
          selectedTxt != $label.text() && $original.change();
          $label.text(selectedTxt);

          $outerWrapper.removeClass(classOpen);
          isOpen = false;

          options.onClose.call(this);
        }

        // Select option
        function _select(index, close) {
          // element is disabled, cant click it
          if (selectItems[index].disabled) return;

          // If 'close' is false (default), the options box won't close after
          // each selected item, this is necessary for keyboard navigation
          $original.prop('value', selectItems[selected = index].value).find('option').eq(index).prop(selectStr, true);
          $li.removeClass(selectStr).eq(index).addClass(selectStr);
          _detectItemVisibility(index);
          close && _close();
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

        $original.on({
          refresh: _populate,
          destroy: function() {
            // Unbind and remove
            $items.add($wrapper).remove();
            $original.removeData(pluginName).off(bindSufix + ' refresh destroy open close').unwrap().unwrap();
          },
          open: _open,
          close: _close
        });
      };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(args, options) {
    return this.each(function() {
      if (!$(this).data(pluginName)) {
        // new Selectric(this, args || options);
        init(this, args || options);
      } else if (''+args === args) {
        $(this).trigger(args);
      }
    });
  };
}(jQuery));