import { useContext } from "react";
import { calendarContext } from "./Calendar";
import { DAY_IN_MS, dateFromWeek } from "~/utils/date";
import { classNames } from "~/utils/classNames";
import { Link } from "@remix-run/react";
import type { CalendarEvent } from "~/ical/filter";

export type CalendarEventProps = {
	event: CalendarEvent;
  ghost?: boolean;
	isSelected?: boolean;
};
export default function CalendarEvent({
  event,
  ghost = false,
	isSelected = false,
}: CalendarEventProps) {
  const context = useContext(calendarContext);
  if (!context) throw new Error("CalendarEvent must be used within a Calendar");

  const weekStart = dateFromWeek(context.week, context.year);
  const dayIndex = Math.floor(
    (event.start.getTime() - weekStart.getTime()) / DAY_IN_MS,
  );

  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
  const duration = ((event.end.getTime() - event.start.getTime()) / DAY_IN_MS) * 24;

  return (
    <li
      className="relative mt-px flex sm:col-start-[--col]"
      style={
        {
          gridRow: `${
            context.slot_offset +
            startHour * context.slots_per_hour -
            context.range[0] * context.slots_per_hour
          } / span ${duration * context.slots_per_hour}`,
          "--col": dayIndex + 1,
        } as React.CSSProperties
      }
    >
      <Link
				to={event.uid}
        className={classNames(
          "group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5 ",
          !ghost && "bg-pink-50 hover:bg-pink-100",
          ghost && "border border-dashed border-pink-200 bg-white hover:bg-gray-100 hover:border-dashed-600",
					isSelected && "bg-pink-100 border border-pink-300",
        )}
      >
        <p className="text-pink-500 group-hover:text-pink-700">
          <time dateTime={event.start.toISOString()}>
            {event.start.toLocaleString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </p>
        <p className="font-semibold text-pink-700">{event.summary}</p>
        {event.location && <p className="text-pink-600">{event.location}</p>}
      </Link>
    </li>
  );
}
