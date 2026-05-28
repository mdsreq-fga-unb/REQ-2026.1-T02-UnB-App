import { Stack } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <AccessibilityButton />
    </View>
  );
}

function AccessibilityButton() {
  const insets = useSafeAreaInsets();
  
  return (
    <TouchableOpacity 
      style={[
        styles.accessibilityButton, 
        { top: Math.max(insets.top + 20, 60) }
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.accessibilityButtonText}>Aa</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accessibilityButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#1d8d28",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.6,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7.5,
    elevation: 5,
  },
  accessibilityButtonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
