import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import DetailList from "~/components/DetailList";
import db from "~/db";
import { calendars } from "~/db/schema";
import { fetchEvents } from "~/ical/fetcher";
import { multipleFilterEvent } from "~/ical/filter";

export async function loader({ params }: LoaderFunctionArgs) {
	const calendarId = params.calendarId!;
	const eventId = params.eventId!;

	const calendar = await db.query.calendars.findFirst({ where: eq(calendars.id, calendarId), with: { filters: true } });
	if (!calendar) throw new Response("Calendar not found", { status: 404 });

	const events = await fetchEvents(calendar);
	const event = events.find((e) => e.uid === eventId);
	if (!event) throw new Response("Event not found", { status: 404 });

	return json({
		event: {
			...event,
			removedByFilter: !multipleFilterEvent(calendar.filters, event),
			inRecurrenceGroup: events.filter((e) => e["CO-RECURRINGID"] === event["CO-RECURRINGID"]).length
		}
	})
}

export default function EventDetailPage() {
	const { event } = useLoaderData<typeof loader>();

	return (
		<div>
			<div className="px-4 sm:px-0">
				<h3 className="text-base font-semibold leading-7 text-gray-900">Event Details</h3>
				<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">More information on the selected calendar event.</p>
			</div>
			<div className="mt-6 border-t border-gray-100">
				<DetailList>
					<DetailList.Item>
						<DetailList.Heading>Title</DetailList.Heading>
						<DetailList.Value>{event.summary}</DetailList.Value>
					</DetailList.Item>
					{event.location && <DetailList.Item>
						<DetailList.Heading>Location</DetailList.Heading>
						<DetailList.Value>{event.location}</DetailList.Value>
					</DetailList.Item>
					}
					<DetailList.Item>
						<DetailList.Heading>Date</DetailList.Heading>
						<DetailList.Value>{new Date(event.dtstamp).toLocaleDateString()}</DetailList.Value>
					</DetailList.Item>
					<DetailList.Item>
						<DetailList.Heading>Duration</DetailList.Heading>
						<DetailList.Value>{new Date(event.start).toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" })} to {new Date(event.end).toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" })}</DetailList.Value>
					</DetailList.Item>
					{event.inRecurrenceGroup > 0 && <DetailList.Item>
						<DetailList.Heading>Recurrence</DetailList.Heading>
						<DetailList.Value>{event.inRecurrenceGroup} in recurrence group</DetailList.Value>
					</DetailList.Item>}
					<DetailList.Item>
						<DetailList.Heading>Status</DetailList.Heading>
						<DetailList.Value>{event.status}</DetailList.Value>
					</DetailList.Item>
				</DetailList>
			</div>
		</div>
	)
}
