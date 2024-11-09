import type { LoaderFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";
import type { ICalEventStatus } from "ical-generator";
import ical from "ical-generator";
import db from "~/db";
import { calendars } from "~/db/schema";
import { fetchEvents } from "~/ical/fetcher";
import { multipleFilterEvent } from "~/ical/filter";

export async function loader({params}: LoaderFunctionArgs) {
	const calendarId = params.calendarId!;

	const calendar = await db.query.calendars.findFirst({
		where: eq(calendars.id, calendarId),
		with: {filters: true}
	})
	if (!calendar) throw new Response("Not found", {status: 404});

	const events = await fetchEvents(calendar)
  const filteredEvents = events.filter(e => multipleFilterEvent(calendar.filters, e))

	const generatedCalendar = ical({name: calendar.name})
	for (const event of filteredEvents) {
		generatedCalendar.createEvent({
			id: event.uid,
			stamp: event.dtstamp,
			status: event.status as ICalEventStatus,
			url: event.url,
			summary: event.summary,
			description: event.description,
			start: event.start,
			end: event.end,
			location: event.location,
		})
	}

	return new Response(generatedCalendar.toString(), {
		headers: {
			"Content-Type": "text/calendar",
		}
	})
}
