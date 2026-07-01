import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TextInput, Platform, Alert } from "react-native";
import ScalePressable from "@/components/ScalePressable";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView, SFSymbol } from "expo-symbols";
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { useTextSize } from '@/contexts/TextSizeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFocusEffect } from 'expo-router';

// Mapeamento: SF Symbol (iOS) → Material Symbol (Android / Web)
type CrossPlatformSymbol = {
  ios: SFSymbol;
  android: string;
  web: string;
};

const SYMBOL_MAP: Record<string, CrossPlatformSymbol> = {
  // Ícones de interface
  'folder.fill': { ios: 'folder.fill', android: 'folder', web: 'folder' },
  'chevron.down': { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  'chevron.right': { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  'square.and.arrow.up.fill': { ios: 'square.and.arrow.up.fill', android: 'share', web: 'share' },
  'magnifyingglass': { ios: 'magnifyingglass', android: 'search', web: 'search' },
  'eye.fill': { ios: 'eye.fill', android: 'visibility', web: 'visibility' },
  'trash.fill': { ios: 'trash.fill', android: 'delete', web: 'delete' },
  'arrow.up.doc.fill': { ios: 'arrow.up.doc.fill', android: 'upload', web: 'upload' },
  // Ícones dos documentos (DEFAULT_DOCS)
  'doc.text.fill': { ios: 'doc.text.fill', android: 'description', web: 'description' },
  'chart.bar.doc.horizontal': { ios: 'chart.bar.doc.horizontal', android: 'analytics', web: 'analytics' },
  'books.vertical.fill': { ios: 'books.vertical.fill', android: 'menu_book', web: 'menu_book' },
  'person.text.rectangle.fill': { ios: 'person.text.rectangle.fill', android: 'contact_page', web: 'contact_page' },
  'bus.fill': { ios: 'bus.fill', android: 'directions_bus', web: 'directions_bus' },
};

// Helper para obter o objeto cross-platform a partir de um nome de símbolo
function sym(name: string) {
  return (SYMBOL_MAP[name] ?? {}) as any;
}
// ─────────────────────────────────────────────────────────────────────────────

interface DocumentRecord {
  id: number;
  title: string;
  description: string;
  meta: string;
  color: string;
  symbolName: string;
  uri: string; // empty string means not downloaded
  fileName: string | null;
  mimeType: string | null;
  size: number | null;
}

const DEFAULT_DOCS = [
  {
    title: "Carteirinha Estudantil",
    description: "Identificação oficial do estudante",
    meta: "",
    color: "#b45309",
    symbolName: "person.text.rectangle.fill"
  },
  {
    title: "Histórico Escolar",
    description: "Todas as disciplinas cursadas",
    meta: "",
    color: "#7c3aed",
    symbolName: "books.vertical.fill"
  },
  {
    title: "Passe Livre Estudantil",
    description: "Solicitação de gratuidade no transporte",
    meta: "",
    color: "#be185d",
    symbolName: "bus.fill"
  },
  {
    title: "Boletim de Notas",
    description: "Notas das disciplinas do semestre 2026.1",
    meta: "",
    color: "#1d8d28",
    symbolName: "doc.text.fill"
  },
  {
    title: "Índice Acadêmico",
    description: "IRA, IECH e CR consolidados",
    meta: "",
    color: "#0e7490",
    symbolName: "chart.bar.doc.horizontal"
  }
];

export default function Documentos() {
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();
  const { colors, isDark } = useTheme();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [search, setSearch] = useState("");
  const [totalSize, setTotalSize] = useState(0);
  const [showSavedDocuments, setShowSavedDocuments] = useState(false);

  const syncDefaultDocuments = useCallback(async () => {
    const existing = await db.getAllAsync<DocumentRecord>('SELECT * FROM documents');
    const existingByTitle = new Map(existing.map((doc) => [doc.title, doc]));
    const defaultTitles = new Set(DEFAULT_DOCS.map((doc) => doc.title));

    for (const staleDoc of existing.filter((doc) => !defaultTitles.has(doc.title))) {
      await db.runAsync('DELETE FROM documents WHERE id = ?', [staleDoc.id]);
    }

    for (const doc of DEFAULT_DOCS) {
      const savedDoc = existingByTitle.get(doc.title);

      if (!savedDoc) {
        await db.runAsync(
          'INSERT INTO documents (title, description, meta, color, symbolName, uri) VALUES (?, ?, ?, ?, ?, ?)',
          [doc.title, doc.description, doc.meta, doc.color, doc.symbolName, ""]
        );
        continue;
      }

      await db.runAsync(
        `UPDATE documents
         SET description = ?,
             color = ?,
             symbolName = ?,
             meta = CASE WHEN uri = '' THEN ? ELSE meta END
         WHERE id = ?`,
        [doc.description, doc.color, doc.symbolName, doc.meta, savedDoc.id]
      );
    }
  }, [db]);

  const loadDocuments = useCallback(async () => {
    try {
      await syncDefaultDocuments();
      const result = await db.getAllAsync<DocumentRecord>('SELECT * FROM documents');

      // Ordenar com base na posição em DEFAULT_DOCS
      result.sort((a, b) => {
        const indexA = DEFAULT_DOCS.findIndex(d => d.title === a.title);
        const indexB = DEFAULT_DOCS.findIndex(d => d.title === b.title);
        // Colocar no final se por acaso não achar no DEFAULT_DOCS
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      });

      setDocuments(result);
      const size = result.reduce((acc, curr) => acc + (curr.size || 0), 0);
      setTotalSize(size);
    } catch (error) {
      console.error('Erro ao carregar documentos', error);
    }
  }, [db, syncDefaultDocuments]);

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, [loadDocuments])
  );

  const handleUpload = async (doc: DocumentRecord) => {
    if (doc.uri && doc.uri !== "") {
      Alert.alert('Aviso', 'O documento já foi enviado. Toque em "Ver" para acessá-lo.');
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        const { processAndSaveDocument } = await import('../../../utils/documentProcessor');

        const res = await processAndSaveDocument(
          db,
          asset.uri,
          asset.name,
          asset.mimeType,
          asset.size,
          doc.id // Garante que ele salva exatamente no slot que o usuário clicou (ex: Declaração de Aluno Regular)
        );

        if (res.success) {
          Alert.alert('Documento Processado', res.message);
        } else {
          const title = res.message.includes('salvo') ? 'Documento Armazenado' : 'Documento não Reconhecido';
          Alert.alert(title, res.message);
        }

        loadDocuments();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível fazer o upload do arquivo.');
    }
  };

  const handleVer = async (doc: DocumentRecord) => {
    if (!doc.uri || doc.uri === "") {
      Alert.alert('Aviso', 'Este documento ainda não foi baixado.');
      return;
    }

    try {
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(doc.uri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: doc.mimeType || 'application/pdf'
        });
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(doc.uri);
        } else {
          Alert.alert('Acesso', 'Não é possível abrir o arquivo neste dispositivo.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível visualizar o arquivo.');
    }
  };

  const handleCompartilhar = async (doc: DocumentRecord) => {
    if (!doc.uri || doc.uri === "") {
      Alert.alert('Aviso', 'Este documento ainda não foi baixado.');
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Compartilhar', 'Não é possível compartilhar arquivos neste dispositivo.');
        return;
      }

      await Sharing.shareAsync(doc.uri, {
        mimeType: doc.mimeType || undefined,
        dialogTitle: doc.title,
        UTI: doc.mimeType || undefined,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível compartilhar o arquivo.');
    }
  };

  const handleRemover = async (doc: DocumentRecord) => {
    try {
      if (doc.uri && doc.uri !== "") {
        const fileInfo = await FileSystem.getInfoAsync(doc.uri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(doc.uri);
        }
      }

      await db.runAsync(
        'UPDATE documents SET uri = ?, fileName = ?, mimeType = ?, size = ?, meta = ? WHERE id = ?',
        ["", null, null, null, "", doc.id]
      );

      loadDocuments();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível remover o arquivo.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );
  const savedDocuments = documents.filter((doc) => doc.uri && doc.uri !== "");
  const savedDocumentsLabel = savedDocuments.length === 1 ? "documento" : "documentos";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { fontSize: getFontSize(15), color: colors.textSecondary }]}>Seus arquivos acadêmicos</Text>
          <Text style={[styles.title, { fontSize: getFontSize(28), color: colors.textPrimary }]}>Documentos</Text>
        </View>

        <View style={styles.mainContent}>
          {/* StorageCard */}
          <ScalePressable
            style={[styles.storageCard, { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.1)' : '#f0fdf4', borderColor: isDark ? 'rgba(29, 141, 40, 0.3)' : '#a4f4cf' }]}
            accessibilityRole="button"
            accessibilityLabel="Ver documentos salvos"
            onPress={() => setShowSavedDocuments((visible) => !visible)}
          >
            <View style={styles.storageRow}>
              <View style={[styles.storageIconContainer, { backgroundColor: isDark ? 'rgba(29, 141, 40, 0.2)' : '#ffffff' }]}>
                {/* CORRIGIDO: objeto com ios + android em vez de ternário com emoji */}
                <SymbolView
                  name={sym('folder.fill')}
                  size={24}
                  tintColor={colors.primary}
                />
              </View>
              <View style={styles.storageTextContainer}>
                <Text style={[styles.storageTitle, { fontSize: getFontSize(17), color: colors.textPrimary }]}>Meus Documentos</Text>
                <Text style={[styles.storageSubtitle, { fontSize: getFontSize(14), color: colors.textSecondary }]}>{savedDocuments.length} {savedDocumentsLabel} · {formatSize(totalSize)} de 5 MB</Text>
              </View>
              <View style={styles.chevronIcon}>
                {/* CORRIGIDO: chevron condicional com Material Symbol no Android */}
                <SymbolView
                  name={sym(showSavedDocuments ? 'chevron.down' : 'chevron.right')}
                  size={20}
                  tintColor={colors.inactiveText}
                />
              </View>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={[styles.progressBarFill, { width: `${Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100)}%`, backgroundColor: colors.primary }]} />
            </View>
          </ScalePressable>

          {showSavedDocuments ? (
            <View style={[styles.savedDocumentsPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {savedDocuments.length > 0 ? (
                savedDocuments.map((doc) => (
                  <View key={doc.id} style={styles.savedDocumentRow}>
                    <View style={styles.savedDocumentInfo}>
                      <Text style={[styles.savedDocumentTitle, { fontSize: getFontSize(15), color: colors.textPrimary }]} numberOfLines={1}>
                        {doc.title}
                      </Text>
                      <Text style={[styles.savedDocumentMeta, { fontSize: getFontSize(13), color: colors.textSecondary }]} numberOfLines={1}>
                        {doc.fileName || doc.meta || "Arquivo salvo"} · {formatSize(doc.size || 0)}
                      </Text>
                    </View>
                    <ScalePressable
                      style={[styles.shareButton, { backgroundColor: colors.primary }]}
                      accessibilityRole="button"
                      accessibilityLabel={`Compartilhar ${doc.title}`}
                      onPress={() => handleCompartilhar(doc)}
                    >
                      {/* CORRIGIDO: share icon com Material Symbol no Android */}
                      <SymbolView
                        name={sym('square.and.arrow.up.fill')}
                        size={16}
                        tintColor="#ffffff"
                      />
                      <Text style={[styles.shareButtonText, { fontSize: getFontSize(13) }]}>Compartilhar</Text>
                    </ScalePressable>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptySavedDocumentsText, { fontSize: getFontSize(14), color: colors.textSecondary }]}>
                  Nenhum documento salvo ainda.
                </Text>
              )}
            </View>
          ) : null}

          {/* SearchBar */}
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* CORRIGIDO: lupa com Material Symbol no Android */}
            <SymbolView
              name={sym('magnifyingglass')}
              size={20}
              tintColor={colors.inactiveText}
            />
            <TextInput
              style={[styles.searchInput, { fontSize: getFontSize(16), color: colors.textPrimary }]}
              placeholder="Buscar documento..."
              placeholderTextColor={colors.textPlaceholder}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Docs List */}
          <View style={styles.docsList}>
            {filteredDocs.map((doc, index) => (
              <DocCard
                key={doc.id}
                index={index}
                title={doc.title}
                description={doc.description}
                meta={doc.meta}
                color={doc.color}
                symbolName={doc.symbolName}
                hasFile={!!doc.uri && doc.uri !== ""}
                onUpload={() => handleUpload(doc)}
                onVer={() => handleVer(doc)}
                onRemover={() => handleRemover(doc)}
                getFontSize={getFontSize}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DocCard({ title, description, meta, color, symbolName, hasFile = false, onUpload, onVer, onRemover, getFontSize, index }: {
  title: string;
  description: string;
  meta: string;
  color: string;
  symbolName: string; // era SFSymbol — agora string, pois vem do banco
  hasFile?: boolean;
  onUpload: () => void;
  onVer: () => void;
  onRemover: () => void;
  getFontSize: (baseSize: number) => number;
  index?: number;
}) {
  const { colors, isDark } = useTheme();
  // Se estiver no dark mode, vamos tornar a cor original mais suave ou manter a opacidade
  const btnColor = color; 

  return (
    <Animated.View 
      style={[styles.docCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.docRow}>
        <View style={[styles.docIconContainer, { backgroundColor: isDark ? `${color}33` : `${color}1A` }]}>
          {/* CORRIGIDO: ícone do documento com fallback para símbolo desconhecido */}
          <SymbolView
            name={sym(symbolName)}
            size={24}
            tintColor={color}
            fallback={<Text style={{ fontSize: 20 }}>📄</Text>}
          />
        </View>
        <View style={styles.docTextContainer}>
          <Text style={[styles.docTitle, { fontSize: getFontSize(18), color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.docDescription, { fontSize: getFontSize(14), color: colors.textSecondary }]}>{description}</Text>
        </View>
      </View>
      {meta ? <Text style={[styles.docMeta, { fontSize: getFontSize(13), color: colors.textSecondary }]}>{meta}</Text> : null}
      <View style={styles.actionsRow}>
        <ScalePressable
          style={[styles.actionBtnOutline, { borderColor: btnColor, opacity: hasFile ? 1 : 0.5 }]}
          onPress={!hasFile ? undefined : onVer}
        >
          {/* CORRIGIDO: olho com Material Symbol no Android */}
          <SymbolView name={sym('eye.fill')} size={16} tintColor={btnColor} />
          <Text style={[styles.actionBtnOutlineText, { color: btnColor, fontSize: getFontSize(15) }]}>Ver</Text>
        </ScalePressable>

        {hasFile ? (
          <ScalePressable
            style={[styles.actionBtnSolid, { backgroundColor: "#ef4444" }]}
            onPress={onRemover}
          >
            {/* CORRIGIDO: lixeira com Material Symbol no Android */}
            <SymbolView name={sym('trash.fill')} size={16} tintColor="#fff" />
            <Text style={[styles.actionBtnSolidText, { fontSize: getFontSize(15) }]}>Remover</Text>
          </ScalePressable>
        ) : (
          <ScalePressable
            style={[styles.actionBtnSolid, { backgroundColor: btnColor }]}
            onPress={onUpload}
          >
            {/* CORRIGIDO: upload com Material Symbol no Android */}
            <SymbolView name={sym('arrow.up.doc.fill')} size={16} tintColor="#fff" />
            <Text style={[styles.actionBtnSolidText, { fontSize: getFontSize(15) }]}>Upload</Text>
          </ScalePressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingRight: 80, // espaço para o botão flutuante Aa
    marginBottom: 24,
  },
  subtitle: {
    fontWeight: "400",
    marginBottom: 4,
  },
  title: {
    fontWeight: "bold",
  },
  mainContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  storageCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.8,
    gap: 16,
  },
  storageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  storageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  storageTextContainer: {
    flex: 1,
    gap: 2,
  },
  storageTitle: {
    fontWeight: "600",
  },
  storageSubtitle: {
    fontWeight: "400",
  },
  chevronIcon: {
    width: 24,
    alignItems: "center",
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  savedDocumentsPanel: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 0.8,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
  },
  savedDocumentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  savedDocumentInfo: {
    flex: 1,
    gap: 2,
  },
  savedDocumentTitle: {
    fontWeight: "600",
  },
  savedDocumentMeta: {
    fontWeight: "400",
  },
  shareButton: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  shareButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  emptySavedDocumentsText: {
    paddingVertical: 8,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: "100%",
  },
  docsList: {
    gap: 16,
  },
  docCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.8,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  docIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  docTextContainer: {
    flex: 1,
    gap: 4,
  },
  docTitle: {
    fontWeight: "600",
  },
  docDescription: {
    fontWeight: "400",
  },
  docMeta: {
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    height: 48,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.6,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnOutlineText: {
    fontSize: 15,
    fontWeight: "600",
  },
  actionBtnSolid: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    gap: 8,
  },
  actionBtnSolidText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});
