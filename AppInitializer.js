import React from "react";
import { useFonts } from "expo-font";
import StackNavigator from "./navigation/StackNavigator";

const AppInitializer = () => {
  const [fontsLoaded] = useFonts({
    SourGummy: require("./assets/fonts/SourGummy.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <StackNavigator />;
};

export default AppInitializer;
