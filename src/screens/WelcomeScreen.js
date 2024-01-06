import { View, Text, StyleSheet, Modal, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const handleSaveName = async () => {
    setShowWelcomeModal(false);
    try {
      await AsyncStorage.setItem("userName", JSON.stringify(name));
      await navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#011330",
        justifyContent: "center",
        alignContent: "center",
        flex: 1,
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWelcomeModal}
        // onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <Text style={{ fontSize: 20, fontWeight: "600", color: "white" }}>
            Welcome Back,
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
            Please Enter Your Name to continue
          </Text>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Enter Name"
              value={name}
              onChangeText={(e) => setName(e)}
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
              onPress={handleSaveName}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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

export default WelcomeScreen;
