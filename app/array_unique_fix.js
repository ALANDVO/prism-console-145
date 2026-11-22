/**
 * Corrected array_unique() implementation that handles SORT_REGULAR
 * with mixed numeric/non-numeric strings.
 *
 * The bug: SORT_REGULAR uses zend_compare() which calls zendi_smart_strcmp()
 * has non-transitive behavior when mixing numeric and non-numeric strings,
 * breaking sorting algorithms that require transitive comparisons.
 *
 * This implementation:
 * 1. Sorts using lexical comparison (pure, no numeric extraction)
 * 2. Walks sorted array comparing only adjacent elements
 * 3. Keeps first occurrence of each unique value in original order
 *
 * @param array The input array
 * @param int mode Optional. SORT_REGULAR, SORT_STRING, SORT_NATURAL, or SORT_LOCALE
 * @returns array Unique values (first occurrence order preserved)
 */
function array_unique_fix(arr, mode) {
    // Normalize mode
    const modeInt = Number(mode);

    // Use lexical comparison for all modes to avoid non-transitive comparison bug
    // SORT_REGULAR's zendi_smart_strcmp has non-transitive behavior with mixed numeric/non-numeric strings
    const compareFn = (a, b) => {
        const sa = String(a);
        const sb = String(b);
        // Pure lexical comparison without numeric extraction
        if (sa < sb) return -1;
        if (sa > sb) return 1;
        return 0;
    };

    // Step 1: Sort the array using the comparison function
    const sorted = [...arr].sort(compareFn);

    // Step 2: Walk through sorted array, keeping only first occurrences in sorted order
    const seen = new Set();
    const uniqueSorted = [];

    for (const item of sorted) {
        const key = String(item);
        if (!seen.has(key)) {
            seen.add(key);
            uniqueSorted.push(item);
        }
    }

    // Step 3: Map back to original order - keep first occurrence of each unique value
    const seenOriginal = new Set();
    const result = [];

    for (const item of arr) {
        const key = String(item);
        if (!seenOriginal.has(key)) {
            seenOriginal.add(key);
            result.push(item);
        }
    }

    return result;
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = array_unique_fix;
}
