import { toast } from 'react-toastify';

export function notifyError(msg: string) {
  return toast.error(msg, {
    position: toast.POSITION.BOTTOM_CENTER,
  });
}

export function notifyInfo(msg: string) {
  return toast.info(msg, {
    position: toast.POSITION.BOTTOM_CENTER,
  });
}

export function notifyWarning(msg: string) {
  return toast.warning(msg, {
    position: toast.POSITION.BOTTOM_CENTER,
  });
}

export function notifySuccess(msg: string) {
  return toast.success(msg, {
    position: toast.POSITION.BOTTOM_CENTER,
  });
}

export function dismissNotify(id?: string) {
  if (id) {
    toast.dismiss(id);
  } else {
    toast.dismiss();
  }
}
