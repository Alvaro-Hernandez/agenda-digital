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

const RegisterPage = ({ navigation }) => {
	const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	const handleRegister = async () => {
		if (!email || !username || !password || !confirmPassword) {
			Alert.alert("Error", "Por favor, completa todos los campos.");
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert("Error", "Las contraseñas no coinciden.");
			return;
		}
				// Lógica de registro con Firebase
				// Importar la función
				const { registrarUsuarioEnFirebase } = require("../services/auth");
				const result = await registrarUsuarioEnFirebase({
					correoElectronico: email,
					nombre: username, // Puedes cambiar esto si quieres un campo de nombre real
					usuario: username,
					contrasena: password,
				});
				if (result.success) {
					Alert.alert("Registro exitoso", "¡Tu cuenta ha sido creada!");
					navigation.navigate("Login");
				} else {
					Alert.alert("Error", result.message || "No se pudo registrar el usuario.");
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

			<Text style={styles.title}>Crea tu cuenta</Text>
			<Text style={styles.subtitle}>
				Regístrate para organizar tus tareas, exámenes y horarios
			</Text>

			<View style={styles.inputContainer}>
				<Icon name="mail-outline" size={24} color="#636e72" style={styles.icon} />
				<TextInput
					style={styles.input}
					placeholder="Correo electrónico"
					placeholderTextColor="#aaa"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Icon name="person-outline" size={24} color="#636e72" style={styles.icon} />
				<TextInput
					style={styles.input}
					placeholder="Usuario"
					placeholderTextColor="#aaa"
					value={username}
					onChangeText={setUsername}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Icon name="lock-closed-outline" size={24} color="#636e72" style={styles.icon} />
				<TextInput
					style={styles.input}
					placeholder="Contraseña"
					placeholderTextColor="#aaa"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Icon name="lock-closed-outline" size={24} color="#636e72" style={styles.icon} />
				<TextInput
					style={styles.input}
					placeholder="Confirmar contraseña"
					placeholderTextColor="#aaa"
					secureTextEntry
					value={confirmPassword}
					onChangeText={setConfirmPassword}
				/>
			</View>

			<TouchableOpacity style={styles.button} onPress={handleRegister}>
				<Text style={styles.buttonText}>Registrarse</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.linkContainer}
				onPress={() => navigation.navigate("Login")}
			>
				<Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
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

export default RegisterPage;
