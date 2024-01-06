import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PendingTask = ({ route }) => {
  const { title, description, time, updateChecked } = route.params || {};
  const [greeting, setGreeting] = useState("Good Morning");
  const [swiped, setSwiped] = useState(false);
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

  const RightSwipeActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#86FF72",
          opacity: 0.8,
          justifyContent: "center",
          borderRadius: 26,
          padding: -10,
        }}
      >
        <View
          style={{
            color: "white",
            paddingHorizontal: 10,
            fontWeight: "600",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Mark as Finished
          </Text>
        </View>
      </View>
    );
  };

  const swipeFromRightOpen = () => {
    setSwiped(true);
    updateChecked(true);
  };

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
        backgroundColor: "#FCCC6E",
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

      <GestureHandlerRootView
        style={{ position: "absolute", bottom: 20, width: "100%", zIndex: 50 }}
      >
        {swiped ? (
          <View>
            <Text
              style={{ fontWeight: "bold", alignSelf: "center", fontSize: 20 }}
            >
              Task Finished <MaterialCommunityIcon name="check" size={30} />
            </Text>
          </View>
        ) : (
          <View
            style={{
              alignSelf: "center",
              padding: 0,
              borderRadius: 26,
              width: "80%",
              backgroundColor: "black",
            }}
          >
            <Swipeable
              friction={1.3}
              onSwipeableOpen={() => swipeFromRightOpen()}
              renderLeftActions={RightSwipeActions}
            >
              <MaterialCommunityIcon
                name="checkbox-marked-circle"
                size={45}
                color="white"
              />
            </Swipeable>
          </View>
        )}
        {!swiped && (
          <Text style={{ fontWeight: "bold", alignSelf: "center" }}>
            Swipe to Mark as Finished
          </Text>
        )}
      </GestureHandlerRootView>
    </View>
  );
};

export default PendingTask;
