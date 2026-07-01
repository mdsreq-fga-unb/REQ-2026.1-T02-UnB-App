import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useTextSize } from "@/contexts/TextSizeContext";
import ScalePressable from "@/components/ScalePressable";

export default function EditProfileModal() {
  const router = useRouter();
  const { userName, userMatricula, updateUserProfile } = useUserProfile();
  const { getFontSize } = useTextSize();

  const [name, setName] = useState(userName || "");
  const [matricula, setMatricula] = useState(userMatricula || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(userName || "");
    setMatricula(userMatricula || "");
  }, [userName, userMatricula]);

  const handleSave = () => {
    if (!name.trim() || !matricula.trim()) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha seu nome e matrícula.");
      return;
    }

    Alert.alert(
      "Confirmar alteração",
      "Tem certeza que deseja salvar os novos dados de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          style: "default",
          onPress: async () => {
            setIsSaving(true);
            try {
              await updateUserProfile(name.trim(), matricula.trim());
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível salvar as alterações.");
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: getFontSize(22) }]}>Editar Perfil</Text>
        <Text style={[styles.subtitle, { fontSize: getFontSize(15) }]}>
          Atualize suas informações de identificação
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: getFontSize(14) }]}>NOME COMPLETO</Text>
          <TextInput
            style={[styles.input, { fontSize: getFontSize(16) }]}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: getFontSize(14) }]}>MATRÍCULA</Text>
          <TextInput
            style={[styles.input, { fontSize: getFontSize(16) }]}
            value={matricula}
            onChangeText={setMatricula}
            placeholder="Sua matrícula (ex: 200000000)"
            placeholderTextColor="#94a3b8"
            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            editable={!isSaving}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <ScalePressable
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={[styles.saveButtonText, { fontSize: getFontSize(17) }]}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </ScalePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: "bold",
    color: "#0f172b",
    marginBottom: 8,
  },
  subtitle: {
    color: "#62748e",
    lineHeight: 22,
  },
  form: {
    gap: 24,
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontWeight: "600",
    color: "#62748e",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#0f172b",
  },
  footer: {
    paddingBottom: Platform.OS === "ios" ? 16 : 0,
  },
  saveButton: {
    backgroundColor: "#1d8d28",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
