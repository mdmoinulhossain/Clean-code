# WP CSS Standards:

1. Structure
	i. Use tabs, not spaces, to indent each property.
	ii. Add two blank lines between sections and one blank line between blocks in a section.
	iii. Each selector should be on its own line, ending in either a comma or an opening curly brace. Property-value pairs should be on their own line, with one tab of indentation and an ending semicolon. The closing brace should be flush left, using the same level of indentation as the opening selector.
	
	Ex.: 
```
#selector-1,
#selector-2,
#selector-3 {
    background: #fff;
    color: #000;
}
```

2. Selectors

	i. use lowercase and separate words with hyphens when naming selectors. Avoid camelcase and underscores.
	ii. Use human readable selectors that describe what element(s) they style.
	iii. Attribute selectors should use double quotes around values.
	
    Ex.:
```
input[type="text"] {
    line-height: 1.1;
}
```
	iv. Refrain from using over-qualified selectors, div.container can simply be stated as .container

3. Properties

	i. Properties should be followed by a colon and a space.
	ii. All properties and values should be lowercase, except for font names and vendor-specific properties.
	iii. Use hex code for colors, or rgba() if opacity is needed. Avoid RGB format and uppercase, and shorten values when possible: #fff instead of #FFFFFF.
	iv. Use shorthand, except when overriding styles, for background, border, font, list-style, margin, and padding values as much as possible.
	
	
4. Property Ordering

	The baseline for ordering is:
	
	* Display
	* Positioning
	* Box model
	* Colors and Typography
	* Other
	

5. Vendor Prefixes/browser compatibility
	(Must Use)

* https://github.com/postcss/autoprefixer

6. Values(Property values)

	i. Space before the value, after the colon.
	ii. Do not pad parentheses with spaces.
	iii. Always end in a semicolon.
	iv. Use double quotes rather than single quotes, and only when needed, such as when a font name has a space or for the values of the content property.
	v. Font weights should be defined using numeric values (e.g. 400 instead of normal, 700 rather than bold).
	vi. 0 values should not have units unless necessary, such as with transition-duration.
	vii. Use a leading zero for decimal values, including in rgba().
	viii. Lists of values within a value, like within rgba(), should be separated by a space.
	ix. Multiple comma-separated values for one property should be separated by either a space or a newline. For better readability newlines should be used for lengthier multi-part values such as those for shorthand properties like box-shadow and text-shadow, including before the first value. Values should then be indented one level in from the property.
	x. Line height should also be unit-less, unless necessary to be defined as a specific pixel value.
	
	Ex.
	
	Correct:
```
.class { /* Correct usage of quotes */
	background-image: url(images/bg.png);
	font-family: "Helvetica Neue", sans-serif;
	font-weight: 700;
}

.class { /* Correct usage of zero values */
    font-family: Georgia, serif;
    line-height: 1.4;
    text-shadow:
        0 -1px 0 rgba(0, 0, 0, 0.5),
        0 1px 0 #fff;
}

.class { /* Correct usage of short and lengthier multi-part values */
    font-family: Consolas, Monaco, monospace;
    transition-property: opacity, background, color;
    box-shadow:
        0 0 0 1px #5b9dd9,
        0 0 2px 1px rgba(30, 140, 190, 0.8);
}

```
incorrect:
```
.class { /* Avoid missing space and semicolon */
    background:#fff
}

.class { /* Avoid adding a unit on a zero value */
    margin: 0px 0px 20px 0px;
}

.class {
    font-family: Times New Roman, serif; /* Quote font names when required */
    font-weight: bold; /* Avoid named font weights */
    line-height: 1.4em; /* Avoid adding a unit for line height */
}

.class { /* Incorrect usage of multi-part values */
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5),
                 0 1px 0 #fff;
    box-shadow: 0 1px 0 rgba(0, 0,
        0, 0.5),
        0 1px 0 rgba(0,0,0,0.5);
}
```
	
	
	
	
7. Media Queries
	
	i. It is generally advisable to keep media queries grouped by media at the bottom of the stylesheet.

8. Commenting
	
	i. Comment, and comment liberally. If there are concerns about file size, utilize minified files and the SCRIPT_DEBUG constant. Long comments should manually break the line length at 80 characters.
	
For sections and subsections:
```
/**
 * #.# Section title
 *
 * Description of section, whether or not it has media queries, etc.
 */

.selector {
    float: left;
}
```
For inline:
```
/* This is a comment about this selector */
.another-selector {
    position: absolute;
    top: 0 !important; /* I should explain why this is so !important */
}
```