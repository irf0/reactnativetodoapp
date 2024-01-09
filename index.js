// index.js

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import PushNotification, { Importance } from "react-native-push-notification";

// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log("NOTIFICATION:", notification);
//   },
// });

// PushNotification.createChannel(
//   {
//     channelId: "e23bb8a2-0184-4da1-a37b-92caa4b3d93c", // (required)
//     channelName: appName, // (required)
//     channelDescription: "A channel to categorise your notifications",
//     soundName: "default",
//     importance: Importance.HIGH,
//     vibrate: true,
//   },
//   (created) => console.log(`createChannel returned '${created}'`)
// );

AppRegistry.registerComponent(appName, () => App);
