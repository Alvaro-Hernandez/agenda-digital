import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/Ionicons";
import { iniciarSesionconFirebase } from "../services/auth";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    const result = await iniciarSesionconFirebase(email, password);

    if (result.success) {
      Alert.alert("Bienvenido", `Hola, ${result.user.nombre}`);
      navigation.navigate("Main");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/book.gif")}
        style={styles.gif}
        contentFit="contain"
      />

      <Text style={styles.title}>¡Bienvenido a EduPlanner!</Text>
      <Text style={styles.subtitle}>
        Organiza tus tareas, exámenes y horarios en un solo lugar
      </Text>

      <View style={styles.inputContainer}>
        <Icon
          name="mail-outline"
          size={24}
          color="#636e72"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico o usuario"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon
          name="lock-closed-outline"
          size={24}
          color="#636e72"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gif: {
    width: 150,
    height: 150,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 26,
    fontFamily: "SourGummy",
    color: "#2d3436",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "SourGummy",
    fontSize: 16,
    color: "#636e72",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    paddingHorizontal: 10,
    marginBottom: 15,
    elevation: 2,
    width: "100%",
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: "SourGummy",
    fontSize: 16,
    color: "#2d3436",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#0984e3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "SourGummy",
    color: "#ffffff",
    fontSize: 16,
  },

  linkContainer: {
    marginTop: 15,
  },
  linkText: {
    color: "#0984e3",
    fontFamily: "SourGummy",
    fontSize: 15,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default LoginPage;
