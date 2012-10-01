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
 * Selectric Ϟ v1.4.2
 *
 * Copyright (c) 2012 Leonardo Santos
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */
;(function ($, window, undefined) {
	var pluginName = 'selectric',
		defaults = {
			onOpen: function() {},
			onClose: function() {},
			maxHeight: 300,
			keySearchTimeout: 500,
			highlight: true,
			arrowButtonMarkup: '<span class="button">&#9660;</span>',
			disableOnMobile: true,
			margin: 5,
			bindSufix: '.sl',
			border: 1
		};

	function Selectric(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		if (!/android|ip(hone|od|ad)/i.test(navigator.userAgent)) this.init(this.options);
	}

	Selectric.prototype.init = function(options) {
		var $wrapper = $('<div class="' + pluginName + '"><p class="label"/>' + options.arrowButtonMarkup + '</div><div class="' + pluginName + 'Items"><ul/></div>'),
			elm = this.element,
			$original = $(elm),
			selectItems = [],
			isOpen = false,
			$label = $wrapper.find('.label'),
			$ul = $wrapper.find('ul'),
			$li, $items = $ul.parent(),
			bindSufix = ('.' + options.bindSufix).replace(/^\.+/g, '.'),
			$doc = $(document),
			$win = $(window),
			$outerWrapper = $original.wrap('<div/>').parent().hover(function(){
				$(this).toggleClass('hover');
			}),
			// Firefox has problems to change <select> value on keydown,
			// so we use keypress for it and keydown for all other browsers
			keyBind = $.browser.mozilla ? 'keypress' + bindSufix : 'keydown' + bindSufix,
			chars = ['a', 'e', 'i', 'o', 'u', 'n', 'c', 'y'],
			diacritics = [
				/[\340-\346]/g, // a
				/[\350-\353]/g, // e
				/[\354-\357]/g, // i
				/[\362-\370]/g, // o
				/[\371-\374]/g, // u
				/[\361]/g, // n
				/[\347]/g, // c
				/[\377]/g // y
			],
			searchStr = '',
			resetStr, highlight = options.highlight;
		
		$original.data(pluginName, this).parent().append($wrapper);
		$original.wrap('<div class="' + pluginName + 'HideSelect" />');
			
		function _start(){
			$label.parent().unbind('click');
			$original.unbind(keyBind).unbind('focusin');
			$outerWrapper.removeClass().addClass(pluginName + 'Wrapper ' + elm.className);
			
			if ($original.prop('disabled')){
				$outerWrapper.addClass(pluginName + 'Disabled');
			} else {
				$outerWrapper.removeClass(pluginName + 'Disabled');
				$original.bind(keyBind, _keyActions);
			
				// click on label and :focus on original select will open the options box
				// unbind in case of a refresh
				$label.parent().bind('click' + bindSufix, _toggleOpen);
				$original.bind('focusin' + bindSufix, function(e){ !isOpen && _open(e); });
				_bindClick();
			}
		}
		
		function _populate() {
			$ul.empty();
			
			var $options = $original.find('option'),
				_$li = '',
				selectedIdx = $options.filter(':selected').index();

			if ($options.length) {
				$options.each(function(i){
					var $me = $(this),
						className = '';

					selectItems[i] = {
						'value': $me.val(),
						'text': $me.text(),
						'slug': _replaceDiacritics($me.text())
					};

					if (i === selectedIdx) {
						selectItems.selected = i;
						className = 'selected';
					}

					if ($options.length - 1 === i)
						className += ' last';
					
					_$li += '<li class="' + className + '" data-value="' + selectItems[i].value + '">' + selectItems[i].text + '</li>';
				});

				$ul.append(_$li);
				$label.text(selectItems[selectItems.selected].text);
			}
		}
		
		_populate();
		_start();
		
		function _keyActions(e) {
			e.preventDefault();
			var selected = selectItems.selected,
				length = selectItems.length,
				key = e.keyCode;
			
			// Left / Up
			if (/^3(7|8)$/.test(key)) _select(selected === 0 ? length - 1 : selected - 1);
			
			// Right / Down
			if (/^(39|40)$/.test(key)) _select(selected < length - 1 ? selected + 1 : 0);
			
			// Tab / Enter / ESC
			if (/^(9|13|27)$/.test(key)) {
				e.stopPropagation();
				_select(selected, true);
			}
		}

		// Search in select options
		function _keySearch(e) {
			var key = e.keyCode || e.which;
			clearTimeout(resetStr);
			
			// If it's not a system, Enter or Backspace key
			if (!/^(3(7|8|9)|40)$/.test(key)) {
				searchStr += String.fromCharCode(key);
				
				var rSearch = new RegExp('^(' + searchStr + ')', 'i'),
					k = 0,
					l = selectItems.length;
				
				while (k < l) {
					if (rSearch.test(selectItems[k].slug) || rSearch.test(selectItems[k].text)) {
						_select(k);
						highlight && $label.html($label.text().replace(rSearch, '<span>$1</span>'));
						break;
					}
					k++;
				}

				resetStr = setTimeout(function(){
					searchStr = '';
				}, options.keySearchTimeout);
			} else {
				searchStr = '';
			}
		}
		
		$original.bind('keydown', _keySearch);

		// This need to be this way so we can re-cache and re-bind if we use _reset()
		function _bindClick() {
			$ul = $wrapper.find('ul');
			$li = $ul.find('li').click(function(e) {
				e.stopPropagation();
				// The second parameter is to close the box after click
				_select($(this).index(), true);
			});
		}

		// Toggle show/hide the select options
		function _toggleOpen(e){ isOpen ? _close(e) : _open(e); }

		// Open the select options box
		function _open(e){
			e.preventDefault();
			e.stopPropagation();

			// Find any other opened instances of select and close it
			$('.' + pluginName + 'Open select')[pluginName]('close');
			
			_isInViewport();
			
			isOpen = true;
			
			var scrollTop = $win.scrollTop();			
			e.type === 'click' && $original.focus();
			$win.scrollTop(scrollTop);
			
			$doc.bind('click' + bindSufix, _close);
			$outerWrapper.addClass(pluginName + 'Open');
			_detectVisibility($ul.find('.selected').index());
			
			options.onOpen.call(this);
		}
		
		// Detect is the options box is inside the window
		function _isInViewport(){
			var docHeight = $doc.height();
			
			$items.show().css('top', '');
			
			if ($items.top + $items.height() > docHeight || $outerWrapper.offset().top + $ul.parent().height() > $win.scrollTop() + $win.height()) {
				$items.css('top', -$ul.parent().height());

				if ($items.offset().top - $items.height() < 0 && $wrapper.offset().top < options.maxHeight) {
					$items.height($wrapper.offset().top - options.margin).css('top', -$ul.parent().height());
				}
			} else {
				_calculateHeight();
			}
		}
		
		$win.scroll(function(){
			isOpen && _isInViewport();
		});

		// Close the select options box
		function _close(){
			var selectedTxt = selectItems[selectItems.selected].text;
			$items.hide();
			$original.blur();
			selectedTxt != $label.text() && $original.change();
			$label.text(selectedTxt);
			$outerWrapper.removeClass(pluginName + 'Open');
			isOpen = false;
			highlight && $label.html($label.text());

			$doc.unbind(bindSufix);
			options.onClose.call($original);
		}

		// Select option
		function _select(index, close) {
			// If 'close' is false (default), the options box won't close after
			// each selected item, this is necessary for keyboard navigation
			$li.removeClass('selected').eq(index).addClass('selected');
			$original.val(selectItems[index].value).find('option').eq(index).prop('selected', true);
			_detectVisibility(index);
			selectItems.selected = index;
			close && _close();
		}

		// Detect if currently selected option is visible
		// and scroll the options box to show it
		function _detectVisibility(index) {
			var ulParent = $ul.parent(),
				liTop = $li[index].offsetTop,
				liHeight = $li.eq(index).outerHeight(),
				ulScrollTop = ulParent.scrollTop(),
				ulHeight = ulParent.height(),
				scrollT = liTop + (liHeight * 2);
				
			if (scrollT > ulScrollTop + ulHeight) {
				ulParent.scrollTop(scrollT - ulHeight);
			} else if (liTop - liHeight < ulScrollTop) {
				ulParent.scrollTop(liTop - liHeight);
			}
		}
		
		// Remove diacritics to search function proper
		function _replaceDiacritics(s) {
			var k = diacritics.length;
			while (k--) s = s.toLowerCase().replace(diacritics[k], chars[k]);
			return s;
		}
		
		function _calculateHeight() {
			$items.height() > options.maxHeight && $items.height(options.maxHeight);
			$items.width($wrapper.outerWidth() - (options.border * 2));
		}

		_calculateHeight();

		// Unbind and remove
		function _destroy() {
			$items.remove();
			$wrapper.remove();
			$original.unwrap('.' + pluginName + 'Wrapper').removeData(pluginName).unbind(bindSufix + ' refresh destroy open close');
		}

		// Re-populate options
		function _reset() {
			_populate();
			_calculateHeight();
			_start();
		}

		$original.bind('refresh', _reset).bind('destroy', _destroy).bind('open', _open).bind('close', _close);
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (args, options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				new Selectric(this, args ? args : options);
			} else if (typeof args === 'string') {
				$(this).trigger(args);
			}
		});
	};
}(jQuery, window));