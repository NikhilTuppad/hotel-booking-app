import toast from 'react-hot-toast';

// To prevent duplicate stacking, we can use toast IDs
const ids = new Set();

export const showSuccess = (message, id = null) => {
  if (id) {
    if (ids.has(id)) toast.dismiss(id);
    ids.add(id);
    return toast.success(message, { id });
  }
  return toast.success(message);
};

export const showError = (message, id = null) => {
  if (id) {
    if (ids.has(id)) toast.dismiss(id);
    ids.add(id);
    return toast.error(message, { id });
  }
  return toast.error(message);
};

export const showLoading = (message, id = null) => {
  if (id) {
    if (ids.has(id)) toast.dismiss(id);
    ids.add(id);
    return toast.loading(message, { id });
  }
  return toast.loading(message);
};

export const dismissToast = (id) => {
  toast.dismiss(id);
  if (ids.has(id)) ids.delete(id);
};

export const toastPromise = (promise, loadingMsg, successMsg, errorMsg) => {
  return toast.promise(
    promise,
    {
      loading: loadingMsg,
      success: successMsg,
      error: errorMsg,
    },
    {
      success: {
        duration: 4000,
      },
      error: {
        duration: 5000,
      }
    }
  );
};
