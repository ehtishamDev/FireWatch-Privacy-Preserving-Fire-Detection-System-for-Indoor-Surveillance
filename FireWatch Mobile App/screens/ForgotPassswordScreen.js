import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

import { Icon } from "react-native-elements";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSendEmail = async () => {
    try {
      const response = await fetch("http://192.168.67.208:3000/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        const { userId } = responseData;
        setModalMessage("OTP sent successfully to Email.");
        setEmail("");
        toggleModal();
        navigation.navigate("OTPVerification", { email, userId });
      } else {
        const errorData = await response.json();
        setModalMessage(errorData.error || "Failed to send OTP.");
        toggleModal();
      }
    } catch (error) {
      console.error("Error sending OTP: ", error);
      setModalMessage("Failed to send OTP.");
      toggleModal();
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FireWatch</Text>
      <View style={styles.rectangle}>
        <Text style={styles.heading}>Forgot Password </Text>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#A4A4A4" style={styles.icon} />

          <TextInput
            placeholder="yournames@gmail.com"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={handleSendEmail}>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send Email</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#37A372",
  },
  rectangle: {
    width: "100%",
    height: "100%",
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
    marginTop: 82,
    marginBottom: 40,
    marginLeft: -20,
  },
  heading: {
    fontFamily: "Cochin",
    fontSize: 30,
    fontWeight: "600",
    color: "#37A372",
    marginBottom: 20,
    textAlign:'center'
  },

  label: {
    fontFamily: "Cochin",
    fontSize: 14,
    fontWeight: "500",
    color: "#37A372",
    marginBottom: 7,
    marginTop:30
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
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#37A372",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 27,
    letterSpacing: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalCloseText: {
    fontSize: 16,
    color: "#37A372",
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;
