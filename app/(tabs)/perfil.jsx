import AdminPanelHome from "../../components/Admin/AdminPanelHome";
import PerfilPanelHome from "../../components/Perfil/PerfilPanelHome";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { router } from "expo-router";

export default function PerfilIndex() {
    const { user, loading } = useContext(UserContext);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/(auth)/iniciarsesion");
        }
    }, [loading, user]);

    if (loading || !user) return null;

    return user.rol === "administrador" ? <AdminPanelHome /> : <PerfilPanelHome />;
}
