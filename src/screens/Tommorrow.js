import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "react-native-vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tommorrow = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tomorrowTasks, setTomorrowTasks] = useState([]);

  useEffect(() => {
    loadTomorrowTasks();
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleTimeChange = (e, chosenTime) => {
    setShowPicker(false);
    setTime(chosenTime);
  };

  const handleModalSubmit = () => {
    setIsModalVisible(false);

    if (!title === "" || !description === "") {
      const newTask = {
        id: tomorrowTasks.length + 1,
        title: title,
        description: description,
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      const updatedTasks = [...tomorrowTasks, newTask];
      setTomorrowTasks(updatedTasks);
      saveTasks(updatedTasks);
      setTitle("");
      setDescription("");
    } else {
      Alert.alert("Please enter Task details!");
    }
  };

  //Save the Tasks in Asyncstorage
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem("tomorrowTasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  //Now let's retrieve the tasks
  const loadTomorrowTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tomorrowTasks");
      if (storedTasks) {
        setTomorrowTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };
  return (
    <>
      <View
        style={{
          backgroundColor: "#011330",
          justifyContent: "space-between",
          alignContent: "space-between",
          flex: 1,
        }}
      >
        <FlatList
          data={tomorrowTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 16,
                marginHorizontal: 22,
                marginVertical: 4,
                borderRadius: 7,
              }}
            >
              <Text>{item?.title}</Text>
              <Text>{item?.description}</Text>
              <Text>{item?.time}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={(e) => setTitle(e)}
                style={{
                  borderBottomColor: "#011b45",
                  borderWidth: 2,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  padding: 10,
                  fontSize: 25,
                }}
              />
              <TextInput
                multiline={true}
                numberOfLines={3}
                value={description}
                onChangeText={(e) => setDescription(e)}
                placeholder="Description"
                style={{
                  borderWidth: 2,
                  padding: 16,
                  marginTop: 25,
                  borderWidth: 0.5,
                  borderRadius: 6,
                  display: "flex",
                  flexWrap: "wrap",
                }}
              />
              {showPicker && (
                <DateTimePicker
                  testID="timePicker"
                  value={time}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
              <View
                style={{
                  width: "100%",
                  padding: 16,
                  borderWidth: 0.5,
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderRadius: 7,
                }}
              >
                <Text>
                  {time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <AntDesign
                  name="clockcircleo"
                  size={25}
                  onPress={() => setShowPicker(true)}
                />
              </View>
              <TouchableOpacity
                style={{
                  padding: 13,
                  borderRadius: 6,
                  backgroundColor: "#011b45",
                  display: "flex",
                  justifyContent: "center",
                  width: "70%",
                  alignSelf: "center",
                }}
                onPress={handleModalSubmit}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsModalVisible(true)}
          style={{
            position: "absolute",
            bottom: 35,
            right: 18,
            backgroundColor: "white",
            padding: 16,
            borderRadius: 9,
            marginTop: 7,
          }}
        >
          <AntDesign name="plus" size={30} style={{ fontWeight: "bold" }} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "80%",
    display: "flex",
    gap: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    position: "absolute",
    bottom: 35,
    right: 18,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 9,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Tommorrow;
