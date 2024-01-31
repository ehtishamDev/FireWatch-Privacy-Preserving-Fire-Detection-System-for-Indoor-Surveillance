import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";

export default function CameraScreen({ navigation }) {
  // Define state for input fields
  const [serverIP, setServerIP] = useState("");
  const [port, setPort] = useState("");

  // Function to navigate to the Home screen
  const navigateToHomeScreen = () => {
    navigation.navigate("Home", { serverIP, port });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera</Text>
      <View style={styles.rectangle}>
        <Text style={styles.heading}>Camera Settings</Text>
        <Text style={styles.subHeading}>Configure your camera</Text>

        {/* Server IP Address input */}
        <Text style={styles.label}>Server IP Address</Text>
        <View style={styles.inputContainer}>
          <Icon
            name="server"
            type="font-awesome"
            size={24}
            color="#A4A4A4"
            style={styles.icon}
          />
          <TextInput
            placeholder="e.g. 192.168.0.1"
            value={serverIP}
            onChangeText={(text) => setServerIP(text)}
            style={styles.input}
          />
        </View>

        {/* Port input */}
        <Text style={styles.label}>Port Number</Text>
        <View style={styles.inputContainer}>
          <Icon
            name="exchange"
            type="font-awesome"
            size={24}
            color="#A4A4A4"
            style={styles.icon}
          />
          <TextInput
            placeholder="e.g. 8000"
            value={port}
            onChangeText={(text) => setPort(text)}
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={navigateToHomeScreen}>
          <View style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#37A372",
  },
  rectangle: {
    width: "100%",
    height: "200%",
    padding: 24,
    borderRadius: 35,
    backgroundColor: "#000000",
  },
  title: {
    alignSelf: "center",
    fontFamily: "Cochin",
    fontSize: 40,
    fontWeight: "600",
    color: "#EFEFEF",
    marginTop: 50,
    marginBottom: 40,
    marginLeft: -20,
  },
  heading: {
    fontFamily: "Cochin",
    fontSize: 30,
    fontWeight: "600",
    color: "#37A372",
    marginBottom: 12,
    textAlign:'center'
  },
  subHeading: {
    fontFamily: "Cochin",
    fontSize: 14,
    fontWeight: "500",
    color: "#EFEFEF",
    marginBottom: 50,
    textAlign:'center'
  },
  label: {
    fontFamily: "Cochin",
    fontSize: 14,
    fontWeight: "500",
    color: "#37A372",
    marginBottom: 7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: "#A4A4A4",
    height: 55,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "#000000",
  },
  signInButton: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#37A372",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 27,
    letterSpacing: 0,
  },
  icon: {
    marginHorizontal: 10,
  },
});
