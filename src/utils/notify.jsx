import { Store } from 'react-notifications-component';
let activeNotifications = new Set();

export const notify = ({ title, message, type = 'default', duration = 5000, id }) => {
  const uniqueId = id || `${title}:${message}:${type}`;

  // Если уведомление уже активно — не показываем повторно
  if (activeNotifications.has(uniqueId)) return;

  activeNotifications.add(uniqueId);

  Store.addNotification({
    // id: uniqueId,
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
    // 💡 При удалении очищаем set
    onRemoval: () => {
      activeNotifications.delete(uniqueId);
    }
  });
};

