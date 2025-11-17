import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/category.service";

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
      Alert.alert("❌ Error", "Error al cargar categorías");
    }
  }

  async function handleCreate() {
    if (!newCategory.trim()) return;
    try {
      await createCategory(newCategory);
      Alert.alert("✅ Éxito", "Categoría creada correctamente");
      setNewCategory("");
      loadCategories();
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "No se pudo crear la categoría");
    }
  }

  async function handleDelete(id) {
    Alert.alert(
      "Eliminar categoría",
      "¿Estás seguro que querés eliminar esta categoría?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(id);
              Alert.alert("🗑️ Eliminada", "Categoría eliminada correctamente");
              loadCategories();
            } catch (error) {
              console.error(error);
              Alert.alert("❌ Error", "No se pudo eliminar la categoría");
            }
          },
        },
      ]
    );
  }

  async function handleSaveEdit(cat) {
    if (!cat.editName.trim()) {
      Alert.alert("⚠️ Error", "El nombre no puede estar vacío");
      return;
    }
    try {
      await updateCategory(cat.id_categoria, cat.editName);
      Alert.alert("✏️ Éxito", "Categoría editada correctamente");
      loadCategories();
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "No se pudo editar la categoría");
    }
  }

  return (
    <ScrollView className="p-4 flex-1 bg-pink-50">
      <Text className="text-2xl font-bold text-pink-700 mb-4">📂 Categorías</Text>

      <View className="flex-row gap-2 mb-4">
        <TextInput
          placeholder="Nueva categoría"
          value={newCategory}
          onChangeText={setNewCategory}
          className="flex-1 border-2 border-pink-200 p-2 rounded-lg"
        />
        <TouchableOpacity
          onPress={handleCreate}
          className="bg-pink-500 px-4 py-2 rounded-lg ml-2"
        >
          <Text className="text-white font-semibold text-center">➕ Agregar</Text>
        </TouchableOpacity>
      </View>

      {categories.length === 0 ? (
        <Text className="text-gray-500 text-center py-8">No hay categorías aún.</Text>
      ) : (
        categories.map((cat) => (
          <View
            key={cat.id_categoria}
            className="bg-white p-4 rounded-xl mb-3 border border-pink-200 flex-row justify-between items-center"
          >
            {cat.isEditing ? (
              <View className="flex-row flex-1 gap-2">
                <TextInput
                  value={cat.editName}
                  onChangeText={(text) => {
                    setCategories(categories.map(c =>
                      c.id_categoria === cat.id_categoria ? { ...c, editName: text } : c
                    ));
                  }}
                  className="flex-1 border-2 border-pink-200 p-2 rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => handleSaveEdit(cat)}
                  className="bg-green-500 px-3 py-2 rounded-lg ml-1"
                >
                  <Text className="text-white font-semibold">✓ Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setCategories(categories.map(c =>
                      c.id_categoria === cat.id_categoria ? { ...c, isEditing: false, editName: c.nombre } : c
                    ));
                  }}
                  className="bg-gray-400 px-3 py-2 rounded-lg ml-1"
                >
                  <Text className="text-white font-semibold">✕ Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text className="font-semibold text-gray-800">{cat.nombre}</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setCategories(categories.map(c =>
                        c.id_categoria === cat.id_categoria ? { ...c, isEditing: true } : c
                      ));
                    }}
                  >
                    <Text className="text-blue-600 font-semibold">✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(cat.id_categoria)}>
                    <Text className="text-red-600 font-semibold">🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
