import { Timeline } from '@knight-lab/timelinejs';
import { slideData, sortByDate } from './parser';
import { defaultOptions } from './options';
import { indices, uniqueId } from './unique-id';
import _ from 'underscore';

function hasTimeline(slide: Element) {
  return slide.hasAttribute('data-timeline-start-date');
}

function isFirstSlide(deck: RevealStatic, slide: Element) {
  return slide == deck.getSlides()[0];
}

function init(deck: RevealStatic) {
  const config = (deck.getConfig() as ExtendedRevealOptions).timeline ?? {};
  const options = _.defaults(typeof config === 'string' ? JSON.parse(config) : config, defaultOptions);
  let duringSlideChange = true;
  deck.on('ready', () => {
    const slides = deck.getSlides().filter(hasTimeline);
    if (!slides.length) {
      console.warn('no slides with "data-timeline-start-date" attribute, disabling');
      return;
    }
    const events = slides.map(_.partial(slideData, deck, _, options));
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
    const REVEAL_ELEMENT_ID = '__reveal_timeline_element';
    document.getElementById(REVEAL_ELEMENT_ID)?.remove();
    const timelineElement = document.createElement('div');
    timelineElement.id = REVEAL_ELEMENT_ID;
    const timeline: Timeline = new Timeline(timelineElement, { events, title: title && slideData(deck, title) }, timelineOptions);
    deck.getRevealElement().append(timelineElement);
    if (options.position == 'bottom') {
      timelineElement.style.position = 'absolute';
      const progress = deck.getRevealElement().querySelector('.progress') as HTMLDivElement;
      timelineElement.style.bottom = `${progress.offsetHeight}px`;
    }
    if (options.height) {
      timelineElement.style.height = typeof options.height == 'number' ? `${options.height}px` : options.height;
      timeline.on('loaded', ev => {
        (timelineElement.querySelector('.tl-menubar') as HTMLElement).style.transform =
          `scale(${timelineElement.offsetHeight / (defaultOptions.height as number)})`
      });
      deck.configure({ margin: (timelineElement.offsetHeight / deck.getComputedSlideSize().height) * 2 });
    }
    timelineElement.style.visibility = deck.getCurrentSlide().hasAttribute('data-timeline-hide') ? 'hidden' : 'visible';
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
