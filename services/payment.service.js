import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/payments`;

/**
 * Crea una preferencia de pago en Mercado Pago
 * @param {Object} paymentData - Datos del pago
 * @param {number} paymentData.amount - Monto de la donación
 * @param {string} paymentData.campaignTitle - Título de la campaña
 * @param {number} paymentData.campaignId - ID de la campaña
 * @returns {Promise<string>} preferenceId - ID de la preferencia de Mercado Pago
 */
export async function createPreference(paymentData) {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("No estás autenticado");

    const res = await fetch(`${API_URL}/create_preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Error al crear la preferencia de pago");

    return data.id; // El backend devuelve el ID de la preferencia
  } catch (error) {
    console.error("Error en createPreference (mobile):", error);
    throw new Error(error.message || "Error al conectar con el servidor");
  }
}
