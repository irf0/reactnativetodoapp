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
import AntDesign from "react-native-vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "@rneui/themed";
import {
  GestureHandlerRootView,
  Swipeable,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const Home = ({ route }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isTaskChecked, setIsTaskChecked] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditingModalVisible, setEditingModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const navigation = useNavigation();

  const { date } = route.params || {};

  useEffect(() => {
    loadTasks();
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const closeEditModal = () => {
    setEditingModalVisible(false);
  };

  const handleTimeChange = (e, chosenTime) => {
    setShowPicker(false);
    setTime(chosenTime);
  };

  const handleModalSubmit = () => {
    setIsModalVisible(false);
    if (title !== "" || description !== "" || time !== "") {
      const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        taskTime: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: date,
        isChecked: false,
        isSelected: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setTitle("");
      setDescription("");
    } else {
      Alert.alert("Please enter Task details!");
    }
  };

  // const handleEditModalSubmit = () => {
  //   setEditingModal(false);

  //   if (title !== "" || description !== "") {
  //     const EditTask = {
  //       id: tasks.length + 1,
  //       title: editTitle,
  //       description: editDescription,
  //       taskTime: time.toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }),
  //       date: date,
  //       isChecked: false,
  //       isSelected: false,
  //     };
  //      const updatedTasks = editingTodo
  //        ? tasks.map((task) => (task.id === editingTodo.id ? editedTask : task))
  //        : [...tasks, EditTask];
  //     setTasks(updatedTasks);
  //     saveTasks(updatedTasks);
  //     setEditTitle("");
  //     setEditDescription("");
  //   } else {
  //     Alert.alert("Please enter Task details!");
  //   }
  // };

  //Save the Tasks in Asyncstorage
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  //Now let's retrieve the tasks
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");

      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  //Checkbox logic

  const handleCheckBoxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        const updatedTask =
          task.id === taskId ? { ...task, isChecked: !task.isChecked } : task;
        console.log(`Task ${taskId} isChecked: ${updatedTask.isChecked}`);
        return updatedTask;
      })
    );
  };

  //Action OnLeft Swipe

  const swipeFromRightOpen = (task) => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const RightSwipeActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f56653",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            color: "white",
            paddingHorizontal: 10,
            fontWeight: "600",
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          <MaterialCommunityIcons name="delete" size={30} color="white" />
        </View>
      </View>
    );
  };

  const handleLongPressEdit = (taskId) => {
    const todoToEdit = tasks.find((task) => task.id === taskId);
    setEditingTodo(todoToEdit); //Identifying which one to target.
    setEditTitle(todoToEdit.title); //Changing title of the found
    setEditDescription(todoToEdit.description); //Changing desc. of the found
    setEditingModalVisible(true);
  };

  const handleEditModalSubmit = () => {
    setEditingModalVisible(false);
    if (editTitle !== "" || editDescription !== "") {
      const editedTask = {
        ...editingTodo,
        title: editTitle,
        description: editDescription,
        taskTime: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const updatedTasks = tasks.map((task) =>
        task.id === editingTodo.id ? editedTask : task
      );

      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setEditTitle("");
      setEditDescription("");
      setEditingTodo(null);
    } else {
      Alert.alert("Please enter Task details!");
    }
  };

  const navigateToDetail = (thisTask) => {
    if (thisTask.isChecked === true) {
      navigation.navigate("CompletedTask", {
        id: thisTask.id,
        title: thisTask.title,
        description: thisTask.description,
        time: thisTask.taskTime,
        checked: thisTask.isChecked,
        updateChecked: (newCheckedValue) => {
          const updatedTasks = tasks.map((task) =>
            task.id === thisTask.id
              ? { ...task, isChecked: newCheckedValue }
              : task
          );
          setTasks(updatedTasks);
          saveTasks(updatedTasks);
        },
      });
    } else {
      navigation.navigate("PendingTask", {
        id: thisTask.id,
        title: thisTask.title,
        description: thisTask.description,
        time: thisTask.taskTime,
        checked: thisTask.isChecked,
        updateChecked: (newCheckedValue) => {
          const updatedTasks = tasks.map((task) =>
            task.id === thisTask.id
              ? { ...task, isChecked: newCheckedValue }
              : task
          );
          setTasks(updatedTasks);
          saveTasks(updatedTasks);
        },
      });
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
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GestureHandlerRootView>
              <Swipeable
                renderLeftActions={RightSwipeActions}
                onSwipeableOpen={() => {
                  swipeFromRightOpen(item);
                }}
              >
                <TouchableOpacity
                  onPress={() => navigateToDetail(item)}
                  onLongPress={() => handleLongPressEdit(item.id)}
                  style={{
                    backgroundColor: item.isChecked ? "#86FF72" : "#FCCC6E",
                    padding: 16,
                    marginHorizontal: 22,
                    marginVertical: 4,
                    borderRadius: 7,
                    flexDirection: "row",
                  }}
                >
                  <CheckBox
                    checked={item.isChecked}
                    onPress={() =>
                      handleCheckBoxChange(item.id, item.isChecked)
                    }
                    checkedColor="green"
                    containerStyle={{
                      backgroundColor: "transparent",
                      marginLeft: 0,
                    }}
                    size={30}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <Text>{item?.title}</Text>
                    <Text>{item?.description}</Text>
                    <Text>{item?.taskTime}</Text>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            </GestureHandlerRootView>
          )}
        />

        {/* This is Editing Modal */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditingModalVisible}
          onRequestClose={closeEditModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setEditingModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={26}
                  style={{ alignSelf: "flex-end" }}
                />
              </TouchableOpacity>
              <TextInput
                placeholder="Title"
                value={editTitle}
                onChangeText={(e) => setEditTitle(e)}
                style={{
                  borderBottomColor: "#011b45",
                  borderWidth: 2,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderTopWidth: 0,
                  padding: 10,
                  fontSize: 25,
                }}
              />
              <TextInput
                multiline={true}
                numberOfLines={3}
                value={editDescription}
                onChangeText={(e) => setEditDescription(e)}
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
                onPress={handleEditModalSubmit}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={26}
                  style={{ alignSelf: "flex-end" }}
                />
              </TouchableOpacity>
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

export default Home;
