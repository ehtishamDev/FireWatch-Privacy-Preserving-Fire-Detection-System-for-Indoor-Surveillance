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

const OTPVerificationScreen = ({ navigation, route }) => {
  const [otp, setOTP] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const email = route.params.email;
  const userId = route.params.userId;

  const handleOTP = async () => {
    try {
      const response = await fetch("http://192.168.67.208:3000/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, enteredOTP: otp }),
      });

      if (response.status === 200) {
        setModalMessage("OTP verification Sucess.");
        toggleModal();
        navigation.navigate("NewPassword", { userId });
        setOTP("");
      } else {
        const errorData = await response.json();
        setModalMessage(errorData.error || "Invalid OTP. Please try again.");
        toggleModal();
      }
    } catch (error) {
      console.error("Error verifying OTP: ", error);
      setModalMessage("Failed to verify OTP.");
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
        <Text style={styles.heading}>OTP Screen</Text>
        <Text style={styles.label}>Submit OTP</Text>
        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#A4A4A4" style={styles.icon} />

          <TextInput
            placeholder="OTP"
            onChangeText={(text) => setOTP(text)}
            value={otp}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={handleOTP}>
          <View style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Submit OTP</Text>
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

export default OTPVerificationScreen;
