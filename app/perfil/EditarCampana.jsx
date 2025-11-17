import EditarCampana from "../../../components/Perfil/EditarCampana";
import { useLocalSearchParams } from "expo-router";

export default function EditarCampanaScreen() {
  const { id } = useLocalSearchParams(); // recibe ?id=123 desde el router

  return <EditarCampana id={id} />;
}
