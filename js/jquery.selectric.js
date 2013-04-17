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
 * Selectric Ϟ v1.4.6
 *
 * Copyright (c) 2013 Leonardo Santos; Dual licensed: MIT/GPL
 *
 */

;(function ($, window, undefined) {
	var pluginName = 'selectric',
		opts = {
			onOpen: function() {},
			onClose: function() {},
			maxHeight: 300,
			keySearchTimeout: 500,
			arrowButtonMarkup: '<b class="button">&#9662;</b>',
			disableOnMobile: true,
			margin: 5,
			border: 1
		};

	function Selectric(element, options) {
		this.element = element;
		this.options = $.extend(opts, options);

		if (opts.disableOnMobile && !/android|ip(hone|od|ad)/i.test(navigator.userAgent)) this.init(opts);
	}

	Selectric.prototype.init = function(options) {
		var $wrapper = $('<div class="' + pluginName + '"><p class="label"/>' + options.arrowButtonMarkup + '</div>'),
			$original = $(this.element),
			$outerWrapper = $original.data(pluginName, this).wrap('<div/>').parent().hover(function(){
				$(this).toggleClass('hover');
			}).append($wrapper),
			selectItems = [],
			isOpen = false,
			$label = $wrapper.find('.label'),
			$items = $('<div class="' + pluginName + 'Items"><ul/></div>').appendTo($outerWrapper),
			$ul = $items.find('ul'),
			$li,
			bindSufix = '.sl',
			$doc = $(document),
			$win = $(window),
			keyBind = 'keydown' + bindSufix,
			clickBind = 'click' + bindSufix,
			searchStr = '',
			resetStr,
			classOpen = pluginName + 'Open',
			classWrapper = pluginName + 'Wrapper',
			classDisabled = pluginName + 'Disabled',
			selectStr = 'selected',
			selected = 0, length;

		$original.wrap('<div class="' + pluginName + 'HideSelect"/>');

		function _start(){
			$wrapper.unbind(bindSufix);
			$original.unbind(keyBind + ' focusin');
			$outerWrapper.removeClass().addClass([classWrapper, $original.prop('class'), classDisabled].join(' '));

			if (!$original.prop('disabled')){
				// Not disabled, so... Removing disabled class
				$outerWrapper.removeClass(classDisabled);

				// Click on label and :focus on original select will open the options box
				$wrapper.bind(clickBind, function(e){ isOpen ? _close(e) : _open(e) });
				$original.bind(keyBind, _keyActions).bind('focusin' + bindSufix, function(e){ isOpen || _open(e) });

				$ul = $items.find('ul');
				$li = $ul.find('li').click(function(e) {
					e.stopPropagation();
					// The second parameter is to close the box after click
					_select($(this).index(), true);
				});
			}
		}

		function _populate() {
			$ul.empty();

			var $options = $original.find('option'),
				_$li = '',
				optionsLength = $options.length,
				idx = $options.filter(':' + selectStr).index();

			selected = idx < 0 ? 0 : idx;

			if (optionsLength) {
				$options.each(function(i){
					var $me = $(this),
						className = i == selected ? selectStr : '',
						selectText = $me.text(),
						selectVal = $me.val();

					selectItems[i] = {
						value: selectVal,
						text: selectText,
						slug: _replaceDiacritics(selectText)
					};

					if (++i == optionsLength) className += ' last';

					length = i;

					_$li += '<li class="' + className + '" data-value="' + selectVal + '">' + selectText + '</li>';
				});

				$ul.append(_$li);
				$label.text(selectItems[selected].text);
			}

			_start();
		}

		_populate();

		function _keyActions(e) {
			e.preventDefault();
			var key = e.keyCode;

			// Left / Up
			/^3[78]$/.test(key) && _select((selected > 0 ? selected : length) - 1);

			// Right / Down
			/^39|40$/.test(key) && _select((selected + 1) % length);

			// Tab / Enter / ESC
			if (/^9|13|27$/.test(key)) {
				e.stopPropagation();
				_select(selected, true);
			}
		}

		// Search in select options
		function _keySearch(e) {
			var key = e.keyCode || e.which,
				i = 0;

			clearTimeout(resetStr);

			// If it's not a system key
			if (key < 37 || key > 40) {
				var rSearch = RegExp('^' + (searchStr += String.fromCharCode(key)), 'i');

				while (++i < length){
					if (rSearch.test(selectItems[i].slug) || rSearch.test(selectItems[i].text)) {
						_select(i);
						break;
					}
				}

				resetStr = setTimeout(function(){
					searchStr = '';
				}, options.keySearchTimeout);
			} else
				searchStr = '';
		}

		$original.bind('keydown', _keySearch);

		// Open the select options box
		function _open(e){
			e.preventDefault();
			e.stopPropagation();

			// Find any other opened instances of select and close it
			$('.' + classOpen + ' select')[pluginName]('close');

			isOpen = true;

			_isInViewport();

			var scrollTop = $win.scrollTop();
			e.type == 'click' && $original.focus();
			$win.scrollTop(scrollTop);

			$doc.bind(clickBind, _close);
			$outerWrapper.addClass(classOpen);
			_detectItemVisibility(selected);

			options.onOpen.call(this);
		}

		// Detect is the options box is inside the window
		function _isInViewport(){
			if (isOpen){
				var itemsTop = $items.show().css('top', '').offset().top,
					itemsHeight = $items.height(),
					wrapperTop = $wrapper.offset().top;

				if (itemsTop + itemsHeight > $doc.height() || $outerWrapper.offset().top + itemsHeight > $win.scrollTop() + $win.height()) {
					$items.css('top', -itemsHeight);

					if (itemsTop - itemsHeight < 0 && wrapperTop < options.maxHeight)
						$items.height(wrapperTop - options.margin);
				}

				_calculateHeight();
			}
		}

		$win.scroll(_isInViewport);

		// Close the select options box
		function _close(){
			var selectedTxt = selectItems[selected].text;
			$items.hide();
			$original.blur();
			selectedTxt != $label.text() && $original.change();
			$label.text(selectedTxt);
			$outerWrapper.removeClass(classOpen);
			isOpen = false;
			$doc.unbind(bindSufix);
			options.onClose.call($original);
		}

		// Select option
		function _select(index, close) {
			// If 'close' is false (default), the options box won't close after
			// each selected item, this is necessary for keyboard navigation
			$original.val(selectItems[selected = index].value).find('option').eq(index).prop(selectStr, true);
			$li.removeClass(selectStr).eq(index).addClass(selectStr);
			_detectItemVisibility(index);
			close && _close();
		}

		// Detect if currently selected option is visible and scroll the options box to show it
		function _detectItemVisibility(index) {
			var liHeight = $li.eq(index).outerHeight(),
				liTop = $li[index].offsetTop,
				itemsScrollTop = $items.scrollTop(),
				itemsHeight = $items.height(),
				scrollT = liTop + liHeight * 2;

			if (scrollT > itemsScrollTop + itemsHeight) {
				$items.scrollTop(scrollT - itemsHeight);
			} else if (liTop - liHeight < itemsScrollTop) {
				$items.scrollTop(liTop - liHeight);
			}
		}

		// Replace diacritics
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
		function _replaceDiacritics(s) {
			var k, d = '40-46 50-53 54-57 62-70 71-74 61 47 77'.replace(/\d+/g, '\\3$&').split(' ');
			for (k in d) s = s.toLowerCase().replace(RegExp('[' + d[k] + ']', 'g'), 'aeiouncy'.charAt(k));
			return s;
		}

		function _calculateHeight() {
			var visibleParent = $items.closest(':visible').children(),
				tempClass = pluginName + 'TempShow';

			// Set a temporary class on the hidden parent of the element
			visibleParent.addClass(tempClass);

			// Set the dimensions
			$items.height() > options.maxHeight && $items.height(options.maxHeight);
			$items.width($wrapper.outerWidth() - (options.border * 2));

			// Remove the temporary class
			visibleParent.removeClass(tempClass);
		}

		_calculateHeight();

		// Unbind and remove
		function _destroy() {
			$items.remove();
			$wrapper.remove();
			$original.removeData(pluginName).unbind(bindSufix + ' refresh destroy open close').unwrap('.' + pluginName + 'HideSelect').unwrap('.' + classWrapper);
		}

		// Re-populate options
		function _reset() {
			_populate();
			_calculateHeight();
		}

		$original.bind({
			refresh: _reset,
			destroy: _destroy,
			open: _open,
			close: _close
		});
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (args, options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				new Selectric(this, args || options);
			} else if (''+args === args) {
				$(this).trigger(args);
			}
		});
	};
}(jQuery, window));