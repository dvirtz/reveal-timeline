import { Timeline } from "@knight-lab/timelinejs";

function parseDate(dateString: string | null): ITimelineDate | undefined {
  if (!dateString) {
    return;
  }

  const date = new Date(dateString);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDay(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds()
  };
}

function slideText(slide: Element, options: RevealTimelineOptions): ITimelineText | undefined {
  for (const attr of ['data-timeline-headline', 'data-timeline-text'])
  if (slide.hasAttribute(attr)) {
    return {
      headline: slide.getAttribute(attr)!
    };
  }

  const headings = Array.from(slide.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings) {
    return {
      headline: headings.map(_ => _.textContent).join(options.separator)
    };
  }
}

function slideData(slide: Element, options: RevealTimelineOptions): ITimelineSlideData {
  return {
    start_date: parseDate(slide.getAttribute('data-timeline-start-date')),
    end_date: parseDate(slide.getAttribute('data-timeline-end-date')),
    text: slideText(slide, options),
    group: slide.getAttribute('data-timeline-group') ?? undefined,
    display_date: slide.getAttribute('data-timeline-display-date') ?? undefined,
    autolink: slide.hasAttribute('data-timeline-autolink') ? slide.getAttribute('data-timeline-autolink')?.toLowerCase() === 'true' : undefined,
    unique_id: slide.id || undefined
  };
}

interface RevealTimelineOptions {
  height?: string | number;
  position?: 'top' | 'bottom';
  separator?: string
}

interface ExtendedRevealOptions extends RevealOptions {
  timeline: RevealTimelineOptions;
}

function init(deck: RevealStatic) {
  const defaultOptions: RevealTimelineOptions = {
    height: '140px',
    position: 'bottom',
    separator: '<br><br>'
  };
  const options = Object.assign(defaultOptions, (deck.getConfig() as ExtendedRevealOptions).timeline ?? {});
  const timelineElement = document.body.insertAdjacentElement(options.position === 'top' ? 'afterbegin' : 'beforeend', document.createElement('div')) as HTMLElement;
  if (options.height) {
    timelineElement.style.height = typeof options.height == 'number' ? `${options.height}px` : options.height;
    timelineElement.parentElement!.style.height = `${window.visualViewport.height - timelineElement.offsetHeight}px`;
  }
  deck.on('ready', _ => {
    const slides = deck.getSlides().filter(_ => _.hasAttribute('data-timeline-start-date'));
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
    const timeline: Timeline = new Timeline(timelineElement, timelineConfig, timelineOptions);
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
