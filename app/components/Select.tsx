import type { PropsWithChildren } from "react";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "~/utils/classNames";

type OptionProps = PropsWithChildren<{
  value: string;
}>;
function Option({ value, children }: OptionProps) {
  return (
    <Listbox.Option
      className={({ active }) =>
        classNames(
          active ? "bg-indigo-600 text-white" : "text-gray-900",
          "relative cursor-default select-none py-2 pl-3 pr-9",
        )
      }
      value={value}
    >
      {({ selected, active }) => (
        <>
          <span
            className={classNames(
              selected ? "font-semibold" : "font-normal",
              "block truncate",
            )}
          >
            {children}
          </span>

          {selected ? (
            <span
              className={classNames(
                active ? "text-white" : "text-indigo-600",
                "absolute inset-y-0 right-0 flex items-center pr-4",
              )}
            >
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
        </>
      )}
    </Listbox.Option>
  );
}

export type SelectProps = PropsWithChildren<{
  label: string;
  labelSrOnly?: boolean;
  selected: string;
  selectedName?: string;
  setSelected: (value: string) => void;
}>;
function Select({
  label,
  labelSrOnly = false,
  selected,
  selectedName = selected,
  setSelected,
  children,
}: SelectProps) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label
            className={classNames(
              labelSrOnly
                ? "sr-only"
                : "block text-sm font-medium leading-6 text-gray-900",
            )}
          >
            {label}
          </Listbox.Label>
          <div className={classNames("relative", !labelSrOnly && "mt-2")}>
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selectedName}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {children}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
Select.Option = Option;
export default Select;
