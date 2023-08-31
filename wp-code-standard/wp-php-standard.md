# PHP Standard

1. Opening and Closing PHP Tags Must
2. No Shorthand PHP Tags.
incorrect:
```
<? ... ?>
<?= esc_html( $var ) ?>
```

3. Single and Double Quotes

```
echo '<a href="/static/link" class="button button-primary">Link name</a>';
echo "<a href='{$escaped_link}'>text with a ' single quote</a>";
```

4. Writing include/require statements
* It is strongly recommended to use require[_once] for unconditional includes. When using include[_once], PHP will throw a warning when the file is not found but will continue execution, which will almost certainly lead to other errors/warnings/notices being thrown if your application depends on the file loaded, potentially leading to security leaks. For that reason, require[_once] is generally the better choice as it will throw a Fatal Error if the file cannot be found.
Correct:
```
require_once ABSPATH . 'file-name.php';
```

incorrect:
```
include_once  ( ABSPATH . 'file-name.php' );
require_once     __DIR__ . '/file-name.php';
```

5. Naming Conventions

* Use lowercase letters in variable, action/filter, and function names (never camelCase). Separate words via underscores. Don’t abbreviate variable names unnecessarily; let the code be unambiguous and self-documenting.

```
function some_name( $some_variable ) {}
```

* For function parameter names, it is strongly recommended to avoid reserved keywords as names, as it leads to hard to read and confusing code when using the PHP 8.0 “named parameters in function calls” feature.
* Also keep in mind that renaming a function parameter should be considered a breaking change since PHP 8.0, so name function parameters with due care!
*Class, trait, interface and enum names should use capitalized words separated by underscores. Any acronyms should be all upper case.

```
class Walker_Category extends Walker {}
class WP_HTTP {}

interface Mailer_Interface {}
trait Forbid_Dynamic_Properties {}
enum Post_Status {}
```

* Constants should be in all upper-case with underscores separating words:
```
define( 'DOING_AJAX', true );
```

* Files should be named descriptively using lowercase letters. Hyphens should separate words.
```
my-plugin-name.php
```

* Class file names should be based on the class name with class- prepended and the underscores in the class name replaced with hyphens, for example, WP_Error becomes:
```
class-wp-error.php
```

* Files containing template tags in the wp-includes directory should have -template appended to the end of the name so that they are obvious.
```
general-template.php
```

