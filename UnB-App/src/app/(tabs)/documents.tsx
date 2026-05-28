import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView, SFSymbol } from "expo-symbols";

export default function Documentos() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Seus arquivos acadêmicos</Text>
          <Text style={styles.title}>Documentos</Text>
        </View>

        <View style={styles.mainContent}>
          {/* StorageCard */}
          <View style={styles.storageCard}>
            <View style={styles.storageRow}>
              <View style={styles.storageIconContainer}>
                {Platform.OS === 'ios' ? (
                  <SymbolView name="folder.fill" size={24} tintColor="#1d8d28" />
                ) : (
                  <Text style={{ fontSize: 20 }}>📁</Text>
                )}
              </View>
              <View style={styles.storageTextContainer}>
                <Text style={styles.storageTitle}>Meus Documentos</Text>
                <Text style={styles.storageSubtitle}>5 documentos · 2,4 MB de 5 MB</Text>
              </View>
              <View style={styles.chevronIcon}>
                {Platform.OS === 'ios' ? (
                  <SymbolView name="chevron.right" size={20} tintColor="#314158" />
                ) : (
                  <Text style={{ fontSize: 20 }}>›</Text>
                )}
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: '48%' }]} />
            </View>
          </View>

          {/* SearchBar */}
          <View style={styles.searchBar}>
            {Platform.OS === 'ios' ? (
              <SymbolView name="magnifyingglass" size={20} tintColor="#90a1b9" />
            ) : (
              <Text style={{ fontSize: 16 }}>🔍</Text>
            )}
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar documento..."
              placeholderTextColor="#90a1b9"
            />
          </View>

          {/* Docs List */}
          <View style={styles.docsList}>
            <DocCard 
              title="Boletim de Notas"
              description="Notas das disciplinas do semestre 2026.1"
              meta="Atualizado em 18/03/2026 · PDF"
              color="#1d8d28"
              symbolName="doc.text.fill"
            />
            <DocCard 
              title="Índice Acadêmico"
              description="IRA, IECH e CR consolidados"
              meta="Emitido em 10/03/2026 · PDF"
              color="#0e7490"
              symbolName="chart.bar.doc.horizontal"
            />
            <DocCard 
              title="Histórico Escolar"
              description="Todas as disciplinas cursadas"
              meta="Emitido em 02/03/2026 · PDF"
              color="#7c3aed"
              symbolName="books.vertical.fill"
            />
            <DocCard 
              title="Atestado de Matrícula"
              description="Comprovante oficial de vínculo com a UnB"
              meta="Válido até 31/07/2026 · PDF"
              color="#b45309"
              symbolName="person.text.rectangle.fill"
            />
            <DocCard 
              title="Passe Livre Estudantil"
              description="Solicitação de gratuidade no transporte"
              meta="Em análise · Solicitado 15/03/2026"
              color="#be185d"
              symbolName="bus.fill"
              disabled
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DocCard({ title, description, meta, color, symbolName, disabled = false }: {
  title: string;
  description: string;
  meta: string;
  color: string;
  symbolName: SFSymbol;
  disabled?: boolean;
}) {
  const bgOpacity = disabled ? 0.05 : 0.1;
  const opacityStyle = disabled ? { opacity: 0.5 } : {};
  const btnColor = disabled ? "#cbd5e1" : color;

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
          <Text style={styles.docTitle}>{title}</Text>
          <Text style={styles.docDescription}>{description}</Text>
        </View>
      </View>
      
      <Text style={styles.docMeta}>{meta}</Text>
      
      <View style={[styles.actionsRow, opacityStyle]}>
        <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: btnColor }]} activeOpacity={disabled ? 1 : 0.7}>
          {Platform.OS === 'ios' ? (
            <SymbolView name="eye.fill" size={16} tintColor={btnColor} />
          ) : (
            <Text style={{ fontSize: 14 }}>👁</Text>
          )}
          <Text style={[styles.actionBtnOutlineText, { color: btnColor }]}>Ver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtnSolid, { backgroundColor: btnColor }]} activeOpacity={disabled ? 1 : 0.7}>
          {Platform.OS === 'ios' ? (
            <SymbolView name="arrow.down.doc.fill" size={16} tintColor="#fff" />
          ) : (
            <Text style={{ fontSize: 14 }}>⬇</Text>
          )}
          <Text style={styles.actionBtnSolidText}>Baixar</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
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
