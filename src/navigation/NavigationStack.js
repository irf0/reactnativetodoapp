import { View, Text, Button, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Yesterday from "../screens/Yesterday";
import { useNavigation } from "@react-navigation/native";
import Tommorrow from "../screens/Tommorrow";
import AntDesign from "react-native-vector-icons/AntDesign";
import PendingTask from "../screens/PendingTask";
import CompletedTask from "../screens/CompletedTask";
import WelcomeScreen from "../screens/WelcomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const NavigationStack = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [yesterdayDate, setYesterdayDate] = useState(new Date());
  const [TommorowDate, setTommorowDate] = useState(new Date());
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isUserLogged, setIsUserLogged] = useState(false);

  // Yesterday
  useEffect(() => {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    setYesterdayDate(yesterday);
  }, [currentDate]);

  //Tommorrow
  useEffect(() => {
    const tommorrow = new Date(currentDate);
    tommorrow.setDate(currentDate.getDate() + 1);
    setTommorowDate(tommorrow);
  }, [currentDate]);

  const retrieveUserName = async () => {
    try {
      const user = await AsyncStorage.getItem("userName");
      if (user) {
        setIsUserLogged(true);
        navigation.navigate("Home");
      } else {
        setIsUserLogged(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveUserName();
  }, []);

  return (
    <>
      {isUserLogged ? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            initialParams={navigation.navigate("Home", { date: currentDate })}
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              title: `Today, ${currentDate.toDateString().slice(0, -4)}`,
              headerTitleAlign: "center",
              headerTintColor: "white",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#011330",
              },
            }}
          />
          <Stack.Screen
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerTintColor: "white",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#011330",
              },
              title: `${yesterdayDate.toDateString().slice(0, -4)}`,
              headerLeft: () => (
                <AntDesign
                  name=""
                  size={30}
                  color="white"
                  onPress={() => navigation.navigate("Yesterday")}
                />
              ),
              headerRight: () => (
                <AntDesign
                  name="arrowright"
                  size={30}
                  color="white"
                  onPress={() => navigation.navigate("Home")}
                />
              ),
            }}
            name="Yesterday"
            component={Yesterday}
          />
          <Stack.Screen
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              headerTintColor: "white",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#011330",
              },
              title: `${TommorowDate.toDateString().slice(0, -4)}`,
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="white"
                  onPress={() => navigation.navigate("Home")}
                />
              ),
              headerRight: () => <AntDesign name="" size={30} color="white" />,
            }}
            name="Tommorrow"
            component={Tommorrow}
          />
          <Stack.Screen
            component={PendingTask}
            name="PendingTask"
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              headerTintColor: "black",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#FCCC6E",
              },
              title: `Today, ${currentDate.toDateString().slice(0, -5)}`,
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  onPress={() => navigation.goBack()}
                />
              ),
              headerRight: () => <AntDesign name="" size={30} color="white" />,
            }}
          />
          <Stack.Screen
            component={CompletedTask}
            name="CompletedTask"
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              headerTintColor: "black",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#86FF72",
                opacity: 0.8,
              },
              title: `Today, ${currentDate.toDateString().slice(0, -5)}`,
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  onPress={() => navigation.goBack()}
                />
              ),
              headerRight: () => <AntDesign name="" size={30} color="white" />,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              headerTintColor: "white",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#011330",
              },
              title: "Welcome to Todulo App",
              headerLeft: () => (
                <AntDesign
                  name=""
                  size={30}
                  color="black"
                  onPress={() => navigation.goBack()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            initialParams={{ date: currentDate }}
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              title: `${currentDate.toDateString().slice(0, -4)}`,
              headerTitleAlign: "center",
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="white"
                  onPress={() =>
                    navigation.navigate("Yesterday", { date: yesterdayDate })
                  }
                />
              ),
              headerRight: () => (
                <AntDesign
                  name="arrowright"
                  size={30}
                  color="white"
                  onPress={() =>
                    navigation.navigate("Tommorrow", { date: TommorowDate })
                  }
                />
              ),

              headerTintColor: "white",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#011330",
              },
            }}
          />
          <Stack.Screen
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerTintColor: "white",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#011330",
              },
              title: `${yesterdayDate.toDateString().slice(0, -4)}`,
              headerLeft: () => (
                <AntDesign
                  name=""
                  size={30}
                  color="white"
                  onPress={() => navigation.navigate("Yesterday")}
                />
              ),
              headerRight: () => (
                <AntDesign
                  name="arrowright"
                  size={30}
                  color="white"
                  onPress={() => navigation.navigate("Home")}
                />
              ),
            }}
            name="Yesterday"
            component={Yesterday}
          />
          <Stack.Screen
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              headerTintColor: "white",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#011330",
              },
              title: `${TommorowDate.toDateString().slice(0, -4)}`,
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="white"
                  onPress={() => navigation.navigate("Home")}
                />
              ),
              headerRight: () => <AntDesign name="" size={30} color="white" />,
            }}
            name="Tommorrow"
            component={Tommorrow}
          />
          <Stack.Screen
            component={PendingTask}
            name="PendingTask"
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              headerTintColor: "black",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#FCCC6E",
              },
              title: `Today, ${currentDate.toDateString().slice(0, -5)}`,
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  onPress={() => navigation.goBack()}
                />
              ),
              headerRight: () => <AntDesign name="" size={30} color="white" />,
            }}
          />
          <Stack.Screen
            component={CompletedTask}
            name="CompletedTask"
            options={{
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerShown: true,
              headerTintColor: "black",
              headerTitleAlign: "center",
              headerStyle: {
                elevation: 0,
                backgroundColor: "#86FF72",
                opacity: 0.8,
              },
              title: `Today, ${currentDate.toDateString().slice(0, -5)}`,
              headerLeft: () => (
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  onPress={() => navigation.goBack()}
                />
              ),
              headerRight: () => <AntDesign name="" size={30} color="white" />,
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default NavigationStack;
