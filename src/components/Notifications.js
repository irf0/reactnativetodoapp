//Not Used this package since it is not supporting in expo as of (09/01/2024)->Instead used expo-notification

import PushNotification from "react-native-push-notification";

export const scheduleNotificationForToday = (
  title,
  description,
  timeString
) => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Combine today's date with the provided time string
  const scheduleDateTime = new Date(`${todayString} ${timeString}`);

  PushNotification.localNotificationSchedule(
    {
      channelId: "e23bb8a2-0184-4da1-a37b-92caa4b3d93c",
      title: "My Notification",
      message: "This is a local notification",
      date: new Date(Date.now() + 1 * 1000),
      userInfo: {},
      playSound: true,
      soundName: "default",
      vibrate: true,
      vibration: 300,
    },
    (scheduled) => {
      if (scheduled) {
        console.log("Notification scheduled:", new Date(scheduled));
      } else {
        console.log("Notification not scheduled");
      }
    }
  );
};
