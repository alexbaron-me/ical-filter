import { type PropsWithChildren } from "react";
import { classNames } from "~/utils/classNames";

type SubElementProps = PropsWithChildren<{ className?: string }>;

function DetailListHeading({ children, className }: SubElementProps) {
  return (
    <dt
      className={classNames(
        className,
        "text-sm font-medium leading-6 text-gray-900",
      )}
    >
      {children}
    </dt>
  );
}

function DetailListValue({ children, className }: SubElementProps) {
  return (
    <dd
      className={classNames(
        className,
        "mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0",
      )}
    >
      {children}
    </dd>
  );
}

function DetailListItem({ children, className }: SubElementProps) {
  return (
    <div
      className={classNames(
        className,
        "px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0",
      )}
    >
      {children}
    </div>
  );
}

function DetailList({ children, className }: SubElementProps) {
  return (
    <dl className={classNames(className, "divide-y divide-gray-100")}>
      {children}
    </dl>
  );
}
DetailList.Item = DetailListItem;
DetailList.Heading = DetailListHeading;
DetailList.Value = DetailListValue;
export default DetailList;
