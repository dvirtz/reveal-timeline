interface RevealTimelineOptions {
  height?: string | number;
  position?: 'top' | 'bottom';
  separator?: string
}

interface ExtendedRevealOptions extends RevealOptions {
  timeline: RevealTimelineOptions;
}
