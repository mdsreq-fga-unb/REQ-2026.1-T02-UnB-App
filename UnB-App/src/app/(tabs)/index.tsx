import { Text, View, StyleSheet } from "react-native";
import { useTextSize } from "@/contexts/TextSizeContext";

export default function Index() {
  const { getFontSize } = useTextSize();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: getFontSize(16) }}>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
