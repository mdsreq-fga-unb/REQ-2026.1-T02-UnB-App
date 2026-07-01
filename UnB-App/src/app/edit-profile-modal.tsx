import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useTextSize } from "@/contexts/TextSizeContext";
import { useTheme } from '@/contexts/ThemeContext';
import ScalePressable from "@/components/ScalePressable";
import { SymbolView } from "expo-symbols";
import { toast } from 'react-native-pretty-toast';

export default function EditProfileModal() {
  const router = useRouter();
  const { userName, userMatricula, updateUserProfile } = useUserProfile();
  const { getFontSize } = useTextSize();
  const { colors } = useTheme();

  const [name, setName] = useState(userName || "");
  const [matricula, setMatricula] = useState(userMatricula || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(userName || "");
    setMatricula(userMatricula || "");
  }, [userName, userMatricula]);

  const handleSave = () => {
    if (!name.trim() || !matricula.trim()) {
      toast.error("Campos obrigatórios", { message: "Por favor, preencha seu nome e matrícula." });
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
              toast.error("Erro", { message: "Não foi possível salvar as alterações." });
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ScalePressable onPress={() => router.back()} style={styles.closeBtn}>
          <SymbolView name={{ ios: "xmark", android: "close", web: "close" } as any} size={24} tintColor={colors.textPrimary} fallback={<Text style={{fontSize: 20}}>X</Text>} />
        </ScalePressable>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontSize: getFontSize(22), color: colors.textPrimary }]}>Editar Perfil</Text>
          <Text style={[styles.subtitle, { fontSize: getFontSize(15), color: colors.textSecondary }]}>
            Atualize suas informações de identificação
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: getFontSize(14), color: colors.textSecondary }]}>NOME COMPLETO</Text>
          <TextInput
            style={[styles.input, { fontSize: getFontSize(16), backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="words"
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: getFontSize(14), color: colors.textSecondary }]}>MATRÍCULA</Text>
          <TextInput
            style={[styles.input, { fontSize: getFontSize(16), backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
            value={matricula}
            onChangeText={setMatricula}
            placeholder="Sua matrícula (ex: 200000000)"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            editable={!isSaving}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <ScalePressable
          style={[styles.saveButton, { backgroundColor: colors.primary }, isSaving && styles.saveButtonDisabled]}
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
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  closeBtn: {
    padding: 4,
    marginLeft: -4,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  titleContainer: {},
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
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
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  footer: {
    paddingBottom: Platform.OS === "ios" ? 16 : 0,
  },
  saveButton: {
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
