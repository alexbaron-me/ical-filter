import { animated } from "react-spring";
import { classNames } from "~/utils/classNames";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  color?: "primary" | "destructive" | "secondary";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};
export default function Button({
  className,
  color = "primary",
  size = "lg",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        className,
        "rounded-md text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        size === "xs" && "px-1.5 py-1",
        size === "sm" && "px-2 py-1",
        size === "md" && "px-2.5 py-1.5",
        size === "lg" && "px-3 py-2",
        size === "xl" && "px-4 py-2",
        color === "primary" &&
          "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 disabled:bg-indigo-400",
        color === "destructive" &&
          "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600 disabled:bg-red-400",
        color === "secondary" &&
          "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400",
      )}
    />
  );
}
export const AnimatedButton = animated(Button);
