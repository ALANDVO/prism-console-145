# prism-console-145

Current version: `1.0.0`.

> Work in progress. This checkpoint may be incomplete or fail tests. See PLAN.md and STATUS.md before use.


The PHP Interpreter - A PHP code analysis and execution tool.

## Purpose
Provides corrected implementations of PHP functions with known bugs, plus useful analysis tools for PHP developers.

## Current Feature: array_unique() SORT_REGULAR Bug Fix

### Problem Fixed
`array_unique()` with `SORT_REGULAR` flag produces incorrect results when the array contains a mix of numeric and non-numeric strings. The bug occurs because the comparison function has non-transitive behavior:

- `"5" < "10"` → true (numeric: 5 < 10)
- `"10" < "3A"` → true (lexicographic: "1" < "3")
- `"3A" < "5"` → true (lexicographic: "3" < "5") — creates a cycle!

This breaks sorting algorithms that require transitive comparisons, causing the adjacent-element deduplication to miss duplicates.

### Fix
The implementation uses pure lexical comparison (no numeric extraction) for sorting, then removes duplicates while preserving first-occurrence order in the original array.

### Usage
```javascript
const { array_unique_fix } = require('./app/array_unique_fix');

// Fix the SORT_REGULAR bug
const $units = ['5', '10', '5', '3A', '5', '5'];
const $unique = array_unique_fix($units, 1 /* SORT_REGULAR */);
// Returns: ['5', '10', '3A'] — correct, no duplicates

// Or with SORT_STRING (also works)
const $unique2 = array_unique_fix($units, 2 /* SORT_STRING */);
// Returns: ['5', '10', '3A']
```

### Test Results
All 12 tests pass, covering:
- Bug report case: `['5', '10', '5', '3A', '5', '5']` → `[5, 10, 3A]`
- Mixed string orders
- Edge cases (empty, single element)
- Mixed numeric/string types
- Other SORT_MODEs (SORT_STRING, SORT_NATURAL)

## Installation

```bash
npm install
npm test
```

## References
- Issue #20262: "array_unique() with SORT_REGULAR returns duplicate values"
- PHP bug: Non-transitive comparison in zendi_smart_strcmp()
- Reported: duplicates not caught when mixing numeric and non-numeric strings

## Contact
- Website: https://alanvo.net
- X: https://x.com/alanvoasi

Maintainer: Alan Vo <alanvo@gmail.com>
