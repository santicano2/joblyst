import { toast } from "sonner";

export function showSuccessToast(message: string) {
  toast.success(message, {
    duration: 3000,
  });
}

export function showErrorToast(message: string) {
  toast.error(message, {
    duration: 4000,
  });
}

export function showLoadingToast(message: string) {
  return toast.loading(message);
}

export function updateToast(toastId: string | number, message: string) {
  toast.success(message, {
    id: toastId,
    duration: 3000,
  });
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}
