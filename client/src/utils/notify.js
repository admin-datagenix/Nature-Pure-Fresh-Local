import { toast } from 'react-toastify';

const DEFAULT_OPTIONS = {
  autoClose: 3200,
};

export function notifySuccess(message, options) {
  toast.success(message, { ...DEFAULT_OPTIONS, ...options });
}

export function notifyError(message, options) {
  toast.error(message, { ...DEFAULT_OPTIONS, ...options });
}

export function notifyInfo(message, options) {
  toast.info(message, { ...DEFAULT_OPTIONS, ...options });
}

export function notifyWarn(message, options) {
  toast.warn(message, { ...DEFAULT_OPTIONS, ...options });
}

export { toast };
