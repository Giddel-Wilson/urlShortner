export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  className?: string;
  variant?: "default" | "destructive";
};
