import { addDoc } from "firebase/firestore";
// Registrar usuario en Firestore
export const registrarUsuarioEnFirebase = async ({ correoElectronico, nombre, usuario, contrasena }) => {
  try {
    // Verificar si ya existe un usuario con ese correo o usuario
    let q = query(
      collection(db, "Usuarios"),
      where("correoElectronico", "==", correoElectronico)
    );
    let querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, message: "El correo ya está registrado." };
    }
    q = query(
      collection(db, "Usuarios"),
      where("usuario", "==", usuario)
    );
    querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, message: "El usuario ya está registrado." };
    }
    // Crear usuario
    await addDoc(collection(db, "Usuarios"), {
      correoElectronico,
      nombre,
      usuario,
      contrasena,
    });
    return { success: true };
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return { success: false, message: "Error al registrar usuario." };
  }
};
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export const iniciarSesionconFirebase = async (identificador, password) => {
  try {
    // 1) Buscar por correo
    let q = query(
      collection(db, "Usuarios"),
      where("correoElectronico", "==", identificador),
      where("contrasena", "==", password)
    );

    let querySnapshot = await getDocs(q);

    // 2) Si no encontró nada, buscar por username
    if (querySnapshot.empty) {
      q = query(
        collection(db, "Usuarios"),
        where("usuario", "==", identificador),
        where("contrasena", "==", password)
      );
      querySnapshot = await getDocs(q);
    }

    if (querySnapshot.empty) {
      return { success: false, message: "Usuario o contraseña incorrectos" };
    }

    // Usuario encontrado
    const userData = querySnapshot.docs[0].data();
    return { success: true, user: userData };
  } catch (error) {
    console.error("Error al autenticar:", error);
    return { success: false, message: "Ocurrió un error en la autenticación" };
  }
};
