import * as plugin from '../src/timeline';

function createElementFromHTML(htmlString: string) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstElementChild as HTMLElement;
}


describe('timeline', function () {

  test.each([
    ['data-timeline-start-date="1984"', { start_date: { year: '1984' } }],
    ['data-timeline-start-date="2016-09-05T15:22:26.286Z" data-timeline-end-date="2016-09-05T15:23:26.286Z"', {
      start_date: { year: '2016', month: '09', day: '05', hour: '15', minute: '22', second: '26', millisecond: '286' },
      end_date: { year: '2016', month: '09', day: '05', hour: '15', minute: '23', second: '26', millisecond: '286' }
    }],
    ['data-timeline-start-date="1984" data-timeline-headline="head"', { start_date: { year: '1984' }, text: { headline: 'head' } }],
    [
      [
        'id=unique_id',
        'data-timeline-start-date="1984"',
        'data-timeline-group="group"',
        'data-timeline-display-date="Nineteen eighty four"',
        'data-timeline-autolink="false"'
      ].join(' '),
      {
        unique_id: 'unique_id',
        start_date: { year: '1984' },
        group: 'group',
        display_date: 'Nineteen eighty four',
        autolink: false
      }
    ],
  ])('slideData', function (attributes, expected) {
    const element = createElementFromHTML(`<section ${attributes}></section>`);
    const slideData = plugin.slideData(element);
    expect(slideData).toEqual(expected);
  });
});
