import VerMasCampana from "../../../components/Perfil/VerMasCampana";
import { useLocalSearchParams } from "expo-router";

export default function VerMasCampanaScreen() {
  const { id } = useLocalSearchParams(); 
  return <VerMasCampana campaignId={id} />;
}
