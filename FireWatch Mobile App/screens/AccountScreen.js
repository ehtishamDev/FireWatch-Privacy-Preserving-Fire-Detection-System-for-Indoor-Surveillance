import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,

} from "react-native";
import { Icon } from "react-native-elements";

import Modal from "react-native-modal";

const AccountScreen = ({ route }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


  const { user } = route.params;
  useEffect(() => {
    setUsername(user.username);
    setPassword(user.password);
    setEmail(user.email);
  }, [user]);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  function isValidEmail(email) {
    const emailRegex = /^[a-z]{1}[a-z0-9]*_?[a-z0-9]+@gmail\.com$/;
    return emailRegex.test(email);
  }
  function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z]{1}[a-zA-Z0-9]*[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
  }

  function isValidPassword(password) {
    const passwordRegex = /^[a-zA-Z0-9]+(_?[a-zA-Z0-9]+)?(@[a-zA-Z0-9]+(_?[a-zA-Z0-9]+)?)?$/
;
    return passwordRegex.test(password);
  }
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const handleEditUser = () => {
   
  if (!isValidEmail(email)) {
    setModalMessage("Invalid email format");
    toggleModal();
    return;
  }
  
  if (!isValidUsername(username)) {
    setModalMessage("Invalid username. Start with a letter and use only letters & digits .");
;
    toggleModal();
    return;
  }
  if (username.length < 6) {
    setModalMessage("Username must be at least 6 characters");
    toggleModal();
    return;
  }

  if (!isValidPassword(password)) {
    setModalMessage("Invalid Format! Password start with letter or digit");
    toggleModal();
    return;
  }
  if (password.length < 6) {
    setModalMessage("Password must be at least 6 characters");
    toggleModal();
    return;
  }

    const userData = {
      email: email,
      username: username,
      password: password,
    };

    const userId = route.params.user.userId;
    const apiUrl = `http://10.135.48.134:3000/editUser/${userId}`;
    

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setModalMessage("User updated successfully.");
          toggleModal();
        } else {
          setModalMessage(`Failed to update user: ${data.error}`);
          toggleModal();
        }
      })
      .catch((error) => {
        console.error("Error editing user:", error);
        setModalMessage("Failed to update user. Please try again.");
        toggleModal();
      });
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.rectangle}>
      <Text style={styles.heading}>Edit Credirential</Text>
        <Text style={styles.subHeading}>Keeping you safe from fire</Text>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <Icon
            name="user"
            type="font-awesome"
            size={24}
            color="#A4A4A4"
            style={styles.icon}
          />
          <TextInput
            value={email}
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <Text style={styles.label}>Username</Text>
        <View style={styles.inputContainer}>
          <Icon
            name="user"
            type="font-awesome"
            size={24}
            color="#A4A4A4"
            style={styles.icon}
          />
          <TextInput
            value={username}
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <Text style={styles.label }>Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#A4A4A4" style={styles.icon} />
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
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

        <TouchableOpacity onPress={handleEditUser}>
          <View style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Edit and Save</Text>
          </View>
        </TouchableOpacity>
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
    height:"100%",
    padding: 24,
    borderTopLeftRadius: 35,   // Rounded top-left corner
    borderTopRightRadius: 35,
    backgroundColor: "#000000",
  },
  title: {
    alignSelf: "center",
    fontFamily: "Cochin",
    fontSize: 40,
    fontWeight: "600",
    color: "#EFEFEF",
    paddingTop: 50,
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
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    color: "#000000",
  },
  passwordStrengthText: {
    textAlign: "left",
    color: "green",
    marginLeft: "auto",
  },
  saveButton: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#37A372",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 27,
    letterSpacing: 0,
  },
  errorText: {
    fontFamily: "Cochin",
    fontSize: 14,
    fontWeight: "500",
    color: "#FF0000",
    marginBottom: 7,
  },
  successMessage: {
    fontFamily: "Cochin",
    fontSize: 14,
    fontWeight: "500",
    color: "#37A372",
    marginBottom: 7,
    marginLeft: 390,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalText: {
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  modalCloseText: {
    fontFamily: "Cochin",
    fontSize: 16,
    color: "#37A372",
    textDecorationLine: "underline",
  },
});

export default AccountScreen;
