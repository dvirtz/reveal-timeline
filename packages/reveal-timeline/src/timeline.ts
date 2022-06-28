import { Timeline } from "@knight-lab/timelinejs";

function parseDate(date: string): ITimelineDate {
  const ISO_DATE_PATTERN = /^(\d{4})(?:(?:-(\d+))(?:-(\d+))?)?(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;
  const found = date.match(ISO_DATE_PATTERN);
  if (!found) {
    throw new Error(`invalid date ${date}`);
  }

  const [_, year, month, day, hour, minutes, seconds, milliseconds] = [...found];

  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minutes,
    second: seconds,
    millisecond: milliseconds
  };
}

function slideText(slide: Element, separator: string): ITimelineText | undefined {
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

function call<T, U>(arg: T | null, func: (_: T) => U): U | undefined {
  return arg ? func(arg) : undefined;
}

export function slideData(slide: Element, options: RevealTimelineOptions = defaultOptions): ITimelineSlideData {
  return {
    start_date: call(slide.getAttribute('data-timeline-start-date'), parseDate),
    end_date: call(slide.getAttribute('data-timeline-end-date'), parseDate),
    text: slideText(slide, options.separator!),
    group: slide.getAttribute('data-timeline-group') ?? undefined,
    display_date: slide.getAttribute('data-timeline-display-date') ?? undefined,
    autolink: call(slide.getAttribute('data-timeline-autolink'), _ => _.toLowerCase() === 'true'),
    unique_id: slide.id || undefined
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

function init(deck: RevealStatic) {
  const options = Object.assign(defaultOptions, (deck.getConfig() as ExtendedRevealOptions).timeline ?? {});
  deck.on('ready', _ => {
    const slides = deck.getSlides().filter(_ => _.hasAttribute('data-timeline-start-date'));
    if (!slides.length) {
      console.warn('no slides with "data-timeline-start-date" attribute, disabling');
      return;
    }
    const timelineIndexToSlideIndices = new Map(Array.from(slides.entries()).map(([index, slide]) => [index, deck.getIndices(slide)]));
    const timelineConfig: ITimelineConfig = {
      events: slides.map(_ => slideData(_, options)),
      title: slides.includes(deck.getSlides()[0]) ? undefined : slideData(deck.getSlides()[0], options)
    };
    const slideIndex = (slide: Element) => {
      const index = slides.indexOf(slide);
      if (index < 0) {
        return;
      }
      return timelineConfig.title ? index + 1 : index;
    }
    const timelineOptions: ITimelineOptions = {
      timenav_height_percentage: 100,
      timenav_height_min: 0,
      marker_padding: 0,
      start_at_slide: slideIndex(deck.getCurrentSlide()) ?? 0,
      timenav_position: 'top'
    };
    // this needs to be before instantiating timeline
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.stopImmediatePropagation();
      }
    });
    const timelineElement = document.createElement('div');
    const timeline: Timeline = new Timeline(timelineElement, timelineConfig, timelineOptions);
    document.body.insertAdjacentElement(options.position === 'top' ? 'afterbegin' : 'beforeend', timelineElement);
    if (options.height) {
      timelineElement.style.height = typeof options.height == 'number' ? `${options.height}px` : options.height;
      timelineElement.parentElement!.style.height = `${window.visualViewport.height - timelineElement.offsetHeight}px`;
    }
    const goTo = (slide: Element) => {
      const index = slideIndex(slide);
      if (index) {
        timeline.goTo(index);
      }
    };
    timeline.on('loaded', _ => {
      goTo(deck.getCurrentSlide());
    });
    deck.on('slidechanged', (event: SlideEvent) => {
      goTo(event.currentSlide);
    });
    timeline.on('change', event => {
      const data = timeline.getDataById(event.unique_id);
      if (data === timelineConfig.title) {
        deck.slide(0);
      }
      else {
        const timelineIndex = timelineConfig.events.indexOf(data);
        const { h, v } = timelineIndexToSlideIndices.get(timelineIndex)!;
        deck.slide(h, v);
      }
    });
  });
}

export default () => {
  return {
    id: 'timeline',
    init: init
  };
};
