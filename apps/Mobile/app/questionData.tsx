import { useMemo, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Share,
    Dimensions,
    Pressable
} from "react-native";

import { authClient } from "@/lib/auth-client";
import { router } from "expo-router";

import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { AvatarSection } from "@/components/avatar-section";
import { PieChart, BarChart } from "react-native-chart-kit";

import { ArrowLeftIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// ======== Tipos ========
type Sexo = "Hombre" | "Mujer";
type CalidadBucket = "1-2" | "3" | "4-5";

const MUNICIPIOS = [
    "El Salto",
    "Guadalajara",
    "Tlaquepaque",
    "Tlajomulco",
    "Tonalá",
    "Zapopan",
] as const;
type Municipio = (typeof MUNICIPIOS)[number];

interface Row {
    municipio: Municipio;
    sexo: Sexo;
    calidad: number; // 1..5
}

interface CommentItem {
    id: number;
    author: string;
    time: string;
    text: string;
}

// ======== Datos dummy ========
const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = Math.min(SCREEN_WIDTH - 64);

const seed = (n = 300): Row[] => {
    const rows: Row[] = [];
    for (let i = 0; i < n; i++) {
        const municipio = MUNICIPIOS[Math.floor(Math.random() * MUNICIPIOS.length)];
        const sexo: Sexo = Math.random() < 0.48 ? "Hombre" : "Mujer";
        const base = MUNICIPIOS.indexOf(municipio) + 1;
        const calidad = Math.min(
            5,
            Math.max(1, Math.round(base + (Math.random() - 0.5) * 2))
        );
        rows.push({ municipio, sexo, calidad });
    }
    return rows;
};

const RAW: Row[] = seed(300);

const calidadBucket = (calidad: number): CalidadBucket => {
    if (calidad <= 2) return "1-2";
    if (calidad === 3) return "3";
    return "4-5";
};

const COLORS: string[] = [
    "rgb(0, 61, 165)",      // pantone-dark-blue
    "rgb(243, 112, 33)",    // pantone-orange
    "rgb(196, 214, 0)",     // pantone-green
    "rgb(228, 0, 43)",      // pantone-red
    "rgb(254, 221, 0)",     // pantone-yellow
    "rgb(153, 179, 214)",   // pantone-light-blue
];

// ======== Componente principal ========
export default function QuestionData() {
    const session = authClient.useSession();
    const [filterSexo, setFilterSexo] = useState<Sexo | "Todos">("Todos");
    const [filterCalidad, setFilterCalidad] = useState<CalidadBucket | "Todos">("Todos");
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    const [comments, setComments] = useState<CommentItem[]>([
        {
            id: 1,
            author: "Jaime Rodriguez",
            time: "hace 10 meses",
            text: "¡Por fin un sitio que no solo muestra datos, sino que los hace comprensibles! Ideal para ciudadanos curiosos como yo.",
        },
    ]);

    const filtered: Row[] = useMemo(() => {
        return RAW.filter((r) => {
            const okSexo = filterSexo === "Todos" || r.sexo === filterSexo;
            const okCalidad =
                filterCalidad === "Todos" || calidadBucket(r.calidad) === filterCalidad;
            return okSexo && okCalidad;
        });
    }, [filterSexo, filterCalidad]);

    // ---- Datos para gráficas
    const porMunicipioPie = useMemo(() => {
        const counts = Object.fromEntries(MUNICIPIOS.map((m) => [m, 0])) as Record<
            Municipio,
            number
        >;
        filtered.forEach((r) => counts[r.municipio]++);
        return (Object.entries(counts) as [Municipio, number][]).map(
            ([name, population], i) => ({
                name,
                population,
                color: COLORS[i % COLORS.length],
                legendFontColor: "rgb(0, 61, 165)",
                legendFontSize: 12,
            })
        );
    }, [filtered]);

    const porSexoPie = useMemo(() => {
        const h = filtered.filter((r) => r.sexo === "Hombre").length;
        const m = filtered.filter((r) => r.sexo === "Mujer").length;
        return [
            {
                name: "Hombre",
                population: h,
                color: COLORS[0],
                legendFontColor: "rgb(0, 61, 165)",
                legendFontSize: 12,
            },
            {
                name: "Mujer",
                population: m,
                color: COLORS[1],
                legendFontColor: "rgb(0, 61, 165)",
                legendFontSize: 12,
            },
        ];
    }, [filtered]);

    const calidadBar = useMemo(() => {
        const buckets = ["1-2", "3", "4-5"].map((k) => ({ x: String(k), y: 0 }));
        filtered.forEach((r) => {
            const index = r.calidad <= 2 ? 0 : r.calidad === 3 ? 1 : 2;
            buckets[index].y += 1;
        });
        return {
            labels: buckets.map((b) => b.x),
            datasets: [{ data: buckets.map((b) => b.y) }],
        };
    }, [filtered]);

    const total = filtered.length;

    const exportJSON = async () => {
        const payload = {
            metadata: {
                total,
                filtros: { sexo: filterSexo, calidad: filterCalidad },
            },
            porMunicipio: porMunicipioPie.map(({ name, population }) => ({
                name,
                value: population,
            })),
            porSexo: porSexoPie.map(({ name, population }) => ({
                name,
                value: population,
            })),
            histCalidad: calidadBar.labels.map((lab, i) => ({
                calidad: lab,
                value: calidadBar.datasets[0].data[i],
            })),
        };
        await Share.share({ message: JSON.stringify(payload, null, 2) });
    };

    const addComment = () => {
        if (!comment.trim()) return;
        setComments((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                author: "Tú",
                time: "justo ahora",
                text: comment.trim(),
            },
        ]);
        setComment("");
    };

    const clearFilters = () => {
        setFilterSexo("Todos");
        setFilterCalidad("Todos");
    };

    const chartConfig = {
        backgroundGradientFrom: "rgb(251, 251, 251)",
        backgroundGradientTo: "rgb(251, 251, 251)",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 61, 165, ${opacity})`,
        labelColor: () => "rgb(0, 61, 165)",
        propsForLabels: { fontSize: 11 },
        propsForBackgroundLines: { stroke: "rgb(153, 179, 214)" },
        fillShadowGradient: COLORS[0],
        fillShadowGradientOpacity: 1,
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View style={styles.header}>
                <View className="flex flex-row justify-between">
                    <Pressable onPress={() => router.back()}>
                        <ArrowLeftIcon size={40} />
                    </Pressable>
                    <ThemedText type="title">Descripción</ThemedText>
                    <AvatarSection
                        user={session.data?.user}
                        handleMyAccount={() => router.push('/my-account')}
                        handleSettings={() => router.push('/my-account')}
                        handleSignIn={() => router.push('/login')}
                        handleSignOut={() => { authClient.signOut(); router.push('/login') }}
                    />
                </View>
                <View style={styles.headerButtons}>
                    <Button onPress={exportJSON} className="bg-pantone-orange rounded-xl">
                        <ButtonText className="text-white">
                            Exportar
                        </ButtonText>
                    </Button>
                    <Button onPress={() => setFilterOpen(true)} className="bg-pantone-dark-blue rounded-xl">
                        <ButtonText className="text-white">
                            Aplicar filtro
                        </ButtonText>
                    </Button>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <Card
                    title="Distribución por municipio"
                    subtitle={`${total} respuestas`}
                >
                    <PieChart
                        data={porMunicipioPie}
                        width={CHART_WIDTH}
                        height={240}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="16"
                        chartConfig={chartConfig}
                        hasLegend
                        center={[0, 0]}
                    />
                </Card>

                <Card title="Distribución por sexo">
                    <PieChart
                        data={porSexoPie}
                        width={CHART_WIDTH}
                        height={220}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="16"
                        chartConfig={chartConfig}
                        hasLegend
                        center={[0, 0]}
                    />
                </Card>

                <Card title="Calidad de vida (1 a 5)">
                    <BarChart
                        data={calidadBar}
                        width={CHART_WIDTH}
                        height={260}
                        fromZero
                        showValuesOnTopOfBars
                        yAxisLabel="" // <- requerido por typings de algunas versiones
                        yAxisSuffix="" // <- idem
                        chartConfig={chartConfig}
                        style={{ borderRadius: 12 }}
                    />
                </Card>

                {/* Comentarios */}
                <View style={styles.commentsBlock}>
                    <Text style={styles.sectionTitle}>Comentarios</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Agrega un comentario…"
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                        <Button onPress={addComment} className="bg-pantone-dark-blue rounded-xl">
                            <ButtonText className="text-white">
                                Compartir
                            </ButtonText>
                        </Button>
                    </View>
                    {comments.map((c) => (
                        <View key={c.id} style={styles.comment}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {c.author.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.commentBody}>
                                <Text style={styles.commentMeta}>
                                    <Text style={{ fontWeight: "600", color: "#000" }}>
                                        {c.author}
                                    </Text>
                                    <Text> · {c.time}</Text>
                                </Text>
                                <Text style={styles.commentText}>{c.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Panel de filtros */}
            <Modal visible={filterOpen} animationType="slide" transparent>
                <View style={styles.modalWrap}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros</Text>
                            <Button
                                variant="outline"
                                onPress={clearFilters}
                                className="border-pantone-light-blue rounded-xl"
                            >
                                <ButtonText className="text-pantone-dark-blue rounded-xl">
                                    Limpiar
                                </ButtonText>
                            </Button>
                        </View>

                        <View style={{ gap: 16 }}>
                            <View>
                                <Text style={styles.filterTitle}>Calidad de vida</Text>
                                <View style={styles.chipRow}>
                                    {(["1-2", "3", "4-5", "Todos"] as const).map((key) => (
                                        <Chip
                                            key={key}
                                            label={key}
                                            active={filterCalidad === key}
                                            onPress={() => setFilterCalidad(key)}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View>
                                <Text style={styles.filterTitle}>Sexo</Text>
                                <View style={styles.chipRow}>
                                    {(["Hombre", "Mujer", "Todos"] as const).map((key) => (
                                        <Chip
                                            key={key}
                                            label={key}
                                            active={filterSexo === key}
                                            onPress={() => setFilterSexo(key)}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                        <Button variant="outline" onPress={() => setFilterOpen(false)} className="border-pantone-light-blue rounded-xl">
                            <ButtonText className="text-pantone-dark-blue">
                                Cerrar
                            </ButtonText>
                        </Button>
                        <Button onPress={() => setFilterOpen(false)} className="bg-pantone-dark-blue rounded-xl">
                            <ButtonText className="text-white">
                                Aplicar filtro
                            </ButtonText>
                        </Button>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
// ======== UI helpers con tipos ========
type CardProps = {
    title: string;
    subtitle?: string; // opcional
    children: React.ReactNode;
};
function Card({ title, subtitle, children }: CardProps): React.ReactElement {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
            </View>
            {children}
        </View>
    );
}

type ChipProps = { label: string; active: boolean; onPress: () => void };
function Chip({ label, active, onPress }: ChipProps): React.ReactElement {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.chip, active && styles.chipActive]}
        >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

// ======== Estilos ========
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "rgb(251, 251, 251)" },
    header: {
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgb(153, 179, 214)",
        backgroundColor: "rgb(255, 255, 255)",
    },
    title: { fontSize: 18, fontWeight: "700", color: "#000" },
    headerButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
    scroll: { padding: 16, gap: 16 },
    card: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 16,
        padding: 12,
        backgroundColor: "rgb(255, 255, 255)",
        shadowColor: "rgb(0, 61, 165)",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    cardTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
    cardSubtitle: { fontSize: 12, color: "rgb(153, 179, 214)" },
    commentsBlock: { gap: 12 },
    sectionTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
    inputRow: { gap: 8 },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 12,
        padding: 10,
        minHeight: 80,
        textAlignVertical: "top",
        color: "#000",
    },
    comment: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgb(153, 179, 214)",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: { fontWeight: "700", color: "#000" },
    commentBody: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 12,
        padding: 10,
    },
    commentMeta: { fontSize: 12, color: "rgb(153, 179, 214)", marginBottom: 4 },
    commentText: { fontSize: 14, lineHeight: 20, color: "#000" },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    btnSolid: { backgroundColor: "rgb(0, 61, 165)" },
    btnText: { color: "rgb(255, 255, 255)", fontWeight: "600" },
    btnOutline: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        backgroundColor: "rgb(255, 255, 255)",
    },
    btnTextOutline: { color: "rgb(0, 61, 165)", fontWeight: "600" },
    modalWrap: {
        flex: 1,
        backgroundColor: "rgba(0, 61, 165, 0.3)",
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: "rgb(255, 255, 255)",
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: { fontSize: 16, fontWeight: "700", color: "#000" },
    filterTitle: { fontWeight: "600", marginBottom: 8, color: "#000" },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    chipActive: { backgroundColor: "rgb(0, 61, 165)", borderColor: "rgb(0, 61, 165)" },
    chipText: { color: "rgb(0, 61, 165)" },
    chipTextActive: { color: "rgb(255, 255, 255)" },
    modalFooter: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
});
