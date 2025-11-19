import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import AdminScreenWrapper from "./AdminScreenWrapper";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      const categoriesWithEdit = data.map((cat) => ({
        ...cat,
        isEditing: false,
        editName: cat.nombre,
      }));
      setCategories(categoriesWithEdit);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar las categorías",
      });
    }
  }

  async function handleCreate() {
    if (!newCategory.trim()) return;

    try {
      await createCategory(newCategory);
      setNewCategory("");

      Toast.show({
        type: "success",
        text1: "Categoría creada",
        text2: "La categoría fue agregada correctamente",
      });

      loadCategories();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo crear la categoría",
      });
    }
  }

  function confirmDelete(id) {
    Toast.show({
      type: "info",
      text1: "¿Eliminar categoría?",
      text2: "Esta acción no se puede deshacer.",
      autoHide: false,
      props: {
        buttons: [
          {
            text: "Cancelar",
            onPress: () => Toast.hide(),
            bg: "#e5e7eb",
            color: "#111827",
          },
          {
            text: "Eliminar",
            onPress: () => handleDelete(id),
            bg: "#ef4444",
            color: "white",
          },
        ],
      },
    });
  }

  async function handleDelete(id) {
    Toast.hide();

    try {
      await deleteCategory(id);
      Toast.show({
        type: "success",
        text1: "Categoría eliminada",
      });
      loadCategories();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo eliminar la categoría",
      });
    }
  }

  async function handleSaveEdit(cat) {
    if (!cat.editName.trim()) {
      Toast.show({
        type: "error",
        text1: "El nombre está vacío",
      });
      return;
    }

    try {
      await updateCategory(cat.id_categoria, cat.editName);

      Toast.show({
        type: "success",
        text1: "Categoría editada",
      });

      loadCategories();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo editar la categoría",
      });
    }
  }

  return (
    <AdminScreenWrapper title="Categorías">
      {/* Header */}
      <Text style={styles.header}>📂 Categorías</Text>

      {/* Crear categoría */}
      <View style={styles.addRow}>
        <TextInput
          placeholder="Nueva categoría"
          value={newCategory}
          onChangeText={setNewCategory}
          style={styles.newCategoryInput}
        />

        <TouchableOpacity onPress={handleCreate} style={styles.addButton}>
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {categories.length === 0 ? (
        <Text style={styles.empty}>No hay categorías aún.</Text>
      ) : (
        categories.map((cat) => (
          <View key={cat.id_categoria} style={styles.item}>
            {cat.isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  value={cat.editName}
                  onChangeText={(text) => {
                    setCategories(
                      categories.map((c) =>
                        c.id_categoria === cat.id_categoria
                          ? { ...c, editName: text }
                          : c
                      )
                    );
                  }}
                  style={styles.editInput}
                />

                <TouchableOpacity onPress={() => handleSaveEdit(cat)}>
                  <View style={styles.confirmButton}>
                    <Text style={styles.confirmText}>✓</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setCategories(
                      categories.map((c) =>
                        c.id_categoria === cat.id_categoria
                          ? { ...c, isEditing: false, editName: c.nombre }
                          : c
                      )
                    )
                  }
                >
                  <View style={styles.cancelButton}>
                    <Text style={styles.cancelText}>✕</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.itemName}>{cat.nombre}</Text>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() =>
                      setCategories(
                        categories.map((c) =>
                          c.id_categoria === cat.id_categoria
                            ? { ...c, isEditing: true }
                            : c
                        )
                      )
                    }
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => confirmDelete(cat.id_categoria)}
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))
      )}
    </AdminScreenWrapper>
  );

}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 24,
  },

  // ⬇️ Contenedor principal: solo un marco blanco, sin borde rosa
  container: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb", // gris suave
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#be185d",
    marginBottom: 24,
  },

  addRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    alignItems: "center",
  },

  newCategoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
  },

  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  addButtonText: {
    color: "white",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    color: "#6b7280",
    paddingVertical: 40,
  },

  // ⬇️ Ítems sin bordes de color, estilo más limpio
  item: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  itemName: {
    flex: 1,
    fontWeight: "600",
    color: "#1f2937",
  },

  itemActions: {
    flexDirection: "row",
    gap: 12,
  },

  editIcon: {
    fontSize: 18,
    color: "#2563eb",
    fontWeight: "600",
  },

  deleteIcon: {
    fontSize: 18,
    color: "#dc2626",
    fontWeight: "600",
  },

  editRow: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },

  editInput: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 12,
  },

  confirmButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  confirmText: {
    color: "white",
    fontWeight: "600",
  },

  cancelButton: {
    backgroundColor: "#9ca3af",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  cancelText: {
    color: "white",
    fontWeight: "600",
  },
});