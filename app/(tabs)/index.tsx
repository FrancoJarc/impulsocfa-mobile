import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
// Asegúrate de que la ruta a tu servicio es correcta
import { logout } from '../../services/auth.service';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Llama a tu función de servicio para limpiar el token local y notificar al backend
      await logout();

      Toast.show({
        type: 'success',
        text1: 'Sesión cerrada',
        visibilityTime: 2000,
      });

      // Al cerrar sesión, dirigimos al punto de chequeo inicial (app/index.jsx)
      // Esto forzará la re-evaluación del estado y la redirección al login.
      router.replace('/');

    } catch (error) {
      console.error("Error durante el logout:", error);
      Toast.show({
        type: 'error',
        text1: 'Error al cerrar sesión',
        text2: "Por favor, intenta de nuevo.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área Principal (Home)</Text>
      <Text style={styles.subtitle}>Has iniciado sesión. Este contenido está protegido.</Text>
      <View style={styles.contentCard}>
        <Text style={styles.contentText}>Aquí es donde iría el contenido principal de tu aplicación (feeds, dashboard, etc.).</Text>
        <Button title="Cerrar Sesión" onPress={handleLogout} color="#dc2626" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f3ff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6d28d9',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 40,
    textAlign: 'center',
  },
  contentCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  }
});