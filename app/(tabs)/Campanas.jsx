import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import CardCampana from "../../components/CardCampana";
import { getCampaignsByCategory } from "../../services/campaign.service";
import { getCategories } from "../../services/category.service";

export default function Campanas() {
    const [campanas, setCampanas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Cargar categorías y campañas al montar
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, camps] = await Promise.all([
                    getCategories(),
                    getCampaignsByCategory(),
                ]);

                setCategories(cats);
                setCampanas(camps);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrado por categoría o búsqueda
    useEffect(() => {
        const fetchFiltered = async () => {
            try {
                setLoading(true);
                const filtered = await getCampaignsByCategory(
                    selectedCategory,
                    searchQuery
                );
                setCampanas(filtered);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery.length === 0 || searchQuery.length >= 3) {
            fetchFiltered();
        }
    }, [selectedCategory, searchQuery]);

    const selectedLabel =
        selectedCategory === ""
            ? "Todas las categorías"
            : categories.find((c) => c.id_categoria === selectedCategory)?.nombre ??
            "Todas las categorías";

    if (error)
        return (
            <View style={styles.center}>
                <Text style={{ color: "red" }}>Error: {error}</Text>
            </View>
        );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {/* Título */}
            <View style={styles.header}>
                <Text style={styles.title}>Campañas Activas</Text>
                <Text style={styles.subtitle}>
                    Explorá las campañas solidarias en curso y descubrí cómo podés ayudar.
                </Text>
            </View>

            {/* Input + Categorías */}
            <View style={styles.filtersContainer}>
                {/* 🔍 Input búsqueda */}
                <View style={styles.inputWrapper}>
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="#888"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder="Buscar campañas (mínimo 3 caracteres)"
                        placeholderTextColor="#6b7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.input}
                    />
                </View>

                {/* Dropdown categorías */}
                <View style={styles.dropdownWrapper}>
                    <Pressable
                        onPress={() => setIsOpen(!isOpen)}
                        style={styles.dropdownButton}
                    >
                        <Text style={styles.dropdownText}>{selectedLabel}</Text>
                        <Ionicons
                            name={isOpen ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="white"
                        />
                    </Pressable>

                    {isOpen && (
                        <View style={styles.dropdownMenu}>
                            <Pressable
                                onPress={() => {
                                    setSelectedCategory("");
                                    setIsOpen(false);
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text>Todas las categorías</Text>
                            </Pressable>

                            {categories.map((cat) => (
                                <Pressable
                                    key={cat.id_categoria}
                                    onPress={() => {
                                        setSelectedCategory(cat.id_categoria);
                                        setIsOpen(false);
                                    }}
                                    style={styles.dropdownItem}
                                >
                                    <Text>{cat.nombre}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {/* Lista de campañas */}
            {loading ? (
                <Text style={styles.noResults}>Cargando campañas...</Text>
            ) : !loading && campanas.length === 0 ? (
                <Text style={styles.noResults}>
                    No hay campañas que coincidan con tu búsqueda.
                </Text>
            ) : (
                <View style={styles.cardsContainer}>
                    {campanas.map((c) => (
                        <CardCampana key={c.id_campana} campana={c} />
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F8F5FF",
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 15,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#5b21b6",
    },
    subtitle: {
        marginTop: 8,
        color: "#374151",
        textAlign: "center",
    },

    filtersContainer: {
        width: "100%",
        marginBottom: 20,
    },

    inputWrapper: {
        position: "relative",
        marginBottom: 10,
    },
    searchIcon: {
        position: "absolute",
        left: 10,
        top: 13,
        zIndex: 10,
    },
    input: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        paddingLeft: 40,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    dropdownWrapper: {
        width: "100%",
    },
    dropdownButton: {
        backgroundColor: "#7c3aed",
        padding: 14,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownText: {
        color: "white",
        fontWeight: "600",
    },
    dropdownMenu: {
        marginTop: 6,
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        overflow: "hidden",
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    cardsContainer: {
        marginTop: 10,
        gap: 20,
    },

    noResults: {
        marginTop: 30,
        textAlign: "center",
        color: "#555",
    },
});
