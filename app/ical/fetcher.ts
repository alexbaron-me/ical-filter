import type { Calendar } from "~/db/schema";
import ical from "@nponsard/ical";
import type { CalendarEvent } from "./filter";

export async function fetchEvents(calendar: Calendar) {
	let sourceUrl = calendar.sourceUrl;
	if (!sourceUrl.startsWith('http')) {
		sourceUrl = 'https://' + sourceUrl;
	}

  const response = await fetch(sourceUrl);
  const text = await response.text();
  const data = await ical.async.parseICS(text);

  const events = Object.values(data).filter(
    (event) => event.type === "VEVENT",
  ) as unknown as CalendarEvent[];

  return events;
}
