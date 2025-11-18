import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Perfil() {
    useEffect(() => {
        const load = async () => {
            const data = await AsyncStorage.getItem("user");

            if (!data) {
                router.replace("/iniciarsesion");
                return;
            }
            const user = JSON.parse(data);

            if (user.rol === "administrador") {
                router.replace("/(tabs)/adminPanel");
            } else {
                router.replace("/(tabs)/perfilPanel");
            }

        };

        load();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }
        }>
            <ActivityIndicator size="large" color="#7c3aed" />
        </View>
    );
}
