import AdminPanelHome from "../../components/Admin/AdminPanelHome";
import PerfilPanelHome from "../../components/Perfil/PerfilPanelHome";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { router } from "expo-router";
import ValidadorPanelHome from "../../components/Validador/ValidadorPanelHome";

export default function PerfilIndex() {
    const { user, loading } = useContext(UserContext);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/(auth)/iniciarsesion");
        }
    }, [loading, user]);

    if (loading || !user) return null;

    if (user.rol === "administrador") return <AdminPanelHome />;
    if (user.rol === "validador") return <ValidadorPanelHome />;

    return <PerfilPanelHome />;
}
