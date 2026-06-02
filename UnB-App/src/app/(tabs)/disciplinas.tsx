import { View, Text } from "react-native";
import { useTextSize } from "@/contexts/TextSizeContext";

export default function DisciplinasScreen() {
  const { getFontSize } = useTextSize();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: getFontSize(16) }}>Disciplinas</Text>
    </View>
  );
}
