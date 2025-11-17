import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

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
    <ScrollView className="flex-1 p-6">
      <LinearGradient
        colors={["#fff0f5", "#ffe4e6"]}
        className="rounded-2xl p-6 border-2 border-pink-100 shadow-md"
      >
        <Text className="text-2xl font-bold text-pink-700 mb-6 flex-row">
          📂 Categorías
        </Text>

        {/* Form Nueva Categoría */}
        <View className="flex-row gap-2 mb-6">
          <TextInput
            placeholder="Nueva categoría"
            value={newCategory}
            onChangeText={setNewCategory}
            className="flex-1 border-2 border-pink-200 p-3 rounded-lg bg-white"
          />
          <TouchableOpacity style={{ flexShrink: 0 }} onPress={handleCreate}>
            <LinearGradient
              colors={["#ec4899", "#db2777"]}
              className="px-5 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">➕ Agregar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Lista */}
        {categories.length === 0 ? (
          <Text className="text-gray-500 text-center py-10">
            No hay categorías aún.
          </Text>
        ) : (
          categories.map((cat) => (
            <LinearGradient
              key={cat.id_categoria}
              colors={["#ffe4e6", "#fff1f2"]}
              className="p-4 rounded-xl border-2 border-pink-100 mb-3 flex-row justify-between items-center"
            >
              {cat.isEditing ? (
                <View className="flex-row flex-1 gap-2">
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
                    className="flex-1 border-2 border-pink-200 p-2 rounded-lg bg-white"
                  />

                  <TouchableOpacity onPress={() => handleSaveEdit(cat)}>
                    <View className="bg-green-500 px-3 py-2 rounded-lg">
                      <Text className="text-white font-semibold">✓</Text>
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
                    <View className="bg-gray-400 px-3 py-2 rounded-lg">
                      <Text className="text-white font-semibold">✕</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text className="font-semibold text-gray-800 flex-1">
                    {cat.nombre}
                  </Text>

                  <View className="flex-row gap-3">
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
                      <Text className="text-blue-600 font-semibold">✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => confirmDelete(cat.id_categoria)}
                    >
                      <Text className="text-red-600 font-semibold">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </LinearGradient>
          ))
        )}
      </LinearGradient>
    </ScrollView>
  );
}
