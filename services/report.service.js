import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/reports`;

async function getToken() {
    return await AsyncStorage.getItem("access_token");
}

// Crear un reporte (requiere token)
export async function createReporte({ id_campana, motivo }) {
    const token = await getToken();

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_campana, motivo }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Error creando reporte");
    }

    return data;
}

// Obtener todos los reportes (admin)
export async function getAllReportes() {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Error obteniendo reportes");
    }

    return data;
}

// Obtener un reporte por ID
export async function getReporteById(id_reporte) {
    const res = await fetch(`${API_URL}/${id_reporte}`);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Error obteniendo reporte");
    }

    return data;
}

// Editar reporte
export async function updateReporte(id_reporte, updateData) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/${id_reporte}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Error actualizando reporte");
    }

    return data;
}

// Eliminar reporte
export async function deleteReporte(id_reporte) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/${id_reporte}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Error eliminando reporte");
    }

    return true;
}
