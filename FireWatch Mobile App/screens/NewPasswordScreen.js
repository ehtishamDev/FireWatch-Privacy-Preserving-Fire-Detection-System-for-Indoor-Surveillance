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

const NewPasswordScreen = ({ route, navigation }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const isValidPassword = (password) => {
    const passwordRegex = /^[a-zA-Z0-9]+(_?[a-zA-Z0-9]+)?(@[a-zA-Z0-9]+(_?[a-zA-Z0-9]+)?)?$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setModalMessage("Passwords do not match");
      toggleModal();
      return;
    }
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      setModalMessage("Password must be at least 6 characters");
      toggleModal();
      return;
    }
    if (!isValidPassword(newPassword) || !isValidPassword(confirmPassword)) {
      setModalMessage("Invalid Format! Password start with letter or digit .");
      toggleModal();
      return;
    }

    const userData = {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    const userId = route.params.userId;

    const apiUrl = `http://192.168.67.208:3000/forgotPassword/${userId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setModalMessage("Password reset successfully");
          toggleModal();
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            navigation.navigate("SignIn");
          }, 3000);
        } else {
          setModalMessage(`Failed to reset password: ${data.error}`);
          toggleModal();
        }
      } else {
        setModalMessage("Failed to Reset password");
        toggleModal();
      }
    } catch (error) {
      console.error("Error Reset password: ", error);
      setModalMessage("Network error: Failed to Reset password");
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
        <Text style={styles.heading}>New Password</Text>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#A4A4A4" style={styles.icon} />
          <TextInput
            placeholder="New Password"
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
            style={styles.input}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? "eye" : "eye-slash"}
              type="font-awesome"
              size={24}
              color="#A4A4A4"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#A4A4A4" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            style={styles.input}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? "eye" : "eye-slash"}
              type="font-awesome"
              size={24}
              color="#A4A4A4"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handlePasswordChange}>
          <View style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Submit</Text>
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

export default NewPasswordScreen;
