#jQuery Selectric ![icon](http://i.imgur.com/D2hcnUN.png)

jQuery Selectric is a jQuery plugin designed to help at stylizing and manipulating HTML selects.

* Keyboard navigation (Up/Down/Left/Right/Word search)
* Easily customizable
* Pretty lightweight (3,4KB minified and less than 2KB minified/gzip)
* Options box always stay visible
* Doesn't rely on external libraries (besides jQuery)
* Word search works with western latin characters set (e.g.: á, ñ, ç...)

###[Demo](http://lcdsantos.github.io/jQuery-Selectric/)

##How to use:

Make sure to include jQuery in your page:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
```

Include **jQuery Selectric:**

```html
<script src="js/jquery.selectric.min.js"></script>
```

Put styles in your CSS and change it to your taste :D

```css
/*======================================================================
  Selectric
======================================================================*/

.selectricWrapper {
  position: relative;
  margin: 0 0 10px;
  width: 300px;
  cursor: pointer;
}

.selectricResponsive {
  width: 100%;
}

.selectric {
  border: 1px solid #DDD;
  background: #F8F8F8;
  position: relative;
  border-radius: 2px;
}

.selectric .label {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  margin: 0 30px 0 0;
  padding: 6px;
  font-size: 12px;
  line-height: 18px;
  color: #444;
  min-height: 18px;
}

.selectric .button {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
  color: #BBB;
  text-align: center;
  font: 0/0 a;
  /* IE Fix */
  *font: 20px/30px Lucida Sans Unicode, Arial Unicode MS, Arial;
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
  border-color: #CCC;
}

.selectricHover .selectric .button {
  color: #888;
}

.selectricHover .selectric .button:after {
  border-top-color: #888;
}

.selectricOpen {
  z-index: 9999;
}

.selectricOpen .selectric {
  border-color: #CCC;
  background: #F0F0F0;
  z-index: 9999;
}

.selectricOpen .selectricItems {
  display: block;
}

.selectricDisabled {
  filter: alpha(opacity=50);
  opacity: 0.5;
  cursor: default;
  -webkit-touch-callout: none;
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
  overflow: auto;
  top: 100%;
  left: 0;
  background: #F9F9F9;
  border: 1px solid #CCC;
  z-index: 9998;
  -webkit-box-shadow: 0 0 10px -6px;
  box-shadow: 0 0 10px -6px;
}

.selectricItems ul,
.selectricItems li {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  line-height: 20px;
  min-height: 20px;
}

.selectricItems li {
  display: block;
  padding: 5px;
  border-top: 1px solid #FFF;
  border-bottom: 1px solid #EEE;
  color: #666;
  cursor: pointer;
}

.selectricItems li.selected {
  background: #EFEFEF;
  color: #444;
  border-top-color: #E0E0E0;
}

.selectricItems li:hover {
  background: #F0F0F0;
  color: #444;
}

.selectricItems li.disabled {
  background: #F5F5F5;
  color: #BBB;
  border-top-color: #FAFAFA;
  cursor: default;
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

<table>
  <tr>
    <td><strong>Option</strong></td>
    <td><strong>Default</strong></td>
    <td><strong>Type</strong></td>
    <td><strong>Description</strong></td>
  </tr>
  <tr>
    <td>onOpen</td>
    <td>function() {}</td>
    <td>Function</td>
    <td>Function called when select options open</td>
  </tr>
  <tr>
    <td>onChange</td>
    <td>function() {}</td>
    <td>Function</td>
    <td>Function called when select options change</td>
  </tr>
  <tr>
    <td>onClose</td>
    <td>function() {}</td>
    <td>Function</td>
    <td>Function called when select options close</td>
  </tr>
  <tr>
    <td>onRefresh</td>
    <td>function() {}</td>
    <td>Function</td>
    <td>Function called when the selectric is refreshed (or initialized)</td>
  </tr>
  <tr>
    <td>maxHeight</td>
    <td>300</td>
    <td>Integer</td>
    <td>Maximum height options box can be</td>
  </tr>
  <tr>
    <td>keySearchTimeout</td>
    <td>500</td>
    <td>Integer</td>
    <td>After this time without pressing any key, the search string is reset</td>
  </tr>
  <tr>
    <td>arrowButtonMarkup</td>
    <td>&lt;b class=&quot;button&quot;&gt;&amp;#9662;&lt;/b&gt;</td>
    <td>String [HTML]</td>
    <td>Markup for open options button</td>
  </tr>
  <tr>
    <td>disableOnMobile</td>
    <td>true</td>
    <td>Boolean</td>
    <td>Initialize plugin on mobile browsers</td>
  </tr>
  <tr>
    <td>border</td>
    <td>1</td>
    <td>Integer</td>
    <td>Options box border thickness</td>
  </tr>
  <tr>
    <td>openOnHover</td>
    <td>false</td>
    <td>Boolean</td>
    <td>Open select box on hover, instead of click</td>
  </tr>
  <tr>
    <td>expandToItemText</td>
    <td>false</td>
    <td>Boolean</td>
    <td>Expand options box past wrapper</td>
  </tr>
  <tr>
    <td>responsive</td>
    <td>false</td>
    <td>Boolean</td>
    <td>The select element become responsive</td>
  </tr>
  <tr>
    <td>customClass</td>
    <td>{
      prefix: 'selectric',
      postfixes: 'Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive',
      camelCase: true
    }</td>
    <td>Object</td>
    <td>Custom classes.
    Every class in 'postfixes' should be separate with a space and follow this exact order: 'Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive'</td>
  </tr>
  <tr>
    <td>optionsItemBuilder</td>
    <td>'{text}'</td>
    <td>String or Function</td>
    <td>Define how each option should be rendered inside its &lt;li&gt; element.

    If it's a string, all keys wrapped in brackets will be replaced by the respective values in itemData. Available keys are: 'value', 'text', 'slug', 'disabled'.

    If it's a function, it will be called with the following parameters: (itemData, element, index). The function must return a string, no keys will be replaced in this method.</td>
  </tr>
</table>

##Public methods:

```js
$('select').selectric('refresh'); // Reconstruct the instance of plugin
$('select').selectric('destroy'); // Destroy Selectric and go back to normal
$('select').selectric('open');    // Open options
$('select').selectric('close');   // Close options
```

##Browser support:

* Firefox
* Chrome
* Safari
* Internet Explorer 7+
* Opera