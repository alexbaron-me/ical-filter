import type { CSSProperties, PropsWithChildren } from "react";
import { Fragment, createContext } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "~/utils/classNames";
import { DAY_IN_MS, dateFromWeek, isToday } from "~/utils/date";

export type CalendarProps = PropsWithChildren<{
  year: number;
  week: number;
  hoursRange?: [number, number];
  showWeekend?: boolean;
  onWeekChange?: (week: number | "current") => void;
}>;

export type CalendarContext = {
  year: number;
  week: number;
  slots_per_hour: number;
  slot_offset: number;
  range: [number, number];
};
export const calendarContext = createContext<CalendarContext | null>(null);

const SLOTS_PER_HOUR = 12;

export default function Calendar({
  year,
  week,
  children,
  hoursRange = [0, 24],
  showWeekend = false,
  onWeekChange,
}: CalendarProps) {
  const startDate = dateFromWeek(week, year);
  const weekDays = [...new Array(showWeekend ? 7 : 5)].map(
    (_, i) => new Date(startDate.getTime() + i * DAY_IN_MS),
  );

  let range: [number, number];
  range = [Math.min(...hoursRange), Math.max(...hoursRange)];
  if (range[0] < 0) range[0] = 0;
  if (range[1] > 24) range[1] = 24;
  const times = [...new Array(range[1] - range[0])].map(
    (_, i) => (i + range[0]).toString().padStart(2, "0") + ":00",
  );
  const hours = range[1] - range[0];

  const context: CalendarContext = {
    year,
    week,
    slots_per_hour: SLOTS_PER_HOUR,
    slot_offset: 2,
    range,
  };

  const columnsStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${weekDays.length}, minmax(0, 1fr))`,
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          {startDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              onClick={() => onWeekChange?.(week - 1)}
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => onWeekChange?.("current")}
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              onClick={() => onWeekChange?.(week + 1)}
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onWeekChange?.("current")}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full px-4 py-2 text-left text-sm",
                        )}
                      >
                        Go to today
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
      <div className="isolate flex flex-auto flex-col overflow-auto bg-white">
        <div
          style={{ width: "165%" }}
          className="flex h-full max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8">
            <div
              className="grid text-sm leading-6 text-gray-500 sm:hidden"
              style={columnsStyle}
            >
              {weekDays.map((d) => (
                <button
                  key={d.getTime()}
                  type="button"
                  className="flex flex-col items-center pb-3 pt-2"
                >
                  {d
                    .toLocaleDateString("en-US", { weekday: "short" })
                    .slice(0, 1)}
                  <span
                    className={classNames(
                      "mt-1 flex h-8 w-8 items-center justify-center",
                      isToday(d) && "rounded-full bg-indigo-600 text-white",
                      d.getMonth() === startDate.getMonth()
                        ? "font-semibold text-gray-900"
                        : "text-gray-400",
                    )}
                  >
                    {d.getDate()}
                  </span>
                </button>
              ))}
            </div>

            <div className="-mr-px hidden divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid" style={columnsStyle}>
              <div className="col-end-1 w-14" />
              {weekDays.map((d) => (
                <div
                  className="flex items-center justify-center py-3"
                  key={d.getTime()}
                >
                  <span
                    className={classNames(isToday(d) && "flex items-baseline")}
                  >
                    {d.toLocaleDateString("en-US", { weekday: "short" }) + " "}
                    <span
                      className={classNames(
                        "items-center justify-center font-semibold",
                        isToday(d) &&
                          "-my-1 ml-1.5 flex h-8 w-8 rounded-full bg-indigo-600 font-semibold text-white",
                        d.getMonth() === startDate.getMonth()
                          ? "text-gray-900"
                          : "text-gray-400",
                      )}
                    >
                      {d.getDate()}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{
                  gridTemplateRows: `repeat(${2 * hours}, minmax(3.5rem, 1fr))`,
                }}
              >
                <div className="row-end-1 h-7" />
                {times.map((t) => (
                  <Fragment key={t}>
                    <div>
                      <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {t}
                      </div>
                    </div>
                    <div />
                  </Fragment>
                ))}
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-rows-1 divide-x divide-gray-100 sm:grid" style={columnsStyle}>
                {[...new Array(weekDays.length)].map((i) => (
                  <div
                    key={i}
                    className="row-span-full"
                    style={{ gridColumnStart: i }}
                  />
                ))}
                <div className="col-start-8 row-span-full w-8" />
              </div>

              <ol
                className="col-start-1 col-end-2 row-start-1 grid sm:pr-8"
                style={{
									...columnsStyle,
                  gridTemplateRows: `1.75rem repeat(${
                    SLOTS_PER_HOUR * hours
                  }, minmax(0, 1fr)) auto`,
                }}
              >
                <calendarContext.Provider value={context}>
                  {children}
                </calendarContext.Provider>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
