import { View, Text } from "react-native";
import { useTextSize } from "@/contexts/TextSizeContext";

export default function AjustesScreen() {
  const { getFontSize } = useTextSize();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: getFontSize(16) }}>Ajustes</Text>
    </View>
  );
}
