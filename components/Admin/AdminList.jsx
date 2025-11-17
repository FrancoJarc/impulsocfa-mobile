import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert,  StyleSheet,} from "react-native";
import { getAdmins, disableAdmin, updateAdmin } from "../../services/admin.service";
import Toast from "react-native-toast-message";


export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", apellido: "", email: "" });

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al cargar administradores",
        text2: "Intentá nuevamente",
      });
      console.error(error);
    }
  }
  function handleDisable(id) {
    Alert.alert(
      "Confirmación",
      "¿Seguro que querés deshabilitar este administrador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              await disableAdmin(id);

              Toast.show({
                type: "success",
                text1: "Administrador deshabilitado",
                text2: "El administrador fue desactivado correctamente",
              });

              loadAdmins();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error al deshabilitar",
                text2: "No se pudo completar la acción",
              });
              console.error(error);
            }
          },
        },
      ]
    );
  }

  function handleEditClick(admin) {
    setEditId(admin.id_usuario);
    setEditData({ nombre: admin.nombre, apellido: admin.apellido, email: admin.email });
  }

  async function handleSave(id) {
    try {
      await updateAdmin(id, editData);

      Toast.show({
        type: "success",
        text1: "Administrador actualizado",
        text2: "Los cambios fueron guardados correctamente 🙂",
      });

      setEditId(null);
      loadAdmins();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al actualizar",
        text2: "Revisá los datos e intentá nuevamente",
      });
      console.error(error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 Lista de Administradores</Text>

      {admins.length === 0 ? (
        <Text style={styles.noAdmins}>No hay administradores registrados.</Text>
      ) : (
        admins.map((admin) => (
          <View key={admin.id_usuario} style={styles.card}>
            <View style={styles.infoContainer}>
              {editId === admin.id_usuario ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={editData.nombre}
                    onChangeText={(text) => setEditData({ ...editData, nombre: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={editData.apellido}
                    onChangeText={(text) => setEditData({ ...editData, apellido: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={editData.email}
                    onChangeText={(text) => setEditData({ ...editData, email: text })}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.name}>
                    {admin.nombre} {admin.apellido}
                  </Text>
                  <Text style={styles.email}>{admin.email}</Text>
                </>
              )}

              <View style={styles.buttonRow}>
                {editId === admin.id_usuario ? (
                  <>
                    <TouchableOpacity
                      onPress={() => handleSave(admin.id_usuario)}
                      style={[styles.button, styles.saveButton]}
                    >
                      <Text style={styles.buttonText}>✓ Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setEditId(null)}
                      style={[styles.button, styles.cancelButton]}
                    >
                      <Text style={styles.cancelText}>✕ Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => handleEditClick(admin)}
                      style={[styles.button, styles.editButton]}
                    >
                      <Text style={styles.buttonText}>✏️ Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDisable(admin.id_usuario)}
                      style={[styles.button, styles.disableButton]}
                    >
                      <Text style={styles.buttonText}>🚫 Deshabilitar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F5FF",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6d28d9",
    marginBottom: 20,
    textAlign: "center",
  },

  noAdmins: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 40,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },

  infoContainer: {
    flexDirection: "column",
    gap: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },

  email: {
    fontSize: 15,
    color: "#6b7280",
  },

  input: {
    backgroundColor: "#f5f3ff",
    borderWidth: 1,
    borderColor: "#dcd4ff",
    borderRadius: 10,
    padding: 10,
    color: "#4c1d95",
  },

  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  editButton: {
    backgroundColor: "#3b82f6",
  },

  disableButton: {
    backgroundColor: "#ef4444",
  },

  saveButton: {
    backgroundColor: "#22c55e",
  },

  cancelButton: {
    backgroundColor: "#e5e7eb",
  },

  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },
});