import type { SerializeFrom } from "@remix-run/node";

export type FilterBy =
  | "summary"
  | "description"
  | "location"
  | "CO-RECURRINGID";
export interface Filter {
  id: string;
  filterBy: string;
  filterValue: string;
}

export type CalendarConfirmationStatus =
  | "CONFIRMED"
  | "TENTATIVE"
  | "CANCELLED";
export interface CalendarEvent {
  uid: string;
  dtstamp: Date;
  status: CalendarConfirmationStatus;
  url: string;
  summary: string;
  description: string | undefined;
  start: Date;
  end: Date;
  location: string | undefined;
  "CO-RECURRINGID": string | undefined;
}
export function unjsonCalendarEvent(
  event: SerializeFrom<CalendarEvent>,
): CalendarEvent {
  return {
    ...event,
    dtstamp: new Date(event.dtstamp),
    start: new Date(event.start),
    end: new Date(event.end),
    description: event.description ?? undefined,
    location: event.location ?? undefined,
    "CO-RECURRINGID": event["CO-RECURRINGID"] ?? undefined,
  };
}

/* Filter events
 * @returns true if event passes the filter, so it should
 * be included in the filtered list of events.
 */
export function filterEvent(filter: Filter, event: CalendarEvent): boolean {
  const filterBy = filter.filterBy as FilterBy;
  const filterValue = filter.filterValue;
  const eventValue = event[filterBy] ?? "";

  return !eventValue.includes(filterValue);
}
export function multipleFilterEvent(
  filters: Filter[],
  event: CalendarEvent,
): boolean {
  return filters.every((filter) => filterEvent(filter, event));
}
