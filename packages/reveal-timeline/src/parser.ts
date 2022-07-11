import { parseDate } from './date';
import { defaultOptions } from './options';
import { uniqueId } from './unique-id';
import _ from 'underscore';

export function headline(slide: Element, separator: string) {
  const attr = slide.getAttribute('data-timeline-headline');
  if (attr) {
    return {
      headline: attr
    };
  }

  const headings = Array.from(slide.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length) {
    return {
      headline: headings.map(_.property('textContent')).join(separator)
    };
  }
}

function call<T, U>(arg: T | null, func: (_: T) => U): U | undefined {
  return arg ? func(arg) : undefined;
}

export function slideData(deck: RevealStatic, slide: Element, options: RevealTimelineOptions = defaultOptions): ITimelineSlideData {
  return {
    start_date: call(slide.getAttribute('data-timeline-start-date'), parseDate),
    end_date: call(slide.getAttribute('data-timeline-end-date'), parseDate),
    text: headline(slide, options.separator!),
    group: slide.getAttribute('data-timeline-group') ?? undefined,
    display_date: slide.getAttribute('data-timeline-display-date') ?? undefined,
    autolink: call(slide.getAttribute('data-timeline-autolink'), _ => _.toLowerCase() === 'true'),
    unique_id: uniqueId(deck, slide)
  };
}

export function sortByDate(array: ITimelineSlideData[]) {
  const toDate = (data: ITimelineSlideData) => {
    const startDate = data.start_date;
    return startDate &&
      new Date(
        startDate.year,
        startDate.month ?? 0,
        startDate.day ?? 0,
        startDate.hour ?? 0,
        startDate.minute ?? 0,
        startDate.second ?? 0,
        startDate.millisecond ?? 0
      );
  }
  return _.sortBy(array, toDate);
}
