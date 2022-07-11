export function parseDate(date: string): ITimelineDate {
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
