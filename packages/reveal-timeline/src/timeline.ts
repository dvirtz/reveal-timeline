import { Timeline } from "@knight-lab/timelinejs";

function parseDate(date: string): ITimelineDate {
  const ISO_DATE_PATTERN = /^(\d{4})(?:(?:-(\d+))(?:-(\d+))?)?(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;
  const found = date.match(ISO_DATE_PATTERN);
  if (!found) {
    throw new Error(`invalid date ${date}`);
  }

  const [_, year, month, day, hour, minutes, seconds, milliseconds] = [...found].map(_ => Number(_) || undefined);

  return {
    year: year!,
    month: month,
    day: day,
    hour: hour,
    minute: minutes,
    second: seconds,
    millisecond: milliseconds
  };
}

function sortByDate(array: ITimelineSlideData[]) {
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
  return array.sort(function (a, b) {
    const dateA = toDate(a), dateB = toDate(b);
    if (dateA) {
      if (dateB) {
        if (dateA < dateB) return -1;
        if (dateB < dateA) return 1;
        return 0;
      }
      return 1;
    }
    if (dateB) {
      return -1;
    }
    return 0;
  });
}

function slideText(slide: Element, separator: string) {
  for (const attr of ['data-timeline-headline'])
    if (slide.hasAttribute(attr)) {
      return {
        headline: slide.getAttribute(attr)!
      };
    }

  const headings = Array.from(slide.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length) {
    return {
      headline: headings.map(_ => _.textContent).join(separator)
    };
  }
}

function call<T, U>(arg: T | null, func: (_: T) => U) {
  return arg ? func(arg) : undefined;
}

function uniqueId(deck: RevealStatic, slide: Element | undefined) {
  const { h, v } = deck.getIndices(slide);
  return `slide_${h}` + (v ? `_${v}` : '');
}

function indices(unique_id: string) {
  const parts = unique_id.split('_');
  return {
    h: Number(parts[1]),
    v: parts.length > 2 ? Number(parts[2]) : undefined
  };
}

export function slideData(deck: RevealStatic, slide: Element, options: RevealTimelineOptions = defaultOptions): ITimelineSlideData {
  return {
    start_date: call(slide.getAttribute('data-timeline-start-date'), parseDate),
    end_date: call(slide.getAttribute('data-timeline-end-date'), parseDate),
    text: slideText(slide, options.separator!),
    group: slide.getAttribute('data-timeline-group') ?? undefined,
    display_date: slide.getAttribute('data-timeline-display-date') ?? undefined,
    autolink: call(slide.getAttribute('data-timeline-autolink'), _ => _.toLowerCase() === 'true'),
    unique_id: uniqueId(deck, slide)
  };
}

interface RevealTimelineOptions {
  height?: string | number;
  position?: 'top' | 'bottom';
  separator?: string
}

const defaultOptions: RevealTimelineOptions = {
  height: '140px',
  position: 'bottom',
  separator: '<br><br>'
};

interface ExtendedRevealOptions extends RevealOptions {
  timeline: RevealTimelineOptions;
}

function hasTimeline(slide: Element) {
  return slide.hasAttribute('data-timeline-start-date');
}

function isFirstSlide(deck: RevealStatic, slide: Element) {
  return deck.getIndices(slide) === { h: 0, v: 0 };
}

function init(deck: RevealStatic) {
  const options = Object.assign(defaultOptions, (deck.getConfig() as ExtendedRevealOptions).timeline ?? {});
  let duringSlideChange = true;
  deck.on('ready', _ => {
    const slides = deck.getSlides().filter(_ => hasTimeline(_));
    if (!slides.length) {
      console.warn('no slides with "data-timeline-start-date" attribute, disabling');
      return;
    }
    const events = slides.map(_ => slideData(deck, _, options));
    const sortedEvents = sortByDate(Array.from(events));
    const title = isFirstSlide(deck, slides[0]) ? undefined : deck.getSlide(0);
    const nearestSlide = (slide: Element) => {
      const allSlides = deck.getSlides();
      for (let i = allSlides.indexOf(slide); i >= 0; i--) {
        if (hasTimeline(allSlides[i])) {
          return allSlides[i];
        }
      }
      return title;
    }
    function slideIndex(slide: Element) {
      if (slide == title) {
        return 0;
      }
      const index = sortedEvents.findIndex(e => e.unique_id === uniqueId(deck, deck.getCurrentSlide()));
      return title ? index + 1 : index;
    }
    const timelineOptions: ITimelineOptions = {
      timenav_height_percentage: 100,
      timenav_height_min: 0,
      marker_padding: 0,
      start_at_slide: slideIndex(deck.getCurrentSlide()),
      timenav_position: 'top'
    };
    const progress = deck.getRevealElement().querySelector('.progress') as HTMLDivElement;
    const timelineElement = document.createElement('div');
    const timeline: Timeline = new Timeline(timelineElement, { events, title: title && slideData(deck, title) }, timelineOptions);
    progress?.parentNode?.insertBefore(timelineElement, progress.nextSibling);
    if (options.position == 'bottom') {
      timelineElement.style.position = 'absolute';
      timelineElement.style.bottom = `${progress.offsetHeight}px`;
    }
    if (options.height) {
      timelineElement.style.height = typeof options.height == 'number' ? `${options.height}px` : options.height;
      deck.configure({margin: (timelineElement.offsetHeight / deck.getComputedSlideSize().presentationHeight) * 2});
    }
    timelineElement.style.visibility = deck.getCurrentSlide()?.hasAttribute('data-timeline-hide') ? 'hidden' : 'visible';
    deck.on('slidechanged', (event: SlideEvent) => {
      duringSlideChange = true;

      timeline.goToId(uniqueId(deck, nearestSlide(event.currentSlide)));

      timelineElement.style.visibility = event.currentSlide.hasAttribute('data-timeline-hide') ? 'hidden' : 'visible';
      
      duringSlideChange = false;
    });
    timeline.on('change', event => {
      // if got here as a result of the previous handler, stop
      if (duringSlideChange) {
        duringSlideChange = false;
        return;
      }
      const { h, v } = indices(event.unique_id);
      deck.slide(h, v);
    });
  });
}

export default () => {
  return {
    id: 'timeline',
    init: init
  };
};
