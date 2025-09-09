import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage.js";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabsNavigator = ({ route }) => {
  const user = route.params?.user;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configuración común para las tabs
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Inicio") {
            iconName = "home-outline";
          } else if (route.name === "Estadísticas") {
            iconName = "analytics-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Color cuando la tab está activa
        tabBarActiveTintColor: "#0984e3",
        // Color cuando no está activa
        tabBarInactiveTintColor: "gray",
        // Ocultamos el header superior
        headerShown: false,
      })}
    >
      {/* Tabs principales */}
      <Tab.Screen name="Inicio" component={HomePage} initialParams={{ user }} />
      {/* <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Settings" component={SettingsPage} /> */}
    </Tab.Navigator>
  );
};

export default TabsNavigator;