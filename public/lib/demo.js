(function() {
  $(function() {
    'use strict';

    var format = function(f) {var a=arguments;return(""+f).replace(/\{(?:(\d+)|(\w+))\}/g,function(s,i,p) {return p&&a[1]?a[1][p]:a[i]})},
        shadeColor = function(color, percent) {
          // strip the leading # if it's there
          var color = color.replace(/^\s*#|\s*$/g, '');

          // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
          if (color.length == 3) {
            color = color.replace(/(.)/g, '$1$1');
          }

          var num = parseInt(color, 16),
              amt = Math.round(2.55 * percent),
              R   = (num >> 16) + amt,
              B   = (num >> 8 & 0x00FF) + amt,
              G   = (num & 0x0000FF) + amt;

          return '#' +
            (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
        },
        $theme = $('#theme'),
        $template = $('#template'),
        _template = '',
        $custom = $('.custom').hide(),
        values = {
          borderWidth         : 1,
          baseColor           : '#F8F8F8',
          secondaryColor      : '#DDD',
          labelColor          : '#444',
          borderRadius        : 0,
          height              : 40,
          innerHeight         : 40,
          indent              : 10,
          hoverBaseColor      : shadeColor('#F8F8F8', -10),
          hoverSecondaryColor : shadeColor('#DDD', -10),
          buttonSize          : 38,
          buttonRadius        : 0,
          buttonBgColor       : 'none',
          buttonColor         : '#444'
        };

    $('#border-width-slider').data('key', 'borderWidth');
    $('#border-round-slider').data('key', 'borderRadius');
    $('#height-slider').data('key', 'height');
    $('#indent-slider').data('key', 'indent');
    $('#button-size-slider').data('key', 'buttonSize');
    $('#button-round-slider').data('key', 'buttonRadius');
    $('#button-position-slider').data('key', 'buttonPosition');

    if ( /android|ip(hone|od|ad)/i.test(navigator.userAgent) ) {
      $('#presets').find('option[value="custom"]').remove();
    }

    $('#presets').change(function(e) {
      e.preventDefault();

      var value = $(this).val();

      if (value == 'custom') {
        $theme.prop('href', 'selectric.css');
        $.get('themes/template/selectric.css', function(css) {
          _template = css;
          initCustomTheme();
        });
      } else if (value == 'default') {
        $theme.prop('href', 'selectric.css');
      } else {
        $custom.slideUp();
        $theme.attr('href', 'themes/' + value + '/selectric.css');
        $template.empty();
      }

      buildDownloadLink();
    });

    function initCustomTheme() {
      $custom.slideDown();

      $.extend($.ui.slider.prototype.options, {
        animate: true,
        create: function() {
          var value = $(this).data('val');

          $(this).slider('value', value);
          showCurrentValue($(this).parent(), value);
        }
      });

      $('.slider').each(function() {
        var $this = $(this);

        $this.slider({
          min   : $this.data('min'),
          max   : $this.data('max'),
          value : $this.data('val'),
          slide : function(event, ui) {
            showCurrentValue($this.parent(), values[$this.parent().data('key')] = ui.value);
          }
        });
      });

      $('.colorpick').find('input').minicolors({
        letterCase: 'uppercase',
        position: 'bottom right',
        change: function() {
          updateColor();
          updateCss();
        }
      });

      function updateColor() {
        $.extend(values, {
          baseColor      : $('#base-color').find('input').val(),
          secondaryColor : $('#secondary-color').find('input').val(),
          labelColor     : $('#label-color').find('input').val(),
          buttonColor    : $('#button-color').find('input').val(),
          buttonBgColor  : $('#button-background-color').find('input').val()
        });
      }
    }

    function showCurrentValue(elm, value) {
      elm.find('.value').text(value + 'px');
      updateCss();
    }

    function updateCss() {
      values.hoverBaseColor      = shadeColor(values.baseColor, -10);
      values.hoverSecondaryColor = shadeColor(values.secondaryColor, -10);
      values.innerHeight         = values.height - ( values.borderWidth * 2 );

      $template.html(format(_template, values));
      buildDownloadLink();
    }

    function buildDownloadLink() {
      if ( $('#presets').val() == 'custom' ) {
        setDownloadData($template.html());
      } else {
        $.get($theme.prop('href'), setDownloadData);
      }
    }

    function setDownloadData(themeCss) {
      var generatedCss = escape((themeCss.replace(/\n\t/g, '\n')));

      $('.bt-download').prop('href', 'data:application/octet-stream;charset=utf-8,' + generatedCss);
      $('.bt-view-raw').prop('href', 'data:text/plain;charset=utf-8,' + generatedCss);
    }

    buildDownloadLink();

    /*======================================
      Demos
    ======================================*/
    $.fn.selectric.defaults.disableOnMobile = false;

    $('#basic').selectric();

    $('#forceRenderAbove').selectric({ forceRenderAbove: true });

    /*------------------------------------*/

    // Cache the target element
    var $selectValue = $('#select_value').find('strong');

    // Get initial value
    $selectValue.text($('#get_value').val());

    // Initialize Selectric and bind to 'change' event
    $('#get_value').selectric().on('change', function() {
      $selectValue.text($(this).val());
    });

    /*------------------------------------*/

    $('#set_value').selectric();

    $('#set_first_option').on('click', function() {
      $('#set_value').prop('selectedIndex', 0).selectric('refresh');
    });

    $('#set_second_option').on('click', function() {
      $('#set_value').prop('selectedIndex', 1).selectric('refresh');
    });

    $('#set_third_option').on('click', function() {
      $('#set_value').prop('selectedIndex', 2).selectric('refresh');
    });

    /*------------------------------------*/

    $('#dynamic').selectric();

    $('#bt_add_val').click(function() {
      // Store the value in a variable
      var value = $('#add_val').val();

      // Append to original select
      $('#dynamic').append('<option>' + (value ? value : 'Empty') + '</option>');

      // Refresh Selectric
      $('#dynamic').selectric('refresh');
    });

    /*------------------------------------*/

    // With events
    $('#callbacks')
      .on('selectric-before-open', function() {
        alert('Before open');
      })
      .on('selectric-before-close', function() {
        alert('Before close');
      })
      // You can bind to change event on original element
      .on('change', function() {
        alert('Change');
      });

    // Or, with plugin options
    $('#callbacks').selectric({
      onOpen: function() {
        alert('Open');
      },
      onChange: function() {
        alert('Change');
      },
      onClose: function() {
        alert('Close');
      }
    });

    /*------------------------------------*/

    $.get('ajax.html', function(data) {
      $('#ajax').append(data).selectric();
    });

    /*------------------------------------*/

    $('.custom-options').selectric({
      optionsItemBuilder: function(itemData) {
        return itemData.value.length ?
          '<span class="ico ico-' + itemData.value +  '"></span>' + itemData.text :
          itemData.text;
      }
    });
  });
}());
