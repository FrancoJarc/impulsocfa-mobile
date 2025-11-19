import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert,  StyleSheet,} from "react-native";
import { getAdmins, disableAdmin, updateAdmin } from "../../services/admin.service";
import Toast from "react-native-toast-message";
import AdminScreenWrapper from "./AdminScreenWrapper";

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
    <AdminScreenWrapper>
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
    </AdminScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#6d28d9",
  },

  noAdmins: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 40,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: "#e0e7ff",

    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },

  infoContainer: {
    flexDirection: "column",
    gap: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4c1d95",
  },

  email: {
    fontSize: 16,
    color: "#6d28d9",
  },

  input: {
    backgroundColor: "#f5f3ff",
    borderWidth: 1,
    borderColor: "#dcd4ff",
    borderRadius: 12,
    padding: 12,
    color: "#4c1d95",
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
    flexWrap: "wrap",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    flexGrow: 1,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },

  editButton: {
    backgroundColor: "#7c3aed",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});
