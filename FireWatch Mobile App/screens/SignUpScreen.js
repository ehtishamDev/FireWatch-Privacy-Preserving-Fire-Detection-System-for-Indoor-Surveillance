import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,ScrollView 
} from "react-native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";
import zxcvbn from "zxcvbn";



const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    const passwordInfo = zxcvbn(newPassword);
    setPasswordStrength(passwordInfo.score);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSignInLink = () => {
    navigation.navigate("SignIn");
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
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
    const passwordRegex = /^[a-zA-Z0-9]+(_?[a-zA-Z0-9]+)?(@[a-zA-Z0-9]+(_?[a-zA-Z0-9]+)?)?$/;
    return passwordRegex.test(password);
  }
  
  
  const handleSignUp = () => {
  const userData = {
    email: email,
    username: username,
    password: password,
  };

  const apiEndpoint = "http://192.168.67.208:3000/register";

  
  

  if (!email) {
    setModalMessage("Email is required");
    toggleModal();
    return;
  }
  if (!isValidEmail(email)) {
    setModalMessage("Invalid email format");
    toggleModal();
    return;
  }
  if (!username) {
    setModalMessage("Username is required");
    toggleModal();
    return;
  }
  if (username.length < 6) {
    setModalMessage("Username must be at least 6 characters");
    toggleModal();
    return;
  }
  if (!isValidUsername(username)) {
    setModalMessage("Invalid username. Start with a letter and use only letters & digits .");
    toggleModal();
    return;
  }
  

  if (!password) {
    setModalMessage("Password is required");
    toggleModal();
    return;
  }
  if (password.length < 6) {
    setModalMessage("Password must be at least 6 characters");
    toggleModal();
    return;
  }
  if (!isValidPassword(password)) {
    setModalMessage("Invalid Format! Password start with letter or digit .");
    toggleModal();
    return;
  }
  

  fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Registration successful!") {
        setModalMessage("Request send successful!");
        setEmail("");
        setUsername("");
        setPassword("");
      } else  {
        setMessage("Email is already in use"); 
        
      }
    })
    .catch((error) => {
      console.error("Error during sign up:", error);
      setModalMessage("An error occurred during sign up"); 
    })
    .finally(() => {
      toggleModal(); 
    });
};


  return (
    <ImageBackground
      source={require('./logo/download.jpeg')}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>FireWatch</Text>
      <View style={styles.rectangle}>
        <Text style={styles.heading}>Get Started</Text>
        <Text style={styles.subHeading}>Join the Fire Safety Network</Text>
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
            placeholder="@username"
            onChangeText={(text) => setUsername(text)}
            value={username}
            style={styles.input}
          />
        </View>
       
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#A4A4A4" style={styles.icon} />
          <TextInput
            placeholder="Password"
            onChangeText={handlePasswordChange}
            value={password}
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
          {passwordStrength > 0 && (
            <Text style={styles.passwordStrengthText}>
              {
                ["-Weak", "--Fair", "---Good", "---Strong"][
                  passwordStrength - 1
                ]
              }
            </Text>
          )}
        </View>
        
        <TouchableOpacity onPress={handleSignUp}>
          <View style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.signInLink}>
          Already have an account?
          <TouchableOpacity onPress={handleSignInLink}>
            <Text
              style={{
                textDecorationLine: "underline",
                color: "#37A372",
                fontSize: 16,
                marginBottom: 2,
                marginLeft: 5,
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </Text>

        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    justifyContent: "center",
    resizeMode:'cover'
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rectangle: {
    width: "80%",
    padding: 24,
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    textAlign:"center"
  },
  subHeading: {
    fontFamily: "Cochin",
    fontSize: 14,
    fontWeight: "500",
    color: "#EFEFEF",
    marginTop:5,
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
  signUpButton: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#37A372",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 27,
    letterSpacing: 0,
  },
  signInLink: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "Cochin",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 27,
    letterSpacing: 0,
    marginTop: 20,
  },
  forgotPasswordLink: {
    textAlign: "center",
    color: "#37A372",
    fontFamily: "Cochin",
    fontSize: 13,
    fontWeight: "400",
    marginTop: -10,
    marginLeft: 150,
    marginBottom: -5,
    textAlign:'right'
  },
  errorText: {
    fontFamily: "Cochin",
    fontSize: 14,
    fontWeight: "500",
    color: "#FF0000",
    marginBottom: 7,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#37A372",
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
