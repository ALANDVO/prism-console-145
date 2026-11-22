/**
 * Test suite for array_unique() SORT_REGULAR bug fix
 * 
 * Tests the corrected implementation that handles mixed numeric/non-numeric strings.
 */

// PHP SORT constants (values from PHP)
const SORT_REGULAR = 1;
const SORT_STRING = 2;
const SORT_NUMERIC = 3;
const SORT_NATURAL = 4;
const SORT_LOCALE = 8;

// Import the fix
const array_unique_fix = require('../app/array_unique_fix.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  PASS: ${name}`);
        passed++;
    } catch (e) {
        console.log(`  FAIL: ${name} - ${e.message}`);
        failed++;
    }
}

function assertEqual(actual, expected, msg) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) {
        throw new Error(`${msg || ''} Expected ${e} but got ${a}`);
    }
}

function assertInclude(array, value, msg) {
    if (!array.includes(value)) {
        throw new Error(`${msg || ''} Expected array to include ${value}`);
    }
}

console.log('=== array_unique() SORT_REGULAR Bug Fix Tests ===\n');

// Test 1: Basic bug report case
test('Bug report case: [5, 10, 5, 3A, 5, 5] with SORT_REGULAR should return [5, 10, 3A]', () => {
    const $units = ['5', '10', '5', '3A', '5', '5'];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, ['5', '10', '3A'], 'Should return [5, 10, 3A] without duplicate 5');
});

// Test 2: Mixed numeric/non-numeric different order
test('Mixed strings different order: [10, 2, 10, a] with SORT_REGULAR should return [10, 2, a]', () => {
    const $units = ['10', '2', '10', 'a'];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, ['10', '2', 'a'], 'Should return [10, 2, a] without duplicate 10');
});

// Test 3: All same numeric strings
test('All same numeric strings: [5, 5, 5, 5] with SORT_REGULAR should return [5]', () => {
    const $units = ['5', '5', '5', '5'];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, ['5'], 'Should return [5]');
});

// Test 4: All different strings
test('All different strings: [a, b, c] with SORT_REGULAR should return [a, b, c]', () => {
    const $units = ['a', 'b', 'c'];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, ['a', 'b', 'c'], 'Should return [a, b, c]');
});

// Test 5: SORT_STRING should still work correctly
test('SORT_STRING mode: [5, 10, 5, 3A, 5, 5] should return [5, 10, 3A]', () => {
    const $units = ['5', '10', '5', '3A', '5', '5'];
    const $unique = array_unique_fix($units, SORT_STRING);
    assertEqual($unique, ['5', '10', '3A'], 'SORT_STRING should return [5, 10, 3A]');
});

// Test 6: SORT_NATURAL mode
test('SORT_NATURAL mode: [5, 10, 5, 3A, 5, 5] should handle natural sort', () => {
    const $units = ['5', '10', '5', '3A', '5', '5'];
    const $unique = array_unique_fix($units, SORT_NATURAL);
    // SORT_NATURAL should group '5' together and '3A' should come before '5' lexically
    assertInclude($unique, '5', 'Should include 5');
    assertInclude($unique, '10', 'Should include 10');
    assertInclude($unique, '3A', 'Should include 3A');
});

// Test 7: Empty array
test('Empty array with SORT_REGULAR should return empty array', () => {
    const $units = [];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, [], 'Empty array should return empty array');
});

// Test 8: Single element
test('Single element array with SORT_REGULAR should return same element', () => {
    const $units = ['only'];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, ['only'], 'Single element should be preserved');
});

// Test 9: Numeric integers (not strings)
test('Numeric integers: [1, 2, 1, 3] with SORT_REGULAR should return [1, 2, 3]', () => {
    const $units = [1, 2, 1, 3];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, [1, 2, 3], 'Numeric integers should work');
});

// Test 10: String duplicates only
test('String duplicates only: ["a", "b", "a", "c"] with SORT_REGULAR should return ["a", "b", "c"]', () => {
    const $units = ['a', 'b', 'a', 'c'];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertEqual($unique, ['a', 'b', 'c'], 'String duplicates should be removed');
});

// Test 11: Numeric string uniqueness - '01' vs '1'
test('Numeric string uniqueness: ["01", "1", "02"] with SORT_REGULAR should keep both "01" and "1"', () => {
    // With lexical comparison, "01" and "1" are different strings
    const $units = ['01', '1', '02'];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    assertInclude($unique, '01', 'Should include "01"');
    assertInclude($unique, '1', 'Should include "1"');
    assertInclude($unique, '02', 'Should include "02"');
});

// Test 12: Real-world scenario
test('Real-world scenario: [5, 10, 5, 3A, 5, 5] with SORT_REGULAR should return 3 unique values', () => {
    const $units = [5, 10, 5, '3A', 5, 5];
    const $unique = array_unique_fix($units, SORT_REGULAR);
    // Should have exactly 3 unique values: 5, 10, 3A
    assertEqual($unique.length, 3, 'Should have 3 unique values');
    assertInclude($unique, 5, 'Should include 5');
    assertInclude($unique, 10, 'Should include 10');
    assertInclude($unique, '3A', 'Should include 3A');
});

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
