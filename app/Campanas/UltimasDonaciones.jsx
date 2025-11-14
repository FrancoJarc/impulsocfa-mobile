import UltimasDonaciones from "../../components/Campanas/UltimasDonaciones";

export default function UltimasDonacionesScreen({ params }) {
    return <UltimasDonaciones id_campana={params.id_campana} />;
}