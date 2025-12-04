import { useLocalSearchParams } from "expo-router";
import VerMasHist from "../../../components/Historias/VerMasHist";

export default function VerMasHistScreen() {
  const { id } = useLocalSearchParams();

  return <VerMasHist id={id} />;
}
