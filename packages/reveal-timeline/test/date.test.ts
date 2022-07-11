import { parseDate } from "../src/date";

describe('date', function () {

  test.each([
    ['1984', { year: 1984 }],
    ['1984-01', { year: 1984, month: 1 }],
    ['1984-01-30', { year: 1984, month: 1, day: 30 }],
    ['1984-01-30T13:30', { year: 1984, month: 1, day: 30, hour: 13, minute: 30 }],
    ['1984-01-30T13:30:12', { year: 1984, month: 1, day: 30, hour: 13, minute: 30, second: 12 }],
    ['1984-01-30T13:30:12.987', { year: 1984, month: 1, day: 30, hour: 13, minute: 30, second: 12, millisecond: 987 }],
    ['1984-01-30T13:30:12.987Z', { year: 1984, month: 1, day: 30, hour: 13, minute: 30, second: 12, millisecond: 987 }],
    ['1984-01-30T13:30:12.987Z-', { year: 1984, month: 1, day: 30, hour: 13, minute: 30, second: 12, millisecond: 987 }],
    ['1984-01-30T13:30:12.987Z-2', { year: 1984, month: 1, day: 30, hour: 13, minute: 30, second: 12, millisecond: 987 }],
  ])('parseData %#', function (date, expected) {
    expect(parseDate(date)).toEqual(expected);
  });

  test.each([
    '',
    '-1',
    '19845',
    '1984-01-30T13',
    '1984-01-30T13:'
  ])('parseDate error %#', function (date) {
    expect(() => parseDate(date)).toThrow(`invalid date ${date}`);
  });

});