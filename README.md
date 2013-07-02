#jQuery Selectric ϟ

jQuery Selectric is a jQuery plugin designed to help at stylizing and manipulating HTML selects.

* Keyboard navigation (Up/Down/Left/Right/String search)
* Easily customizable
* Pretty lightweight (3,3KB minified and 1,9KB minified/gzip)

##How to use:

Make sure to include jQuery in your page:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
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
.selectricWrapper { position: relative; margin: 0 0 10px; width: 300px; cursor: pointer; }
.selectricDisabled { filter: alpha(opacity=50); opacity: 0.5; cursor: default; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
.selectricOpen { z-index: 9999; }
.selectricHideSelect { position: relative; overflow: hidden; }
.selectricHideSelect select { position: absolute; left: -100%; }
.selectric { border: 1px solid #DDD; background: #F8F8F8; position: relative; border-radius: 2px; }
.selectricOpen .selectric { border-color: #CCC; background: #F0F0F0; z-index: 9999; }
.selectric .label { display: block; white-space: nowrap; overflow: hidden; margin: 0 30px 0 0; padding: 6px; font-size: 12px; line-height: 1.5; color: #444; }
.selectric .button { position: absolute; right: 0; top: 0; height: 30px; width: 30px; color: #BBB; text-align: center; font: normal 18px/30px sans-serif; }
.hover .selectric { border-color: #CCC; }
.hover .selectric .button { color: #888; }
.selectricTempShow { position: absolute !important; visibility: hidden !important; display: block !important; }

/* Items box */
.selectricItems ul,
.selectricItems li { list-style: none; padding: 0; margin: 0; min-height: 20px; line-height: 20px; font-size: 12px; }
.selectricItems { display: none; position: absolute; overflow: auto; top: 100%; left: 0; background: #F9F9F9; border: 1px solid #CCC; z-index: 9998; box-shadow: 0 0 10px -6px; }
.selectricItems li { padding: 5px; cursor: pointer; display: block; border-bottom: 1px solid #EEE; color: #666; border-top: 1px solid #FFF; }
.selectricItems li.selected { background: #EFEFEF; color: #444; border-top-color: #E0E0E0; }
.selectricItems li:hover { background: #F0F0F0; color: #444; }
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
		<td>Function called when select options is opened</td>
	</tr>
	<tr>
		<td>onClose</td>
		<td>function() {}</td>
		<td>Function</td>
		<td>Function called when select options is closed</td>
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
		<td>After this time without pressing any key, the search string is reseted</td>
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
		<td>margin</td>
		<td>5</td>
		<td>Integer</td>
		<td>Minimum space between opened options and window</td>
	</tr>
	<tr>
		<td>border</td>
		<td>1</td>
		<td>Integer</td>
		<td>Options box border thickness</td>
	</tr>
</table>

##Public methods:

```js
$('select').selectric('refresh'); // Reconstruct the instance of plugin
$('select').selectric('destroy'); // Destroy Selectric and go back to normal
$('select').selectric('open'); // Open options
$('select').selectric('close'); // Close options
```

##Browser support:

* Firefox
* Chrome
* Safari
* Internet Explorer 7+
* Opera