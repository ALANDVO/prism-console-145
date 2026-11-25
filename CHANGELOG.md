# Changelog

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.0.1 — array_unique() SORT_REGULAR bug fix

- Fixed `array_unique()` with `SORT_REGULAR` to correctly handle mixed numeric/non-numeric strings
- Implementation uses pure lexical comparison to avoid non-transitive comparison bug in `zendi_smart_strcmp()`
- All 12 tests pass covering bug report case, mixed orders, edge cases, and other SORT_MODEs

## 1.0.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

---

Alan Vo · [alanvo.net](https://alanvo.net) · [X: @alanvoasi](https://x.com/alanvoasi)
