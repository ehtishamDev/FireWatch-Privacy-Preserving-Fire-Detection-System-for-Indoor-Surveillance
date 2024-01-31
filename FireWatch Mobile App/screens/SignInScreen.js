import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Icon } from "react-native-elements";
import Modal from "react-native-modal";

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isErrorModalVisible, setErrorModalVisible] = useState(false);

  const handleSignIn = () => {
    const userData = {
      identifier: username, // Use 'identifier' for both username and email
      password: password,
    };

    const apiEndpoint = "http://192.168.67.208:3000/signin";

    setUsernameError("");
    setPasswordError("");
    setLoginErrorMessage("");

    if (!username) {
      setUsernameError("Username or email is required");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    fetch(apiEndpoint, {
      method: "POST", // Use POST method for secure login
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        
        if (data.success) {
          console.log("User logged in successfully.");
          setUsernameError("");
          setPasswordError("");
          setLoginErrorMessage("");
          setUsername("");
          setPassword("");
          navigation.navigate("MainApp", { user: data.user });
        } else {
          setLoginErrorMessage(data.message);
          toggleErrorModal();
        }
      })
      .catch((error) => {
        console.log(error)
        setLoginErrorMessage(error.message);
        toggleErrorModal();
      });
  };


  const handleSignUpLink = () => {
    navigation.navigate("SignUp");
  };

  const toggleErrorModal = () => {
    setErrorModalVisible(!isErrorModalVisible);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <ImageBackground
      source={require('./logo/download.jpeg')}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>FireWatch</Text>
        <View style={styles.rectangle}>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subHeading}>Keeping you safe from fire</Text>
          <Text style={styles.label}>Username/Email</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="user"
              type="font-awesome"
              size={24}
              color="#A4A4A4"
              style={styles.icon}
            />
            <TextInput
              placeholder="@username@gmail.com"
              onChangeText={(text) => setUsername(text)}
              value={username}
              style={styles.input}
            />
          </View>
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#A4A4A4" style={styles.icon} />
            <TextInput
              placeholder="Password"
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
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignIn}>
            <View style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.signUpLink}>
            Already have an account?{" "}
            <TouchableOpacity onPress={handleSignUpLink}>
              <Text style={{
                textDecorationLine: "underline",
                color: "#37A372",
                fontSize: 16,
                marginBottom: 2,
                marginLeft: 5,
              }}>Sign Up</Text>
            </TouchableOpacity>
          </Text>
          <Modal isVisible={isErrorModalVisible}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{loginErrorMessage}</Text>
              <TouchableOpacity onPress={toggleErrorModal}>
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
    marginBottom: 50,
    marginTop:5,
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
  signUpLink: {
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
    textAlign:'right',
    textDecorationLine: "underline",
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

export default SignInScreen;
