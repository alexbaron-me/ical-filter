import { Dialog as ReachDialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

export type DialogProps = React.PropsWithChildren<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>;
export default function Dialog({ isOpen, setOpen, children }: DialogProps) {
  const close = () => setOpen(false);

  return (
    <ReachDialog
      isOpen={isOpen}
      onDismiss={close}
      className="rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
    >
			{children}
    </ReachDialog>
  );
}
