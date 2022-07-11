import { headline, slideData, sortByDate } from '../src/parser';

function createElementFromHTML(htmlString: string) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstElementChild as HTMLElement;
}


describe('parser', function () {

  test.each([
    ['data-timeline-start-date="1984"', { h: 2 }, { start_date: { year: 1984 }, unique_id: 'slide_2' }],
    ['data-timeline-start-date="2016-09-05T15:22:26.286Z" data-timeline-end-date="2016-09-05T15:23:26.286Z"', { h: 0, v: 1 }, {
      start_date: { year: 2016, month: 9, day: 5, hour: 15, minute: 22, second: 26, millisecond: 286 },
      end_date: { year: 2016, month: 9, day: 5, hour: 15, minute: 23, second: 26, millisecond: 286 },
      unique_id: 'slide_0_1'
    }],
    ['data-timeline-start-date="1984" data-timeline-headline="head"', { h: 42 }, { start_date: { year: 1984 }, text: { headline: 'head' }, unique_id: 'slide_42' }],
    [
      [
        'id=unique_id',
        'data-timeline-start-date="1984"',
        'data-timeline-group="group"',
        'data-timeline-display-date="Nineteen eighty four"',
        'data-timeline-autolink="false"'
      ].join(' '),
      { h: 0 },
      {
        start_date: { year: 1984 },
        group: 'group',
        display_date: 'Nineteen eighty four',
        autolink: false,
        unique_id: 'slide_0'
      }
    ],
    ['', { h: 0 }, { unique_id: 'slide_0' }]
  ])('slideData %#', function (attributes, indices, expected) {
    const element = createElementFromHTML(`<section ${attributes}></section>`);
    const deck: unknown = {
      getIndices: jest.fn(() => indices)
    };
    expect(slideData(deck as RevealStatic, element)).toEqual(expected);
  });

  test.each([
    [createElementFromHTML(`<section data-timeline-headline="TEST"></section>`), '', { headline: "TEST" }],
    [createElementFromHTML(`<section></section>`), '', undefined],
    [createElementFromHTML(`<section><h1>HEADER</h1> <h3>SUBHEADER</h3></section>`), '\n', { headline: "HEADER\nSUBHEADER" }],
    [createElementFromHTML(`<section><h5>HEADER</h5> <h6>SUBHEADER</h6></section>`), '##', { headline: "HEADER##SUBHEADER" }],
  ])('headline', function (element, separator, expected) {
    expect(headline(element, separator)).toEqual(expected);
  });

  test.each([
    [[], []],
    [['1984-01'], ['1984-01']],
    [['1984-01', '1984-02'], ['1984-01', '1984-02']],
    [
      ['2016-09-05T15:22:26.286Z', '2016-09-04T15:22:26.286Z', '2016-09-05T15:22:26.286Z'],
      ['2016-09-04T15:22:26.286Z', '2016-09-05T15:22:26.286Z', '2016-09-05T15:22:26.286Z']
    ],
  ])('sortByDate %#', function (unsorted, sorted) {
    const deck: unknown = {
      getIndices: jest.fn(() => ({ h: 0 }))
    };
    const toSlideData = (dates: string[]) =>
      dates
        .map(date => slideData(deck as RevealStatic, createElementFromHTML(`<section data-timeline-start-date="${date}"></section>`)));
    expect(sortByDate(toSlideData(unsorted))).toStrictEqual(toSlideData(sorted));
  });

});
