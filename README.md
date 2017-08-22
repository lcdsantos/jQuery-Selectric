[![JS.ORG](https://img.shields.io/badge/js.org-selectric-ffb400.svg)](http://js.org)
[![Travis](https://img.shields.io/travis/lcdsantos/jQuery-Selectric.svg)](https://travis-ci.org/lcdsantos/jQuery-Selectric)
[![codecov.io](https://codecov.io/github/lcdsantos/jQuery-Selectric/coverage.svg?branch=master)](https://codecov.io/github/lcdsantos/jQuery-Selectric?branch=master)
[![npm](https://img.shields.io/npm/v/selectric.svg)](https://www.npmjs.com/package/selectric)

# jQuery Selectric ![icon](http://i.imgur.com/D2hcnUN.png)

jQuery Selectric is a jQuery plugin designed to help at stylizing and manipulating HTML selects.

* Keyboard navigation (Up/Down/Left/Right/Word search)
* Easily customizable
* Pretty lightweight
* Options box always stay visible
* Doesn't rely on external libraries (besides jQuery)
* Word search works with western latin characters set (for example: á, ñ, ç...)

### [Demo](http://lcdsantos.github.io/jQuery-Selectric/)

## How to use:

Make sure to include jQuery in your page:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
```

Include **jQuery Selectric:**

```html
<script src="js/jquery.selectric.min.js"></script>
```

Include **jQuery Selectric** styles, and change it to your taste :D _(please refer to our [demo page](http://lcdsantos.github.io/jQuery-Selectric/demo.html) for more themes and other customizations)_

```html
<link rel="stylesheet" href="selectric.css">
```

Initialize **jQuery Selectric:**

```html
<script>
$(function() {
  $('select').selectric();
});
</script>
```

## Options:

You can pass an options object as the first parameter when you call the plugin. For example:
```js
$('select').selectric({
  maxHeight: 200
});
```

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
   * Description: Function called before select options opens
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
  arrowButtonMarkup: '&lt;b class=&quot;button&quot;&gt;&amp;#x25be;&lt;/b&gt;',

  /*
   * Type: Boolean
   * Description: Initialize plugin on mobile browsers
   */
  disableOnMobile: false,

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
   */
  customClass: {
    prefix: 'selectric', // Type: String.  Description: Prefixed string of every class name.
    camelCase: false     // Type: Boolean. Description: Switch classes style between camelCase or dash-case.
  },

  /*
   * Type: String or Function
   * Description: Define how each option should be rendered inside its <li> element.
   *
   *              If it's a string, all keys wrapped in brackets will be replaced by
   *              the respective values in itemData. Available keys are:
   *              'value', 'text', 'slug', 'index'.
   *
   *              If it's a function, it will be called with the following parameter:
   *              (itemData). The function must return a string. If available all keys
   *              will be replaced by the respective values in itemData.
   *
   *              itemData<Object> {
   *                 className // Type: String.          Description: option class names.
   *                 disabled  // Type: Boolean.         Description: option is disabled true/false
   *                 selected  // Type: Boolean.         Description: option is selected true/false
   *                 element   // Type: HTMLDomElement.  Description: current select element
   *                 index     // Type: Number.          Description: current option index
   *                 slug      // Type: String.          Description: option slug
   *                 text      // Type: String.          Description: option text
   *                 value     // Type: String.          Description: option value
   *              }
   *
   *              EXAMPLE:
   *
   *              function(itemData) {
   *                  return '{text}';
   *              }
   *
   *              // you're free to build and return your own strings
   *              function(itemData) {
   *                  return itemData.text + '(' + itemData.index + ')';
   *              }
   */
  optionsItemBuilder: '{text}',

  /*
   * Type: String or Function
   * Description: Define how each select label should be rendered. Allows HTML.
   *
   *              If it's a string, all keys wrapped in brackets will be replaced by
   *              the respective values in currItem. Available keys are:
   *              'value', 'text', 'slug', 'disabled'.
   *
   *              If it's a function, it will be called with the following parameters:
   *              (currItem). The function must return a string, no keys will be
   *              replaced in this method.
   */
  labelBuilder: '{text}',

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
   * Description: call stopProgation on onOpen click event
   */
  stopPropagation: true,

  /*
   * Type: Boolean
   * Description: Determine if current selected option should jump to
   *              first (or last) once reach the end (or start) item of list upon
   *              keyboard arrow navigation.
   */
  allowWrap: true,

  /*
   * Type: Boolean
   * Description: By default the options box gets opened above if it's outside the window.
   *              In case this auto detection doesn't work as expected (e.g. in transform/relative scopes)
   *              you may force opening above.
   */
  forceRenderAbove: false,

  /*
   * Type: Boolean
   * Description: In some cases the options box gets opened above even though the desired behavior would be below.
   *              If the auto dectection doesn't work as expected you may force opening below.
   */
  forceRenderBelow: false,

  /*
   * Type: Object
   * Description: Customize select "multiple" behavior
   */
  multiple: {
    separator: ', ',       // Type: String.             Description: Items separator.
    keepMenuOpen: true,    // Type: Boolean.            Description: Close after an item is selected.
    maxLabelEntries: false // Type: Boolean or Integer. Description: Max selected items do show.
  }
}
```

## Events:

All events are called on original element, first argument is the original element too. And can be bound like this:

```js
$('select').on('eventname', function(element) {
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
    <td><code>selectric-before-highlight</code></td>
    <td>Fired before a select option is highlighted</td>
  </tr>
  <tr>
    <td><code>selectric-highlight</code></td>
    <td>Fired when a select option is highlighted</td>
  </tr>
  <tr>
    <td><code>selectric-before-select</code></td>
    <td>Fired before a select option is selected</td>
  </tr>
  <tr>
    <td><code>selectric-select</code></td>
    <td>Fired before a select option is selected</td>
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

## Public methods:

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

## Browser support:

* Firefox
* Chrome
* Safari
* Internet Explorer 7+
* Opera
