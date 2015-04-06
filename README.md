#jQuery Selectric ![icon](http://i.imgur.com/D2hcnUN.png)

jQuery Selectric is a jQuery plugin designed to help at stylizing and manipulating HTML selects.

* Keyboard navigation (Up/Down/Left/Right/Word search)
* Easily customizable
* Pretty lightweight
* Options box always stay visible
* Doesn't rely on external libraries (besides jQuery)
* Word search works with western latin characters set (e.g.: á, ñ, ç...)

###[Demo](http://lcdsantos.github.io/jQuery-Selectric/)

##How to use:

Make sure to include jQuery in your page:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
```

Include **jQuery Selectric:**

```html
<script src="js/jquery.selectric.min.js"></script>
```

Put styles in your CSS and change it to your taste :D

```css
/*======================================
  Selectric
======================================*/
.selectricWrapper {
  position: relative;
  cursor: pointer;
}

.selectricResponsive {
  width: 100%;
}

.selectric {
  border: 1px solid #DDD;
  background: #F8F8F8;
  position: relative;
}
.selectric .label {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 38px 0 10px;
  font-size: 12px;
  line-height: 38px;
  color: #444;
  height: 38px;
}
.selectric .button {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  width: 38px;
  height: 38px;
  color: #BBB;
  text-align: center;
  font: 0/0 a;
  *font: 20px/38px Lucida Sans Unicode, Arial Unicode MS, Arial;
}
.selectric .button:after {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-top-color: #BBB;
  border-bottom: none;
}

.selectricHover .selectric {
  border-color: #C4C4C4;
}
.selectricHover .selectric .button {
  color: #A2A2A2;
}

.selectricOpen {
  z-index: 9999;
}
.selectricOpen .selectric {
  border-color: #C4C4C4;
}
.selectricOpen .selectricItems {
  display: block;
}

.selectricDisabled {
  filter: alpha(opacity=50);
  opacity: 0.5;
  cursor: default;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.selectricHideSelect {
  position: relative;
  overflow: hidden;
  width: 0;
  height: 0;
}
.selectricHideSelect select {
  position: absolute;
  left: -100%;
  display: none;
}

.selectricInput {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 1px !important;
  height: 1px !important;
  outline: none !important;
  border: none !important;
  *font: 0/0 a !important;
  background: none !important;
}

.selectricTempShow {
  position: absolute !important;
  visibility: hidden !important;
  display: block !important;
}

/* Items box */
.selectricItems {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #F8F8F8;
  border: 1px solid #C4C4C4;
  z-index: -1;
  box-shadow: 0 0 10px -6px;
}
.selectricItems .selectricScroll {
  height: 100%;
  overflow: auto;
}
.selectricAbove .selectricItems {
  top: auto;
  bottom: 100%;
}
.selectricItems ul, .selectricItems li {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  line-height: 20px;
  min-height: 20px;
}
.selectricItems li {
  display: block;
  padding: 8px;
  border-top: 1px solid #FFF;
  border-bottom: 1px solid #EEE;
  color: #666;
  cursor: pointer;
}
.selectricItems li.selected {
  background: #EFEFEF;
  color: #444;
}
.selectricItems li:hover {
  background: #F0F0F0;
  color: #444;
}
.selectricItems .disabled {
  filter: alpha(opacity=50);
  opacity: 0.5;
  cursor: default !important;
  background: none !important;
  color: #666 !important;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.selectricItems .selectricGroup .selectricGroupLabel {
  font-weight: bold;
  padding-left: 10px;
  cursor: default;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  background: none;
  color: #444;
}
.selectricItems .selectricGroup.disabled li {
  filter: alpha(opacity=100);
  opacity: 1;
}
.selectricItems .selectricGroup li {
  padding-left: 25px;
}
```

Initialize **jQuery Selectric:**

```html
<script>
$(function(){
  $('select').selectric();
});
</script>
```

##Options:

```js
{
  /*
   * Type: Function
   * Description: Function called before plugin initialize
   */
  onBeforeInit: function() {},

  /*
   * Type: Function
   * Description: Function called plugin has been fully initialized
   */
  onInit: function() {},

  /*
   * Type: Function
   * Description: Function called plugin has been fully initialized
   */
  onBeforeOpen: function() {},

  /*
   * Type: Function
   * Description: Function called after select options opens
   */
  onOpen: function() {},

  /*
   * Type: Function
   * Description: Function called before select options closes
   */
  onBeforeClose: function() {},

  /*
   * Type: Function
   * Description: Function called after select options closes
   */
  onClose: function() {},

  /*
   * Type: Function
   * Description: Function called before select options change
   */
  onBeforeChange: function() {},

  /*
   * Type: Function
   * Description: Function called when select options change
   */
  onChange: function(element) {
    $(element).change();
  },

  /*
   * Type: Function
   * Description: Function called when the Selectric is refreshed
   */
  onRefresh: function() {},

  /*
   * Type: Integer
   * Description: Maximum height options box can be
   */
  maxHeight: 300,

  /*
   * Type: Integer
   * Description: After this time without pressing
   *              any key, the search string is reset
   */
  keySearchTimeout: 500,

  /*
   * Type: String [HTML]
   * Description: Markup for open options button
   */
  arrowButtonMarkup: '<b class="button">&#x25be;</b>',

  /*
   * Type: Boolean
   * Description: Initialize plugin on mobile browsers
   */
  disableOnMobile: true,

  /*
   * Type: Boolean
   * Description: Open select box on hover, instead of click
   */
  openOnHover: false,

  /*
   * Type: Integer
   * Description: Timeout to close options box after mouse leave plugin area
   */
  hoverIntentTimeout: 500,

  /*
   * Type: Boolean
   * Description: Expand options box past wrapper
   */
  expandToItemText: false,

  /*
   * Type: Boolean
   * Description: The select element become responsive
   */
  responsive: false,

  /*
   * Type: Object
   * Description: Customize classes.
   *              Every class in 'postfixes' should be separate with a
   *              space and follow this exact order:
   *              'Input Items Open Disabled TempShow HideSelect Wrapper
   *              Hover Responsive Above Scroll Group GroupLabel'
   */
  customClass: {
    prefix: 'selectric',
    camelCase: false,
    overwrite: true
  },

  /*
   * Type: String or Function
   * Description: Define how each option should be rendered inside its <li> element.
   *
   *              If it's a string, all keys wrapped in brackets will be replaced by
   *              the respective values in itemData. Available keys are:
   *              'value', 'text', 'slug', 'disabled'.
   *
   *              If it's a function, it will be called with the following parameters:
   *              (itemData, element, index). The function must return a string,
   *              no keys will be replaced in this method.
   */
  optionsItemBuilder: '{text}',

  /*
   * Type: Boolean
   * Description: Prevent scroll on window when using mouse wheel inside options box
   *              to match common browsers behavior.
   */
  preventWindowScroll: true,

  /*
   * Type: Boolean
   * Description: Inherit width from original element
   */
  inheritOriginalWidth: false,

  /*
   * Type: Boolean
   * Description: Determine if current selected option should jump to
   *              first (or last) once reach the end (or start) item of list upon
   *              keyboard arrow navigation.
   */
  allowWrap: false
}
```

##Events:

All events are called on original element, first argument is the original element too. And can be bound like this:

```js
$('select').on('eventname', function(element){
  // your code
});
```

`eventname` can be one of the following:

<table>
  <tr>
    <td><strong>Event name</strong></td>
    <td><strong>Description</strong></td>
  </tr>
  <tr>
    <td><code>selectric-before-init</code></td>
    <td>Fired before plugin initialize</td>
  </tr>
  <tr>
    <td><code>selectric-init</code></td>
    <td>Fired plugin has been fully initialized</td>
  </tr>
  <tr>
    <td><code>selectric-before-open</code></td>
    <td>Fired before select options opens</td>
  </tr>
  <tr>
    <td><code>selectric-open</code></td>
    <td>Fired after select options opens</td>
  </tr>
  <tr>
    <td><code>selectric-before-close</code></td>
    <td>Fired before select options closes</td>
  </tr>
  <tr>
    <td><code>selectric-close</code></td>
    <td>Fired after select options closes</td>
  </tr>
  <tr>
    <td><code>selectric-before-change</code></td>
    <td>Fired before select options change</td>
  </tr>
  <tr>
    <td><code>selectric-change</code></td>
    <td>Fired when select options change</td>
  </tr>
  <tr>
    <td><code>selectric-refresh</code></td>
    <td>Fired when the Selectric is refreshed</td>
  </tr>
</table>

##Hooks:

Check [jquery.selectric.placeholder.js](plugins/jquery.selectric.placeholder.js) source for a usage example

```js
// Add a callback everytime 'callbackName' is called
$.fn.selectric.hooks.add('callbackName', 'hookName', function(element, data) {});

// Remove a callback
$.fn.selectric.hooks.remove('callbackName', 'hookName');
```


##Public methods:

```js
var Selectric = $('select').data('selectric');

Selectric.open();    // Open options
Selectric.close();   // Close options
Selectric.destroy(); // Destroy select and go back to normal
Selectric.refresh(); // Reconstruct the plugin options box
Selectric.init();    // Reinitialize the plugin

// Or...
$('select').selectric('open');    // Open options
$('select').selectric('close');   // Close options
$('select').selectric('destroy'); // Destroy select and go back to normal
$('select').selectric('refresh'); // Reconstruct the plugin options box
$('select').selectric('init');    // Reinitialize the plugin
```

##Browser support:

* Firefox
* Chrome
* Safari
* Internet Explorer 7+
* Opera
