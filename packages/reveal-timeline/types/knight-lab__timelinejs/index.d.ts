declare module '@knight-lab/timelinejs';

declare class Timeline {
  constructor(containerId: HTMLElement | string, data: string | ITimelineConfig, options?: ITimelineOptions);

  goToId: (id: string | number) => void;
  goTo: (n: number) => void;
  goToStart: () => void;
  goToEnd: () => void;
  goToPrev: () => void;
  goToNext: () => void;

  add: (event: ITimelineSlideData) => void;
  remove: (n: number) => void;
  removeId: (id: string | number) => void;

  getData: (n: number) => ITimelineSlideData;
  getDataById: (id: string | number) => ITimelineSlideData;

  getSlide: (n: number) => ITimelineSlide;
  getSlideById: (id: string | number) => ITimelineSlide;
  getCurrentSlide: () => ITimelineSlide;

  updateDisplay: () => void;

  setConfig: (config: ITimelineConfig) => void;

  showMessage: (msg: string) => void;

  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (level: number) => void;

  current_id: string;

  on(event_name: 'back_to_start', handler: (data: ITimelineBackToStartEvent) => void): void;
  on(event_name: 'change' | 'color_change', handler: (data: ITimelineChangeEvent) => void): void;
  on(event_name: 'dataloaded', handler: (data: ITimelineDataLoadedEvent) => void): void;
  on(event_name: 'hash_updated', handler: (data: ITimelineHashUpdatedEvent) => void): void;
  on(event_name: 'loaded', handler: (data: ITimelineLoadedEvent) => void): void;
  on(event_name: 'zoom_in' | 'zoom_out', handler: (data: ITimelineZoomEvent) => void): void;
  on(event_name: 'added' | 'removed', handler: (data: ITimelineModifiedEvent) => void): void;
  on(event_name: 'nav_next' | 'nav_previous', handler: (data: ITimelineNavEvent) => void): void;
}

interface ITimelineSlide {
  data: ITimelineSlideData;
}

type Scale = 'human' | 'cosmological';

interface ITimelineConfig {
  events: ITimelineSlideData[];
  title?: ITimelineSlideData | undefined;
  eras?: ITimelineEra[] | undefined;
  /*
   * Either human or cosmological. If no scale is specified, the default is human. The cosmological scale is
   * required to handle dates in the very distant past or future. (Before Tuesday, April 20th, 271,821 BCE
   * after Saturday, September 13 275,760 CE) For the cosmological scale, only the year is considered, but it's
   * OK to have a cosmological timeline with years between 271,821 BCE and 275,760 CE.
   */
  scale?: Scale | undefined;
}

interface ITimelineSlideData {
  /*
   * Required for events, but not for `title` slides.
   */
  start_date?: ITimelineDate | undefined;
  end_date?: ITimelineDate | undefined;
  /*
   * Not required, but recommended.
   */
  text?: ITimelineText | undefined;
  media?: ITimelineMedia | undefined;
  /*
   * If present, Timeline will organize events with the same value for group to be in the same row or adjacent
   * rows, separate from events in other groups. The common value for the group will be shown as a label at the
   * left edge of the navigation.
   */
  group?: string | undefined;
  /*
   * A string which will be used when Timeline displays the date for this. If used, override's display_date
   * values set on the start or end date for this event, which is useful if you want to control how the two
   * dates relate to each other.
   */
  display_date?: string | undefined;
  /*
   * A Javascript object. The object can have these properties:
   * url: the fully-qualified URL pointing to an image which will be used as the background
   * color: a CSS color, in hexadecimal (e.g. #0f9bd1) or a valid CSS color keyword.
   */
  background?: { url?: string | undefined, color?: string | undefined } | undefined;
  /*
   * Defaults to true, which means that Timeline will scan text fields and automatically add <a> tags so that
   * links and email addresses are "clickable." If set to false, you may still manually apply the tags in the
   * appropriate fields when you want links. Autolinking applies to the text field in a text object and the
   * caption and credit fields in a media object.
   */
  autolink?: boolean | undefined;
  /*
   * A string value which is unique among all slides in your timeline. If not specified, TimelineJS will
   * construct an ID based on the headline, but if you later edit your headline, the ID will change. Unique IDs
   * are used when the hash_bookmark option is used, and can also be used with the timeline.goToId() method to
   * programmatically move the timeline to a specific slide.
   */
  unique_id?: string | undefined;
}

/*
* Era objects are JSON objects which are used to label a span of time on the timeline navigation component. In
* structure, they are essentially very restricted "slide" objects.
*/
interface ITimelineEra {
  start_date: ITimelineDate;
  end_date: ITimelineDate;
  /*
   * Not required, but recommended.
   */
  text?: ITimelineText | undefined;
}

interface ITimelineDate {
  /*
   * BCE years should be negative numbers.
   */
  year: number | string;
  /*
   * 1-12
   */
  month?: number | string;
  day?: number | string;
  /*
   * 0-23
   */
  hour?: number | string;
  /*
   * 0-59
   */
  minute?: number | string;
  /*
   * 0-59
   */
  second?: number | string;
  millisecond?: number | string;
  /*
   * A string for presenting the date. Useful if Timeline's date formatting doesn't fit your needs.
   */
  display_date?: string | string;
}

interface ITimelineText {
  /*
   * HTML markup is OK. Blank is also OK.
   */
  headline?: string | undefined;
  /*
   * HTML markup is OK. Blank is also OK. Not used for era objects.
   */
  text?: string | undefined;
}

interface ITimelineMedia {
  /*
   * In most cases, a URL (see https://timeline.knightlab.com/docs/media-types.html for complete details).
   */
  url: string;
  /*
   * HTML markup is OK.
   */
  caption?: string | undefined;
  /*
   * HTML markup is OK.
   */
  credit?: string | undefined;
  /*
   * A URL for an image to use in the timenav marker for this event. If omitted, Timeline will use an icon based
   * on the type of media. Not relevant for title slides, because they do not have a marker.
   */
  thumbnail?: string | undefined;
}

interface ITimelineOptions {
  /*
   * Default: false
   * If true, copious console logging will be enabled.
   */
  debug?: boolean | undefined;
  /*
   * Default: this._el.container.offsetHeight
   * The height of the timeline.
   */
  height?: number | undefined;
  /*
   * Default: this._el.container.offsetWidth
   * The width of the timeline.
   */
  width?: number | undefined;
  /*
   * Default: false
   * If true, the class tl-timeline-embed is added to the outer Timeline container. Typically only used to support Timeline iframe embeds.
   */
  is_embed?: boolean | undefined;
  /*
   * Default: false
   * If set to true, TimelineJS will update the browser URL each time a slide advances, so that people can link directly to specific slides.
   */
  hash_bookmark?: boolean | undefined;
  /*
   * Default: white
   * RGB values to use for slide backgrounds. Specify as hex code, CSS named color, or a Javascript object with r, g, and b properties from 0-255.
   */
  default_bg_color?: string | undefined;
  /*
   * Default: 2
   * How many screen widths wide the timeline should be at first presentation.
   */
  scale_factor?: number | undefined;
  /*
   * The position in the zoom_sequence series used to scale the Timeline when it is first created. Takes precedence over scale_factor.
   */
  initial_zoom?: number | undefined;
  /*
   * Default: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
   * Array of values for TimeNav zoom levels. Each value is a scale_factor, which means that at any given level, the full timeline would require that many screens to display all events.
   */
  zoom_sequence?: number[] | undefined;
  /*
   * Default: 'bottom'
   * Display the timeline nav on the top or bottom.
   */
  timenav_position?: 'bottom' | 'top' | undefined;
  /*
   * Default: 100
   * optimal distance (in pixels) between ticks on axis
   */
  optimal_tick_width?: number | undefined;
  /*
   * Default: 'tl-timeline
   * Removing the tl-timeline base class will disable all default stylesheets.
   */
  base_class?: string | undefined;
  /*
   * Default: 150
   * The height in pixels of the timeline nav. Takes precedence over timenav_height_percentage.
   */
  timenav_height?: number | undefined;
  /*
   * Default: 25
   * Specify the timeline nav height as a percentage of the screen instead of in pixels.
   */
  timenav_height_percentage?: number | undefined;
  /*
   * Default: 40
   * Specify the timeline nav height as a percentage of a mobile device screen.
   */
  timenav_mobile_height_percentage?: number | undefined;
  /*
   * Default: 150
   * The minimum timeline nav height (in pixels).
   */
  timenav_height_min?: number | undefined;
  /*
   * Default: 30
   * The minimum marker height (in pixels).
   */
  marker_height_min?: number | undefined;
  /*
   * Default: 100
   * The minimum marker witdh (in pixels).
   */
  marker_width_min?: number | undefined;
  /*
   * Default: 5
   * Top and bottom padding (in pixels) for markers.
   */
  marker_padding?: number | undefined;
  /*
   * Default: 0
   * The first slide to display when the timeline is loaded.
   */
  start_at_slide?: number | undefined;
  /*
   * Default: false
   * If true, loads timeline on last slide.
   */
  start_at_end?: boolean | undefined;
  /*
   * Default: 0
   */
  menubar_height?: number | undefined;
  /*
   * Default: false
   * Use declared suffix on dates earlier than 0.
   */
  use_bc?: boolean | undefined;
  /*
   * Default: 1000
   * Animation duration (in milliseconds).
   */
  duration?: number | undefined;
  /*
   * Default: TL.Ease.easeInOutQuint
   */
  ease?: (() => number) | undefined;
  /*
   * Default: true
   */
  dragging?: boolean | undefined;
  /*
   * Default: true
   */
  trackResize?: boolean | undefined;
  /*
   * Default: 100
   * Padding (in pixels) on the left and right of each slide.
   */
  slide_padding_lr?: number | undefined;
  /*
   * Default: '0%'
   */
  slide_default_fade?: string | undefined;
  /*
   * Default: 'en'
   */
  language?: string | undefined;
  /*
   * Default: null
   * Google Analytics ID.
   */
  ga_property_id?: any;
  /*
   * Default: ['back_to_start','nav_next','nav_previous','zoom_in','zoom_out']
   */
  track_events?: ('back_to_start' | 'nav_next' | 'nav_previous' | 'zoom_in' | 'zoom_out')[] | undefined;
  /*
   * Default: ''
   * Can be used to help Timeline load related resources such as CSS themes and language files. Rarely needs to be set.
   */
  script_path?: string | undefined;
}

type ITimelineEvent = 'back_to_start' | 'change' | 'color_change' | 'dataloaded' | 'hash_updated' | 'loaded' | 'zoom_in' | 'zoom_out' | 'added' | 'removed' | 'nav_next' | 'nav_previous';

interface ITimelineBackToStartEvent { }
// change and color_change
interface ITimelineChangeEvent {
  /*
   * id of the new current slide
   */
  unique_id: string;
}
interface ITimelineDataLoadedEvent { }
interface ITimelineHashUpdatedEvent {
  /*
   * id of the new current slide
   */
  unique_id: string;
  /*
   * the hash
   */
  hashbookmark: string;
}
interface ITimelineLoadedEvent {
  /*
   * the type of date scale
   */
  scale: Scale | undefined;
  /*
   * id of the new current slide
   */
  eras: ITimelineEra[] | undefined;
  /*
   * id of the new current slide
   */
  events: ITimelineSlideData[];
  /*
   * title slide data, if title slide exists
   */
  title: ITimelineSlideData | undefined;
}
// zoom_in and zoom_out
interface ITimelineZoomEvent {
  /*
   * current zoom level
   */
  zoom_level: number;
}
// added and removed
interface ITimelineModifiedEvent {
  /*
   * the id of the modified slide
   */
  unique_id: string
}
// nav_next and nav_previous
interface ITimelineNavEvent { }

declare module '@knight-lab/timelinejs/src/js/date/TLDate';

declare function parseDate(str: string): ITimelineDate;
