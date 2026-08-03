import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  BarChart2,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileCode,
  Play,
  RefreshCw,
  Sparkles,
  Trophy,
  Upload,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ResponsiveShell } from "@/components/responsive-shell";
import { AppColors, Gradients, Radii } from "@/constants/theme";
import { awardXP, enqueueCelebration } from "@/services/gamification.service";
import {
  AnalysisDataset,
  ModelBattleResult,
  SAMPLE_DATASETS,
  parseCSV,
  prepareMatrix,
  runClassificationBattle,
  runClusteringBattle,
  runRegressionBattle,
} from "@/services/ml-engine";

export default function RealDataLabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"samples" | "upload" | "paste">("samples");
  const [customCsvText, setCustomCsvText] = useState("");
  const [dataset, setDataset] = useState<AnalysisDataset | null>(() => {
    try {
      return parseCSV(SAMPLE_DATASETS[0].csv, SAMPLE_DATASETS[0].name);
    } catch {
      return null;
    }
  });

  const [selectedTarget, setSelectedTarget] = useState<string>(
    dataset?.summary.suggestedTarget || ""
  );
  const [selectedProblemType, setSelectedProblemType] = useState<
    "regression" | "classification" | "clustering"
  >(dataset?.summary.detectedProblemType || "regression");

  const [isRunningBattle, setIsRunningBattle] = useState(false);
  const [battleResult, setBattleResult] = useState<ModelBattleResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [xpAwarded, setXpAwarded] = useState(false);

  // Parse custom dataset
  const handleLoadCsv = (rawCsv: string, name: string) => {
    try {
      setErrorMessage(null);
      const parsed = parseCSV(rawCsv, name);
      setDataset(parsed);
      setSelectedTarget(parsed.summary.suggestedTarget);
      setSelectedProblemType(parsed.summary.detectedProblemType);
      setBattleResult(null);
      setXpAwarded(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to parse CSV file.");
    }
  };

  // Web File Upload Handler
  const handleFileUpload = (event: any) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        handleLoadCsv(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  // Run ML Algorithm Battle
  const handleRunBattle = async () => {
    if (!dataset) return;
    setIsRunningBattle(true);
    setErrorMessage(null);

    try {
      // Small pause for smooth UI feedback
      await new Promise((r) => setTimeout(r, 200));

      const numericCols = dataset.summary.numericColumns;
      if (numericCols.length === 0) {
        throw new Error("Dataset contains no numeric columns to run algorithms.");
      }

      let result: ModelBattleResult;

      if (selectedProblemType === "clustering") {
        const { X } = prepareMatrix(dataset, numericCols);
        result = runClusteringBattle(X, 3);
      } else {
        const featureCols = numericCols.filter((c) => c !== selectedTarget);
        if (featureCols.length === 0) {
          throw new Error("Select at least 1 feature column separate from the target column.");
        }
        const { X, y } = prepareMatrix(dataset, featureCols, selectedTarget);

        if (selectedProblemType === "regression") {
          result = runRegressionBattle(X, y);
        } else {
          result = runClassificationBattle(X, y);
        }
      }

      setBattleResult(result);

      // Award XP for running real dataset analysis
      if (!xpAwarded) {
        const xpRes = await awardXP(25);
        setXpAwarded(true);
        if (xpRes) {
          await enqueueCelebration({ type: "xp", amount: 25, reason: "Analyzed Real Dataset" });
          if (xpRes.leveledUp) {
            await enqueueCelebration({ type: "level_up", level: xpRes.after.level });
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error running algorithms on dataset.");
    } finally {
      setIsRunningBattle(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ResponsiveShell>
        {/* Header Hero */}
        <LinearGradient colors={Gradients.hero} style={styles.hero}>
          <View style={styles.heroBadge}>
            <Database size={16} color="#FFF" />
            <Text style={styles.heroBadgeText}>Real Data Laboratory</Text>
          </View>
          <Text style={styles.heroTitle}>Dataset Analyzer & ML Battle</Text>
          <Text style={styles.heroSub}>
            Upload real CSV datasets, inspect row/column profiling, auto-detect problem types, and
            race real gradient descent & k-means algorithms on live numeric data.
          </Text>
        </LinearGradient>

        {/* Dataset Source Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "samples" && styles.activeTabButton]}
            onPress={() => setActiveTab("samples")}
          >
            <Sparkles size={14} color={activeTab === "samples" ? "#FFF" : AppColors.textMuted} />
            <Text style={[styles.tabText, activeTab === "samples" && styles.activeTabText]}>
              Built-in Datasets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "upload" && styles.activeTabButton]}
            onPress={() => setActiveTab("upload")}
          >
            <Upload size={14} color={activeTab === "upload" ? "#FFF" : AppColors.textMuted} />
            <Text style={[styles.tabText, activeTab === "upload" && styles.activeTabText]}>
              Upload CSV
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "paste" && styles.activeTabButton]}
            onPress={() => setActiveTab("paste")}
          >
            <FileCode size={14} color={activeTab === "paste" ? "#FFF" : AppColors.textMuted} />
            <Text style={[styles.tabText, activeTab === "paste" && styles.activeTabText]}>
              Paste Raw CSV
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Sample Datasets */}
        {activeTab === "samples" && (
          <View style={styles.samplesGrid}>
            {SAMPLE_DATASETS.map((sample) => (
              <TouchableOpacity
                key={sample.name}
                style={[
                  styles.sampleCard,
                  dataset?.fileName === sample.name && styles.selectedSampleCard,
                ]}
                onPress={() => handleLoadCsv(sample.csv, sample.name)}
              >
                <Text style={styles.sampleTitle}>{sample.name}</Text>
                <Text style={styles.sampleDesc}>{sample.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tab 2: File Upload */}
        {activeTab === "upload" && (
          <View style={styles.uploadBox}>
            <Upload size={36} color={AppColors.primary} />
            <Text style={styles.uploadTitle}>Select a CSV file from your device</Text>
            <Text style={styles.uploadSub}>
              Supports numeric CSV datasets (up to ~5,000 rows for instant client-side processing)
            </Text>

            {Platform.OS === "web" ? (
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                style={{ marginTop: 12, color: "#FFF" }}
              />
            ) : (
              <Text style={{ color: AppColors.textMuted, marginTop: 12, fontSize: 12 }}>
                (On mobile native, paste CSV text in the 'Paste Raw CSV' tab)
              </Text>
            )}
          </View>
        )}

        {/* Tab 3: Paste Raw CSV */}
        {activeTab === "paste" && (
          <View style={styles.pasteBox}>
            <TextInput
              style={styles.csvInput}
              multiline
              placeholder="Header1,Header2,Header3&#10;1.2,3.4,100&#10;2.1,4.5,200"
              placeholderTextColor="#6B7280"
              value={customCsvText}
              onChangeText={setCustomCsvText}
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleLoadCsv(customCsvText, "custom_dataset.csv")}
            >
              <FileCode size={16} color="#FFF" />
              <Text style={styles.primaryButtonText}>Parse & Analyze CSV</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <AlertTriangle size={18} color="#F43F5E" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* DATASET PROFILING CARD */}
        {dataset && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>📊 Dataset Profile</Text>
                <Text style={styles.sectionSub}>{dataset.fileName}</Text>
              </View>
              <View style={styles.problemBadge}>
                <Text style={styles.problemBadgeText}>
                  {dataset.summary.detectedProblemType.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Overview Stats */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{dataset.summary.rowCount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Rows</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statVal}>{dataset.summary.columnCount}</Text>
                <Text style={styles.statLabel}>Columns</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statVal}>{dataset.summary.numericColumns.length}</Text>
                <Text style={styles.statLabel}>Numeric Cols</Text>
              </View>

              <View style={styles.statBox}>
                <Text
                  style={[
                    styles.statVal,
                    { color: dataset.summary.totalMissing > 0 ? "#F59E0B" : AppColors.tertiary },
                  ]}
                >
                  {dataset.summary.totalMissing}
                </Text>
                <Text style={styles.statLabel}>Missing Values</Text>
              </View>
            </View>

            <Text style={styles.reasonText}>
              💡 <Text style={{ fontWeight: "700" }}>Heuristic Analysis:</Text>{" "}
              {dataset.summary.problemConfidenceReason}
            </Text>

            {/* Column Schema Details */}
            <Text style={styles.tableTitle}>Column Profiling & Summary Statistics</Text>
            <View style={styles.table}>
              <View style={styles.tableHeadRow}>
                <Text style={[styles.tableHead, { flex: 2 }]}>Column</Text>
                <Text style={styles.tableHead}>Type</Text>
                <Text style={styles.tableHead}>Missing</Text>
                <Text style={styles.tableHead}>Mean</Text>
                <Text style={styles.tableHead}>Min / Max</Text>
              </View>

              {dataset.summary.columns.map((col) => (
                <View key={col.name} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2, fontWeight: "700" }]}>
                    {col.name}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { color: col.type === "numeric" ? AppColors.tertiary : "#F43F5E" },
                    ]}
                  >
                    {col.type}
                  </Text>
                  <Text style={styles.tableCell}>{col.missingCount}</Text>
                  <Text style={styles.tableCell}>
                    {col.mean !== undefined ? col.mean.toFixed(2) : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {col.min !== undefined ? `${col.min}/${col.max}` : "-"}
                  </Text>
                </View>
              ))}
            </View>

            {/* Configuration Controls */}
            <View style={styles.configBox}>
              <Text style={styles.configTitle}>Model Configuration</Text>

              {/* Target Column Selection */}
              {dataset.summary.numericColumns.length > 0 && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.configLabel}>Target Column (Predictand):</Text>
                  <View style={styles.chipRow}>
                    {dataset.summary.numericColumns.map((col) => (
                      <TouchableOpacity
                        key={col}
                        style={[
                          styles.chip,
                          selectedTarget === col && styles.activeChip,
                        ]}
                        onPress={() => setSelectedTarget(col)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            selectedTarget === col && styles.activeChipText,
                          ]}
                        >
                          {col}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Problem Type Override */}
              <View>
                <Text style={styles.configLabel}>Algorithm Mode:</Text>
                <View style={styles.chipRow}>
                  {(["regression", "classification", "clustering"] as const).map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[
                        styles.chip,
                        selectedProblemType === mode && styles.activeChip,
                      ]}
                      onPress={() => setSelectedProblemType(mode)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedProblemType === mode && styles.activeChipText,
                        ]}
                      >
                        {mode.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Run Battle Button */}
            <TouchableOpacity
              style={[styles.runButton, isRunningBattle && styles.disabledButton]}
              onPress={handleRunBattle}
              disabled={isRunningBattle}
            >
              {isRunningBattle ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Play size={18} color="#FFF" />
                  <Text style={styles.runButtonText}>⚔️ Run Real ML Algorithm Battle</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* MODEL BATTLE RESULTS CARD */}
        {battleResult && (
          <View style={styles.sectionCard}>
            <View style={styles.winnerCardHeader}>
              <Trophy size={32} color="#F59E0B" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.winnerTitle}>WINNER: {battleResult.winner}</Text>
                <Text style={styles.winnerSub}>{battleResult.verdict}</Text>
              </View>
            </View>

            <Text style={styles.battleCompTitle}>Side-by-Side Performance Comparison</Text>

            <View style={styles.battleGrid}>
              {/* Model 1 */}
              <View
                style={[
                  styles.modelCard,
                  battleResult.winner === battleResult.model1.name && styles.winnerModelCard,
                ]}
              >
                <Text style={styles.modelName}>{battleResult.model1.name}</Text>
                <Text style={styles.modelDesc}>{battleResult.model1.description}</Text>

                <View style={styles.metricsList}>
                  {Object.entries(battleResult.model1.metrics).map(([key, val]) => (
                    <View key={key} style={styles.metricRow}>
                      <Text style={styles.metricKey}>{key}</Text>
                      <Text style={styles.metricVal}>{val}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Model 2 */}
              <View
                style={[
                  styles.modelCard,
                  battleResult.winner === battleResult.model2.name && styles.winnerModelCard,
                ]}
              >
                <Text style={styles.modelName}>{battleResult.model2.name}</Text>
                <Text style={styles.modelDesc}>{battleResult.model2.description}</Text>

                <View style={styles.metricsList}>
                  {Object.entries(battleResult.model2.metrics).map(([key, val]) => (
                    <View key={key} style={styles.metricRow}>
                      <Text style={styles.metricKey}>{key}</Text>
                      <Text style={styles.metricVal}>{val}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* LIVE SAMPLE PREDICTIONS TABLE */}
            {battleResult.samplePredictions && battleResult.samplePredictions.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.tableTitle}>🎯 Sample Row Predictions vs Actual Values</Text>
                <View style={styles.table}>
                  <View style={styles.tableHeadRow}>
                    <Text style={[styles.tableHead, { flex: 1 }]}>Row #</Text>
                    <Text style={[styles.tableHead, { flex: 2 }]}>Actual Target</Text>
                    <Text style={[styles.tableHead, { flex: 2, color: AppColors.primary }]}>
                      {battleResult.model1.name.slice(0, 15)}..
                    </Text>
                    <Text style={[styles.tableHead, { flex: 2, color: AppColors.tertiary }]}>
                      {battleResult.model2.name.slice(0, 15)}..
                    </Text>
                  </View>

                  {battleResult.samplePredictions.map((sp) => (
                    <View key={sp.rowIdx} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 1, color: AppColors.textMuted }]}>
                        #{sp.rowIdx}
                      </Text>
                      <Text style={[styles.tableCell, { flex: 2, fontWeight: "700" }]}>
                        {sp.actual}
                      </Text>
                      <Text style={[styles.tableCell, { flex: 2, color: AppColors.primary }]}>
                        {sp.model1Predicted}
                      </Text>
                      <Text style={[styles.tableCell, { flex: 2, color: AppColors.tertiary }]}>
                        {sp.model2Predicted}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ResponsiveShell>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.bg },
  hero: { padding: 20, borderRadius: Radii.xl, marginTop: 16 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    marginBottom: 12,
  },
  heroBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 6, lineHeight: 20 },

  tabContainer: { flexDirection: "row", gap: 8, marginTop: 16 },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  activeTabButton: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  tabText: { color: AppColors.textMuted, fontSize: 12, fontWeight: "600" },
  activeTabText: { color: "#FFF", fontWeight: "700" },

  samplesGrid: { gap: 10, marginTop: 12 },
  sampleCard: {
    backgroundColor: AppColors.surface,
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  selectedSampleCard: { borderColor: AppColors.primary, backgroundColor: "rgba(139, 92, 246, 0.12)" },
  sampleTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  sampleDesc: { color: AppColors.textSecondary, fontSize: 12, marginTop: 4 },

  uploadBox: {
    marginTop: 12,
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  uploadTitle: { color: "#FFF", fontSize: 15, fontWeight: "700", marginTop: 12 },
  uploadSub: { color: AppColors.textMuted, fontSize: 12, textAlign: "center", marginTop: 4 },

  pasteBox: { marginTop: 12, gap: 12 },
  csvInput: {
    backgroundColor: AppColors.surface,
    color: "#FFF",
    borderRadius: Radii.md,
    padding: 14,
    minHeight: 120,
    textAlignVertical: "top",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },

  primaryButton: {
    backgroundColor: AppColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radii.md,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(244, 63, 94, 0.15)",
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: "#F43F5E",
    marginTop: 12,
  },
  errorText: { color: "#F43F5E", fontSize: 13, flex: 1 },

  sectionCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radii.xl,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  sectionSub: { color: AppColors.textMuted, fontSize: 12, marginTop: 2 },
  problemBadge: {
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: AppColors.tertiary,
  },
  problemBadgeText: { color: AppColors.tertiary, fontSize: 11, fontWeight: "800" },

  statsGrid: { flexDirection: "row", gap: 8, marginTop: 14 },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: Radii.sm,
    padding: 10,
    alignItems: "center",
  },
  statVal: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  statLabel: { color: AppColors.textMuted, fontSize: 10, marginTop: 2 },

  reasonText: { color: AppColors.textSecondary, fontSize: 12, marginTop: 12, lineHeight: 18 },

  tableTitle: { color: "#FFF", fontSize: 14, fontWeight: "700", marginTop: 16, marginBottom: 8 },
  table: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: Radii.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  tableHeadRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 10,
  },
  tableHead: { flex: 1, color: AppColors.textMuted, fontSize: 11, fontWeight: "700" },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderSubtle,
  },
  tableCell: { flex: 1, color: "#FFF", fontSize: 11 },

  configBox: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: AppColors.borderSubtle },
  configTitle: { color: "#FFF", fontSize: 14, fontWeight: "700", marginBottom: 8 },
  configLabel: { color: AppColors.textMuted, fontSize: 12, marginBottom: 6 },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  activeChip: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  chipText: { color: AppColors.textMuted, fontSize: 11, fontWeight: "600" },
  activeChipText: { color: "#FFF", fontWeight: "700" },

  runButton: {
    marginTop: 18,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radii.md,
  },
  runButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  disabledButton: { opacity: 0.5 },

  winnerCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    padding: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  winnerTitle: { color: "#F59E0B", fontSize: 16, fontWeight: "800" },
  winnerSub: { color: "#FFF", fontSize: 12, marginTop: 4, lineHeight: 18 },

  battleCompTitle: { color: "#FFF", fontSize: 14, fontWeight: "700", marginTop: 16, marginBottom: 10 },
  battleGrid: { gap: 12 },
  modelCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  winnerModelCard: { borderColor: "#F59E0B", backgroundColor: "rgba(245, 158, 11, 0.05)" },
  modelName: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  modelDesc: { color: AppColors.textMuted, fontSize: 11, marginTop: 2 },
  metricsList: { marginTop: 10, gap: 6 },
  metricRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metricKey: { color: AppColors.textSecondary, fontSize: 12 },
  metricVal: { color: AppColors.tertiary, fontSize: 13, fontWeight: "700" },
});
