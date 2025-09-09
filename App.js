import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppInitializer from "./AppInitializer";
import "./config/calendarLocale";

export default function App() {
  return (
    <NavigationContainer>
      <AppInitializer />
    </NavigationContainer>
  );
}