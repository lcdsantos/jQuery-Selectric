$(function(){
  var theme = $('#theme'),
      sharedProps = $('#shared-prop').html(),
      $custom = $('.custom').hide(),
      format = function(f){var a=arguments;return(""+f).replace(/\{(?:(\d+)|(\w+))\}/g,function(s,i,p){return p&&a[1]?a[1][p]:a[i]})},
      shadeColor = function(color, percent){
        // strip the leading # if it's there
        var color = color.replace(/^\s*#|\s*$/g, '');

        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
        if (color.length == 3){
          color = color.replace(/(.)/g, '$1$1');
        }

        var num = parseInt(color, 16),
            amt = Math.round(2.55 * percent),
            R   = (num >> 16) + amt,
            B   = (num >> 8 & 0x00FF) + amt,
            G   = (num & 0x0000FF) + amt;

        return "#" +
          (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
      };

  theme.html( sharedProps + '\n' + $('#default').html() );

  $('#presets').change(function(e) {
    e.preventDefault();

    var value = $(this).val();

    if ( value == 'custom' ){
      $custom.slideDown();
      theme.html( sharedProps + '\n' + $('#default').html() );
    } else {
      $custom.slideUp();
      theme.html( sharedProps + '\n' + $('#' + value).html() );
    }

    buildDownloadLink();
  });

  var borderWidth    = '',
      borderRadius   = '',
      height         = '',
      indent         = '',
      baseColor      = '',
      secondaryColor = '',
      labelColor     = '',
      buttonSize     = '',
      buttonBgColor  = '',
      buttonRadius   = '';

  $('#border-width-slider').find('.slider').slider({
    value: $('#border-width-slider').find('.slider').data('val'),
    max: 10,
    animate: true,
    step: 1,
    slide: function( event, ui ) {
      borderWidth = ui.value;
      showCurrentValue($('#border-width-slider'), borderWidth);
      updateCss();
    },
    create: createSlider
  });

  $('#border-round-slider').find('.slider').slider({
    value: $('#border-round-slider').find('.slider').data('val'),
    max: 100,
    animate: true,
    step: 1,
    slide: function( event, ui ) {
      borderRadius = ui.value;
      showCurrentValue($('#border-round-slider'), borderRadius);
      updateCss();
    },
    create: createSlider
  });

  $('#height-slider').find('.slider').slider({
    min: 22,
    max: 50,
    animate: true,
    step: 1,
    slide: function( event, ui ) {
      height = ui.value;
      showCurrentValue($('#height-slider'), height);
      updateCss();
    },
    create: createSlider
  });

  $('#indent-slider').find('.slider').slider({
    min: 6,
    max: 30,
    animate: true,
    step: 1,
    slide: function( event, ui ) {
      indent = ui.value;
      showCurrentValue($('#indent-slider'), indent);
      updateCss();
    },
    create: createSlider
  });

  $('#button-size-slider').find('.slider').slider({
    min: 12,
    max: 40,
    animate: true,
    step: 1,
    slide: function( event, ui ) {
      buttonSize = ui.value;
      showCurrentValue($('#button-size-slider'), buttonSize);
      updateCss();
    },
    create: createSlider
  });

  $('#button-round-slider').find('.slider').slider({
    max: 100,
    animate: true,
    step: 1,
    slide: function( event, ui ) {
      buttonRadius = ui.value;
      showCurrentValue($('#button-round-slider'), buttonRadius);
      updateCss();
    },
    create: createSlider
  });

  $('.colorpick').find('input').minicolors({
    letterCase: 'uppercase',
    change: function(){
      baseColor = $('#base-color').find('input').val();
      secondaryColor = $('#secondary-color').find('input').val();
      labelColor = $('#label-color').find('input').val();
      buttonBgColor = $('#button-background-color').find('input').val();

      updateCss();
    }
  });

  function createSlider(){
    var value = $(this).data('val');

    $(this).slider('value', value);
    showCurrentValue( $(this).parent(), value );
  }

  function showCurrentValue(elm, value){
    elm.find('.value').text(value + 'px');
  }

  function updateCss(){
    var values = {
          borderWidth         : (borderWidth !== ''+borderWidth) ? borderWidth : 1,
          baseColor           : baseColor ? baseColor : '#F8F8F8',
          secondaryColor      : secondaryColor ? secondaryColor : '#DDD',
          labelColor          : labelColor ? labelColor : '#444',
          borderRadius        : borderRadius ? borderRadius : 0,
          height              : height ? height : 30,
          innerHeight         : height ? (height - 12) : 18,
          indent              : indent ? indent : 6,
          hoverBaseColor      : shadeColor(baseColor ? baseColor : '#F8F8F8', -10),
          hoverSecondaryColor : shadeColor(secondaryColor ? secondaryColor : '#DDD', -10),
          buttonSize          : buttonSize ? buttonSize : 18,
          buttonBgColor       : buttonBgColor ? buttonBgColor : 'none',
          buttonRadius        : buttonRadius ? buttonRadius : 0
        },
        css = [
          '.selectricOpen .selectric {',
          '  border-color: {hoverSecondaryColor};',
          '  background: {hoverBaseColor};',
          '  z-index: 9999;',
          '}',
          '.selectric {',
          '  border: {borderWidth}px solid {secondaryColor};',
          '  background: {baseColor};',
          '  position: relative;',
          '  border-radius: {borderRadius}px;',
          '}',
          '.selectric .label {',
          '  display: block;',
          '  white-space: nowrap;',
          '  overflow: hidden;',
          '  margin: 0 {height}px 0 0;',
          '  padding: 6px {indent}px;',
          '  font-size: 12px;',
          '  line-height: {innerHeight}px;',
          '  color: {labelColor};',
          '  min-height: {innerHeight}px;',
          '}',
          '.selectric .button {',
          '  background: {buttonBgColor};',
          '  border-radius: {buttonRadius}px;',
          '  display: block;',
          '  position: absolute;',
          '  right: 0;',
          '  top: 0;',
          '  width: {height}px;',
          '  height: {height}px;',
          '  color: {secondaryColor};',
          '  text-align: center;',
          '  font: 0/0 a;',
          '  /* IE Fix */',
          '  *font: {buttonSize}px/{height}px Lucida Sans Unicode, Arial Unicode MS, Arial;',
          '}',
          '.selectric .button:after {',
          '  content: " ";',
          '  position: absolute;',
          '  top: 0;',
          '  right: 0;',
          '  bottom: 0;',
          '  left: 0;',
          '  margin: auto;',
          '  width: 0;',
          '  height: 0;',
          '  border: 4px solid transparent;',
          '  border-top-color: {secondaryColor};',
          '  border-bottom: none;',
          '}',
          '.selectricHover .selectric {',
          '  border-color: {hoverSecondaryColor};',
          '}',
          '.selectricHover .selectric .button {',
          '  color: {hoverSecondaryColor};',
          '}',
          '.selectricHover .selectric .button:after {',
          '  border-top-color: {hoverSecondaryColor};',
          '}'
        ].join('\n').replace('}', '}\n');

    theme.html(sharedProps + '\n' + format(css, values));

    buildDownloadLink();
  }

  function buildDownloadLink(){
    var themeCss = theme.html(),
        itemsCss = $('#items-style').html(),
        generatedCss = escape( (themeCss.replace(/\n\t/g, '\n') + itemsCss.replace(/\n\t/g, '\n')).replace(/\t/g, '  ').replace(/^[\n\t\r]/g, '') );

    $('.bt-download').prop('href', 'data:application/octet-stream;charset=utf-8,' + generatedCss);
    $('.bt-view-raw').prop('href', 'data:text/plain;charset=utf-8,' + generatedCss);
  }

  buildDownloadLink();

  // Demos
  $('#basic').selectric();

  $('#dynamic').selectric();

  $('#bt_add_val').click(function(e){
    e.preventDefault();

    // Store the value in a variable
    var value = $('#add_val').val();

    // Append to original select
    $('#dynamic').append('<option>' + (value ? value : 'Empty') + '</option>');

    // Refresh Selectric
    $('#dynamic').selectric('refresh');
  });

  $('#callbacks').change(function(){
    alert('Change');
  });

  $('#callbacks').selectric({
    onOpen: function(){
      alert('Open');
    },
    onChange: function(){
      alert('Change');
    },
    onClose: function(){
      alert('Close');
    }
  });

  $.get('ajax.html', function(data){
    $('#ajax').append(data).selectric();
  });

  // $('select').selectric();
});