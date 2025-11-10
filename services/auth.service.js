import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth`;

// 🧾 Registro normal
export async function registerUser(userData) {
    const formData = new FormData();

    for (const key in userData) {
        if (userData[key] !== null && userData[key] !== "") {
            formData.append(key, userData[key]);
        }
    }

    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrar usuario");

    return data;
}

// 🔐 Login normal
export async function login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
        throw new Error(data.error || "Error al iniciar sesión");
    }

    // Guardar en AsyncStorage (reemplaza localStorage)
    await AsyncStorage.setItem("access_token", data.access_token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    await AsyncStorage.setItem("user_role", data.user.rol);

    return data;
}

// 🔑 Obtener llave maestra
export async function getLlaveMaestra() {
    const token = await AsyncStorage.getItem("access_token");

    const res = await fetch(`${API_URL}/usuario/llave`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al obtener la llave maestra");

    return data;
}

// 🔄 Cambiar contraseña
export async function changePassword(llave_maestra, newPassword) {
    const token = await AsyncStorage.getItem("access_token");

    const res = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ llave_maestra, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al cambiar la contraseña");

    return data;
}

// 🚪 Logout
export async function logout() {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
        // Si no hay token, simplemente limpiamos lo que pueda haber y terminamos.
        await AsyncStorage.multiRemove(["access_token", "user", "user_role"]);
        return { message: "Sesión ya cerrada." };
    }

    const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        // En caso de error de red o de API, aún así debemos limpiar el cliente.
        console.warn("Advertencia: Error de logout en API, limpiando localmente:", data.error);
    }

    await AsyncStorage.multiRemove(["access_token", "user", "user_role"]);

    return data;
}


export async function checkSession() {
    const token = await AsyncStorage.getItem("access_token");
    const userString = await AsyncStorage.getItem("user");

    // Retorna true si ambos existen
    return !!token && !!userString;
}