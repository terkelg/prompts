'use strict';

const test = require('tape');
const { entriesToDisplay } = require('../lib/util');

test('entriesToDisplay', t => {
  t.plan(11);
  t.deepEqual(entriesToDisplay(0, 8, 5), { startIndex: 0, endIndex: 5 }, 'top of list');
  t.deepEqual(entriesToDisplay(1, 8, 5), { startIndex: 0, endIndex: 5 }, '+1 from top');
  t.deepEqual(entriesToDisplay(2, 8, 5), { startIndex: 0, endIndex: 5 }, '+2 from top');
  t.deepEqual(entriesToDisplay(3, 8, 5), { startIndex: 1, endIndex: 6 }, '+3 from top');
  t.deepEqual(entriesToDisplay(4, 8, 5), { startIndex: 2, endIndex: 7 }, '-3 from bottom');
  t.deepEqual(entriesToDisplay(5, 8, 5), { startIndex: 3, endIndex: 8 }, '-2 from bottom');
  t.deepEqual(entriesToDisplay(6, 8, 5), { startIndex: 3, endIndex: 8 }, '-1 from bottom');
  t.deepEqual(entriesToDisplay(7, 8, 5), { startIndex: 3, endIndex: 8 }, 'bottom of list');

  t.deepEqual(entriesToDisplay(0, 10, 11), { startIndex: 0, endIndex: 10 }, 'top of list when maxVisible greater than total');
  t.deepEqual(entriesToDisplay(9, 10, 11), { startIndex: 0, endIndex: 10 }, 'bottom of list maxVisible greater than total');

  t.deepEqual(entriesToDisplay(0, 10), { startIndex: 0, endIndex:10 }, 'maxVisible is optional');
});
