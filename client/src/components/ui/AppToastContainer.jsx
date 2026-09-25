import { ToastContainer } from 'react-toastify';

export default function AppToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3200}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={4}
      theme="colored"
      toastClassName="!font-body !rounded-xl !shadow-[0_12px_32px_rgba(41,70,51,0.18)]"
      progressClassName="!bg-white/35"
    />
  );
}
