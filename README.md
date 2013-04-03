#jQuery Selectric ϟ
===================

jQuery Selectric is a jQuery plugin designed to help at stylizing and manipulating HTML selects.

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
.selectricWrapper { position: relative; margin: 0 0 10px; }
.selectricWrapper.selectricOpen { z-index: 9999; }
.selectricHideSelect { position: relative; overflow: hidden; }
.selectricHideSelect select { position: absolute; left: -100%; }
.selectric { border: 1px solid #DDD; background: #F8F8F8; width: 300px; position: relative; border-radius: 2px; cursor: pointer; line-height: 16px; }
.selectricOpen .selectric { border: 1px solid #CCC; background: #EEE; z-index: 9999; }
.selectric .label { display: block; white-space: nowrap; overflow: hidden; margin: 0 30px 0 0; padding: 5px 0 5px 5px; font-size: 13px; color: #444; }
.selectric .label span { background: #09F; color: #FFF; }
.selectric span.button { position: absolute; right: 2px; top: 2px; line-height: 22px; height: 22px; width: 23px; border-radius: 2px; color: #FFF; text-align: center; background: #A7C7DC; }
.hover span.button { background: #85B2D3; }
.selectricTempShow { position: absolute !important; visibility: hidden !important; display: block !important; }

/* Items box */
.selectricItems ul,
.selectricItems li { list-style: none; padding: 0; margin: 0; min-height: 20px; font-size: 13px; }
.selectricItems { display: none; position: absolute; overflow: auto; top: 100%; left: 0; background: #F9F9F9; border: 1px solid #CCC; z-index: 9998; }
.selectricItems li { padding: 5px; cursor: pointer; display: block; border-bottom: 1px solid #EEE; color: #666; border-top: 1px solid #FFF; }
.selectricItems li.selected { background: #EFEFEF; color: #444; border-top: 1px solid #E0E0E0; }
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
		<td>&lt;span class=&quot;button&quot;&gt;&amp;#9662;&lt;/span&gt;</td>
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
		<td>Options box border</td>
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