import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CompletedTask = ({ route }) => {
  const { title, description, time } = route.params || {};
  const [greeting, setGreeting] = useState("Good Morning");
  const [loggedUserName, setLoggedUserName] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  });

  const retrieveUserName = async () => {
    try {
      const user = await AsyncStorage.getItem("userName");
      const cleanedUser = user ? user.replace(/"/g, "") : "";
      setLoggedUserName(cleanedUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveUserName();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#86FF72",
        height: "100%",
        display: "flex",
      }}
    >
      <Text
        style={{
          fontWeight: "400",
          fontSize: 36,
          marginLeft: 22,
        }}
      >
        {greeting} {"     "}
        <Text>{loggedUserName},</Text>
      </Text>
      <View style={{ marginLeft: 22, marginTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "500" }}>{title}</Text>
        <Text style={{ fontSize: 18, fontWeight: "400", marginLeft: 3 }}>
          {time}
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 3, marginTop: 20 }}>
          {description}
        </Text>
      </View>

      <View
        style={{ position: "absolute", bottom: 20, width: "100%", zIndex: 50 }}
      >
        <Text style={{ fontWeight: "bold", alignSelf: "center", fontSize: 21 }}>
          Task Finished <MaterialCommunityIcon name="check" size={30} />
        </Text>
      </View>
    </View>
  );
};

export default CompletedTask;
