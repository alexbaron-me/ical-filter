import { classNames } from "~/utils/classNames";

export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label?: string;
  labelSrOnly?: boolean;
  name: string;
  addonPre?: React.ReactNode;
  addonPost?: React.ReactNode;
};
export default function Input({
  label,
  labelSrOnly = false,
  className,
  addonPost,
  addonPre,
  ...props
}: InputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={props.id ?? props.name}
        className={classNames(
          labelSrOnly && "sr-only",
          !labelSrOnly && "block text-sm font-medium leading-6 text-gray-900",
        )}
      >
        {label}
      </label>
      <div
        className={classNames(
          !labelSrOnly && "mt-2",
          "flex rounded-md shadow-sm",
        )}
      >
        {addonPre && (
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
            {addonPre}
          </span>
        )}
        <input
          {...props}
          className={classNames(
            "block w-full min-w-0 flex-1 rounded-none border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            !addonPre && "rounded-l-md",
            !addonPost && "rounded-r-md",
          )}
        />
        {addonPost && (
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
            {addonPost}
          </span>
        )}
      </div>
    </div>
  );
}
