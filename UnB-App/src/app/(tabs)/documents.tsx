import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView, SFSymbol } from "expo-symbols";
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { useTextSize } from '@/contexts/TextSizeContext';

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
  },
  {
    title: "Histórico Escolar",
    description: "Todas as disciplinas cursadas",
    meta: "",
    color: "#7c3aed",
    symbolName: "books.vertical.fill"
  },
  {
    title: "Atestado de Matrícula",
    description: "Comprovante oficial de vínculo com a UnB",
    meta: "",
    color: "#b45309",
    symbolName: "person.text.rectangle.fill"
  },
  {
    title: "Passe Livre Estudantil",
    description: "Solicitação de gratuidade no transporte",
    meta: "",
    color: "#be185d",
    symbolName: "bus.fill"
  }
];

export default function Documentos() {
  const db = useSQLiteContext();
  const { getFontSize } = useTextSize();
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
      const result = await db.getAllAsync<DocumentRecord>('SELECT * FROM documents ORDER BY id ASC');
      setDocuments(result);
      const size = result.reduce((acc, curr) => acc + (curr.size || 0), 0);
      setTotalSize(size);
    } catch (error) {
      console.error('Erro ao carregar documentos', error);
    }
  }, [db, syncDefaultDocuments]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleBaixar = async (doc: DocumentRecord) => {
    if (doc.uri && doc.uri !== "") {
      Alert.alert('Aviso', 'O documento já foi baixado. Toque em "Ver" para acessá-lo.');
      return;
    }
    try {
      Alert.alert('Simulação de Download', 'Selecione um arquivo local para simular o download deste documento oficial do app da UnB.');
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = `${doc.id}_${asset.name || 'documento.pdf'}`;
        const newUri = FileSystem.documentDirectory + fileName;
        
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newUri
        });

        const extension = asset.name?.split('.').pop()?.toUpperCase() || 'ARQUIVO';
        const newMeta = `Baixado em ${new Date().toLocaleDateString('pt-BR')} · ${extension}`;
        
        const bindName = asset.name ?? 'documento.pdf';
        const bindMimeType = asset.mimeType ?? null;
        const bindSize = asset.size ?? null;

        await db.runAsync(
          'UPDATE documents SET uri = ?, fileName = ?, mimeType = ?, size = ?, meta = ? WHERE id = ?',
          [newUri, bindName, bindMimeType, bindSize, newMeta, doc.id]
        );

        loadDocuments();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível baixar/salvar o arquivo.');
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.subtitle, { fontSize: getFontSize(15) }]}>Seus arquivos acadêmicos</Text>
          <Text style={[styles.title, { fontSize: getFontSize(28) }]}>Documentos</Text>
        </View>

        <View style={styles.mainContent}>
          {/* StorageCard */}
          <TouchableOpacity
            style={styles.storageCard}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel="Ver documentos salvos"
            onPress={() => setShowSavedDocuments((visible) => !visible)}
          >
            <View style={styles.storageRow}>
              <View style={styles.storageIconContainer}>
                {Platform.OS === 'ios' ? (
                  <SymbolView name="folder.fill" size={24} tintColor="#1d8d28" />
                ) : (
                  <Text style={{ fontSize: 20 }}>📁</Text>
                )}
              </View>
              <View style={styles.storageTextContainer}>
                <Text style={[styles.storageTitle, { fontSize: getFontSize(17) }]}>Meus Documentos</Text>
                <Text style={[styles.storageSubtitle, { fontSize: getFontSize(14) }]}>{savedDocuments.length} {savedDocumentsLabel} · {formatSize(totalSize)} de 5 MB</Text>
              </View>
              <View style={styles.chevronIcon}>
                {Platform.OS === 'ios' ? (
                  <SymbolView name={showSavedDocuments ? "chevron.down" : "chevron.right"} size={20} tintColor="#314158" />
                ) : (
                  <Text style={{ fontSize: 20 }}>{showSavedDocuments ? "⌄" : ">"}</Text>
                )}
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100)}%` }]} />
            </View>
          </TouchableOpacity>

          {showSavedDocuments ? (
            <View style={styles.savedDocumentsPanel}>
              {savedDocuments.length > 0 ? (
                savedDocuments.map((doc) => (
                  <View key={doc.id} style={styles.savedDocumentRow}>
                    <View style={styles.savedDocumentInfo}>
                      <Text style={[styles.savedDocumentTitle, { fontSize: getFontSize(15) }]} numberOfLines={1}>
                        {doc.title}
                      </Text>
                      <Text style={[styles.savedDocumentMeta, { fontSize: getFontSize(13) }]} numberOfLines={1}>
                        {doc.fileName || doc.meta || "Arquivo salvo"} · {formatSize(doc.size || 0)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.shareButton}
                      activeOpacity={0.75}
                      accessibilityRole="button"
                      accessibilityLabel={`Compartilhar ${doc.title}`}
                      onPress={() => handleCompartilhar(doc)}
                    >
                      {Platform.OS === 'ios' ? (
                        <SymbolView name="square.and.arrow.up.fill" size={16} tintColor="#ffffff" />
                      ) : (
                        <Text style={{ fontSize: 14, color: "#ffffff" }}>↗</Text>
                      )}
                      <Text style={[styles.shareButtonText, { fontSize: getFontSize(13) }]}>Compartilhar</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptySavedDocumentsText, { fontSize: getFontSize(14) }]}>
                  Nenhum documento salvo ainda.
                </Text>
              )}
            </View>
          ) : null}

          {/* SearchBar */}
          <View style={styles.searchBar}>
            {Platform.OS === 'ios' ? (
              <SymbolView name="magnifyingglass" size={20} tintColor="#90a1b9" />
            ) : (
              <Text style={{ fontSize: 16 }}>🔍</Text>
            )}
            <TextInput
              style={[styles.searchInput, { fontSize: getFontSize(16) }]}
              placeholder="Buscar documento..."
              placeholderTextColor="#90a1b9"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Docs List */}
          <View style={styles.docsList}>
            {filteredDocs.map(doc => (
              <DocCard 
                key={doc.id}
                title={doc.title}
                description={doc.description}
                meta={doc.meta}
                color={doc.color}
                symbolName={doc.symbolName as any}
                hasFile={!!doc.uri && doc.uri !== ""}
                onBaixar={() => handleBaixar(doc)}
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

function DocCard({ title, description, meta, color, symbolName, hasFile = false, onBaixar, onVer, onRemover, getFontSize }: {
  title: string;
  description: string;
  meta: string;
  color: string;
  symbolName: SFSymbol;
  hasFile?: boolean;
  onBaixar: () => void;
  onVer: () => void;
  onRemover: () => void;
  getFontSize: (baseSize: number) => number;
}) {
  const btnColor = color;

  return (
    <View style={styles.docCard}>
      <View style={styles.docRow}>
        <View style={[styles.docIconContainer, { backgroundColor: `${color}1A` /* ~10% opacity */ }]}>
          {Platform.OS === 'ios' ? (
            <SymbolView name={symbolName} size={24} tintColor={color} />
          ) : (
            <Text style={{ fontSize: 20 }}>📄</Text>
          )}
        </View>
        <View style={styles.docTextContainer}>
          <Text style={[styles.docTitle, { fontSize: getFontSize(18) }]}>{title}</Text>
          <Text style={[styles.docDescription, { fontSize: getFontSize(14) }]}>{description}</Text>
        </View>
      </View>
      
      {meta ? <Text style={[styles.docMeta, { fontSize: getFontSize(13) }]}>{meta}</Text> : null}
      
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={[styles.actionBtnOutline, { borderColor: btnColor, opacity: hasFile ? 1 : 0.5 }]} 
          activeOpacity={!hasFile ? 1 : 0.7}
          onPress={!hasFile ? undefined : onVer}
        >
          {Platform.OS === 'ios' ? (
            <SymbolView name="eye.fill" size={16} tintColor={btnColor} />
          ) : (
            <Text style={{ fontSize: 14 }}>👁</Text>
          )}
          <Text style={[styles.actionBtnOutlineText, { color: btnColor, fontSize: getFontSize(15) }]}>Ver</Text>
        </TouchableOpacity>
        
        {hasFile ? (
          <TouchableOpacity 
            style={[styles.actionBtnSolid, { backgroundColor: "#ef4444" }]} 
            activeOpacity={0.7}
            onPress={onRemover}
          >
            {Platform.OS === 'ios' ? (
              <SymbolView name="trash.fill" size={16} tintColor="#fff" />
            ) : (
              <Text style={{ fontSize: 14 }}>🗑</Text>
            )}
            <Text style={[styles.actionBtnSolidText, { fontSize: getFontSize(15) }]}>Remover</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionBtnSolid, { backgroundColor: btnColor }]} 
            activeOpacity={0.7}
            onPress={onBaixar}
          >
            {Platform.OS === 'ios' ? (
              <SymbolView name="arrow.down.doc.fill" size={16} tintColor="#fff" />
            ) : (
              <Text style={{ fontSize: 14 }}>⬇</Text>
            )}
            <Text style={[styles.actionBtnSolidText, { fontSize: getFontSize(15) }]}>Baixar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
    fontSize: 15,
    color: "#62748e",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172b",
  },
  mainContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  storageCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.8,
    borderColor: "#a4f4cf",
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
    backgroundColor: "#ffffff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  storageTextContainer: {
    flex: 1,
    gap: 2,
  },
  storageTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0f172b",
  },
  storageSubtitle: {
    fontSize: 14,
    color: "#314158",
  },
  chevronIcon: {
    width: 24,
    alignItems: "center",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1d8d28",
    borderRadius: 5,
  },
  savedDocumentsPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 0.8,
    borderColor: "#e2e8f0",
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
    color: "#0f172b",
    fontWeight: "600",
  },
  savedDocumentMeta: {
    color: "#62748e",
  },
  shareButton: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#1d8d28",
  },
  shareButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  emptySavedDocumentsText: {
    color: "#62748e",
    paddingVertical: 8,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 0.8,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172b",
    height: "100%",
  },
  docsList: {
    gap: 16,
  },
  docCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.8,
    borderColor: "#e2e8f0",
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
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172b",
  },
  docDescription: {
    fontSize: 14,
    color: "#45556c",
  },
  docMeta: {
    fontSize: 13,
    fontWeight: "500",
    color: "#62748e",
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
