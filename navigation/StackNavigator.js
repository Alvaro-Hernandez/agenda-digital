import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import TabsNavigator from "./TabsNavigator";
import CalendarioDigital from "../pages/CalendarioDigital";
import TareasRecordatorios from "../pages/TareasRecordatorios";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CalendarioDigital"
        component={CalendarioDigital}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TareasRecordatorios"
        component={TareasRecordatorios}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;