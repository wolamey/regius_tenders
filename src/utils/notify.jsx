import { Store } from 'react-notifications-component';

export const notify = ({ title, message, type = 'default', duration = 10000 }) => {
setTimeout(() => {

  Store.addNotification({
    title,
    message,
    type, 
    insert: 'bottom',
    container: 'bottom-right',
    animationIn: ['animate__animated', 'animate__zoomIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
     duration,
      pauseOnHover: true,
      onScreen: true,
      showIcon: true,
      click: true,
    },
  });
}, 250);

};
