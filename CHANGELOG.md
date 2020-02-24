# Changelog

## [2.0.3] - 2020-02-24

### Added
- This plugin now declares compatibility with Stylelint version 12 & 13.

## [2.0.2] - 2019-09-23

### Added
- This plugin now declares compatibility with Stylelint version 11. Thanks
  to [Evgeny Orekhov](https://github.com/EvgenyOrekhov) for opening the
  [issue](https://github.com/Moxio/stylelint-selector-tag-no-without-class/issues/3).

## [2.0.1] - 2019-07-24

### Added
- This plugin now declares compatibility with Stylelint version 10. Thanks
  to [Andrew Lisowski](https://github.com/hipstersmoothie) for the
  [patch](https://github.com/Moxio/stylelint-selector-tag-no-without-class/pull/2).

## [2.0.0] - 2018-03-12

### Changed
- The primary configuration option is now the list of tags that should not
  occur without a class qualifier. The secondary configuration option has
  been dropped. The primary configuration option can also be a string (if
  the rule applies to a single tag), and also supports regular expressions.

  Before:
  ```js
  "plugin/stylelint-selector-tag-no-without-class": [ true, {
    "tags": ["div", "span"]
  } ]
  ```
  After:
  ```js
  "plugin/stylelint-selector-tag-no-without-class": ["div", "span"]
  ```
  This brings the configuration in line with Stylelint's `*-blacklist` plugins.
  Thanks to [Aleks Hudochenkov](https://github.com/hudochenkov) for the [suggestion](https://github.com/stylelint/stylelint/pull/3201#issuecomment-371052094).

## [1.0.0] - 2018-03-07

Initial public release.