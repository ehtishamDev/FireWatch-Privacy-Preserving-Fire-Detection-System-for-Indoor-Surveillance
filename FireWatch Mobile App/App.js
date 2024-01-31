import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ForgotPasswordScreen from "./screens/ForgotPassswordScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import HistoryScreen from "./screens/HistoryScreen";
import AccountScreen from "./screens/AccountScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp({ route }) {
  const { user } = route.params;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Camera") {
            iconName = focused ? "camera" : "camera-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          }
          const iconColor = focused ? "#000000" : "#37A372";

          return <Icon name={iconName} size={size} color={iconColor} />;
        },
        tabBarLabelStyle: {
          color: "#000000", // Set the tab label color to black
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="NewPassword"
          component={NewPasswordScreen}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
