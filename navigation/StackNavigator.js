import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../pages/LoginPage";
import TabsNavigator from "./TabsNavigator";

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
        name="Main"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;