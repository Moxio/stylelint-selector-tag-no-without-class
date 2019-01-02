[![Build Status](https://travis-ci.org/Moxio/stylelint-selector-tag-no-without-class.svg?branch=master)](https://travis-ci.org/Moxio/stylelint-selector-tag-no-without-class)
[![NPM version](https://img.shields.io/npm/v/stylelint-selector-tag-no-without-class.svg)](https://www.npmjs.com/package/stylelint-selector-tag-no-without-class)

stylelint-selector-tag-no-without-class
=======================================
A [stylelint](https://github.com/stylelint/stylelint) plugin to disallow certain tags without a class qualifier in selectors.

For example, if this rule is configured for (only) the `<div>` tag, the following patterns are considered violations:
```css
div {}
```
```css
.foo div {}
```
```css
div .foo {}
```
```css
div, .bar {}
```
```css
div:hover {}
```
The following patterns are not considered violations:
```css
div.foo {}  /* (tag is qualified with a class) */
```
```css
a {}        /* (rule not configured for '<a>' tag) */
```

Rationale
---------
According to the HTML specification, tags like `<div>` and `<span>` do no inherently represent anything. It would therefore be strange to attach styling to such a generic container, even within a given context. We believe that tags like `<div>` and `<span>` should only have meaning (and thus receive corresponding style rules) when they have a class as an additional qualifier.

Installation
------------
Install this package as a development dependency using NPM:
```
npm install --save-dev stylelint-selector-tag-no-without-class
```

Usage
-----
Add the plugin and the corresponding rule to the stylelint configuration file, and configure the tags that should not be used as a selector without a qualifying classname:
```js
// .stylelintrc
{
  "plugins": [
    "stylelint-selector-tag-no-without-class"
  ],
  "rules": {
    "plugin/selector-tag-no-without-class": ["div", "span"]
  }
}
```

Primary option
--------------
`array|string`: `["array", "of", "tags", "or", "/regexes/"]|"tag"|"/regex/"`

Specification of tags that should not occur without a class qualifier. If a string is surrounded with `"/"`, it is interpreted as a regular expression. For example, `"^/h\d+$/"` disallows using any section heading without a class qualifier.

Versioning
----------
This project adheres to [Semantic Versioning](http://semver.org/). A list of notable changes for each release can be found in the [changelog](CHANGELOG.md).

License
-------
This plugin is released under the MIT license.
