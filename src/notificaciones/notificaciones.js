import { toast } from 'react-toastify';

const notificacionInfo = (mensaje) => {
  toast.info(mensaje, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  
};

const notificacionSuccess = (mensaje) => {
  toast.success(mensaje, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  
};

const notificacionError = (mensaje) => {
  toast.error(mensaje, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  
};
const notificacionWarning = (mensaje) => {
  toast.warn(mensaje, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  
};

export {
    notificacionInfo,
    notificacionSuccess,
    notificacionError,
    notificacionWarning,
}
