import { View, Text, StyleSheet } from "react-native";

export default function Donar() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Donar 💜</Text>
            <Text>Aquí irá el contenido para hacer donaciones</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", color: "#7c3aed" },
});
