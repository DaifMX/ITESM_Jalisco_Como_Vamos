import { useMemo, useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Share,
    Pressable,
    ActivityIndicator
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useSWR from "swr";

import { authClient } from "@/lib/auth-client";
import { fetcher } from "@/lib/axios";

import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { AvatarSection } from "@/components/avatar-section";
import { DynamicPieChart } from "@/components/graphs/DynamicPieChart";
import { DynamicBarChart } from "@/components/graphs/DynamicBarChart";

import { ArrowLeftIcon, PieChartIcon, BarChart3Icon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ======== Tipos ========
interface QuestionDataItem {
    answerId: string;
    questionId: string;
    segmentValueId: string;
    result: string;
    answerValue: string;
}

interface QuestionResponse {
    question: {
        id: string;
        xlsxCode: string;
        value: string;
    };
    questionData: QuestionDataItem[];
}

interface SegmentValue {
    id: string;
    name: string;
    segmentId: string;
}

interface Segment {
    id: string;
    name: string;
    values: SegmentValue[];
}

interface CommentItem {
    id: number;
    author: string;
    time: string;
    text: string;
}


// ======== Componente principal ========
export default function QuestionData() {
    const session = authClient.useSession();
    const params = useLocalSearchParams();
    const questionId = params.id as string;

    console.log('=== QuestionData Component Mounted ===');
    console.log('Params:', params);
    console.log('QuestionId from params:', questionId);

    const [selectedSegmentValue, setSelectedSegmentValue] = useState<string | null>(null);
    const [promedioSegmentValueId, setPromedioSegmentValueId] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [chartType, setChartType] = useState<"pie" | "bar">("pie");

    const [comments, setComments] = useState<CommentItem[]>([
        {
            id: 1,
            author: "Jaime Rodriguez",
            time: "hace 10 meses",
            text: "¡Por fin un sitio que no solo muestra datos, sino que los hace comprensibles! Ideal para ciudadanos curiosos como yo.",
        },
    ]);

    // Fetch segments with values to find "Promedio"
    const segmentsUrl = '/api/segment/with-values';
    console.log('Segments URL:', segmentsUrl);

    const { data: segmentsData } = useSWR<Segment[]>(
        segmentsUrl,
        fetcher
    );

    console.log('Segments data received:', segmentsData);

    // Set "Promedio" as default segmentValue on mount
    useEffect(() => {
        console.log('Segments data:', segmentsData);
        if (segmentsData && !promedioSegmentValueId) {
            // Find "Promedio" segment value across all segments
            for (const segment of segmentsData) {
                const promedioValue = segment.values.find(
                    (v) => v.name.toLowerCase() === "promedio"
                );
                if (promedioValue) {
                    console.log('Found Promedio:', promedioValue.id);
                    setPromedioSegmentValueId(promedioValue.id);
                    setSelectedSegmentValue(promedioValue.id);
                    break;
                }
            }
        }
    }, [segmentsData, promedioSegmentValueId]);

    // Fetch question data with optional segment filter
    // Don't fetch until we have questionId and selectedSegmentValue is set
    const shouldFetch = questionId && selectedSegmentValue;
    console.log('QuestionId:', questionId, 'SelectedSegmentValue:', selectedSegmentValue, 'ShouldFetch:', shouldFetch);

    const fetchUrl = shouldFetch
        ? `/api/question/${questionId}?segmentValueId=${selectedSegmentValue}`
        : null;
    console.log('Fetch URL:', fetchUrl);

    const { data, error, isLoading } = useSWR<QuestionResponse>(
        fetchUrl,
        fetcher
    );

    // ---- Procesar datos para gráficas
    const chartData = useMemo(() => {
        if (!data?.questionData) return [];

        return data.questionData.map(item => {
            const val = parseFloat(item.result);
            return {
                name: item.answerValue,
                // Fallback to 0 if NaN
                value: isNaN(val) ? 0 : val * 100,
                label: item.answerValue,
            };
        });
    }, [data]);

    const total = useMemo(() => {
        if (!data?.questionData) return 0;
        return data.questionData.reduce((sum, item) => sum + parseFloat(item.result) * 100, 0);
    }, [data]);

    const exportJSON = async () => {
        if (!data) return;

        const payload = {
            metadata: {
                questionId,
                questionText: data.question.value,
                segmentValueId: selectedSegmentValue,
                total: total.toFixed(1),
            },
            data: chartData.map(({ name, value }) => ({
                answer: name,
                percentage: value.toFixed(1),
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
        setSelectedSegmentValue(promedioSegmentValueId);
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="rgb(0, 61, 165)" />
                <Text className="mt-4 text-pantone-dark-blue">Cargando datos...</Text>
            </SafeAreaView>
        );
    }

    if (error || !data) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-8">
                <Text className="text-pantone-red text-center text-lg">
                    Error al cargar los datos
                </Text>
                <Button onPress={() => router.back()} className="mt-4 bg-pantone-dark-blue rounded-xl">
                    <ButtonText className="text-white">Volver</ButtonText>
                </Button>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View style={styles.header}>
                <View className="flex flex-row justify-between">
                    <Pressable onPress={() => router.back()}>
                        <ArrowLeftIcon size={40} />
                    </Pressable>
                    <ThemedText type="title">{data.question.xlsxCode}</ThemedText>
                    <AvatarSection
                        user={session.data?.user}
                        handleMyAccount={() => router.push('/my-account')}
                        handleSettings={() => router.push('/my-account')}
                        handleSignIn={() => router.push('/login')}
                        handleSignOut={() => { authClient.signOut(); router.push('/login') }}
                    />
                </View>
                <Text style={styles.questionText}>{data.question.value}</Text>
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
                    title="Distribución de respuestas"
                    subtitle={`Total: ${total.toFixed(1)}%`}
                >
                    <View style={styles.chartToggleContainer}>
                        <Button
                            onPress={() => setChartType("pie")}
                            className={chartType === "pie" ? "bg-pantone-dark-blue" : "bg-gray-300"}
                            style={styles.toggleButton}
                        >
                            <PieChartIcon 
                                size={20} 
                                color={chartType === "pie" ? "#ffffff" : "#6b7280"} 
                            />
                        </Button>
                        <Button
                            onPress={() => setChartType("bar")}
                            className={chartType === "bar" ? "bg-pantone-dark-blue" : "bg-gray-300"}
                            style={styles.toggleButton}
                        >
                            <BarChart3Icon 
                                size={20} 
                                color={chartType === "bar" ? "#ffffff" : "#6b7280"} 
                            />
                        </Button>
                    </View>

                    {chartType === "pie" ? (
                        <DynamicPieChart
                            data={chartData}
                            height={240}
                        />
                    ) : (
                        <DynamicBarChart
                            data={chartData}
                            height={260}
                        />
                    )}
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
                            <Text style={styles.modalTitle}>Filtros por segmento</Text>
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

                        <ScrollView style={{ maxHeight: 400 }}>
                            <View style={{ gap: 16 }}>
                                {segmentsData?.map((segment) => (
                                    <View key={segment.id}>
                                        <Text style={styles.filterTitle}>{segment.name}</Text>
                                        <View style={styles.chipRow}>
                                            <Chip
                                                label="Promedio"
                                                active={selectedSegmentValue === promedioSegmentValueId}
                                                onPress={() => setSelectedSegmentValue(promedioSegmentValueId)}
                                            />
                                            {segment.values
                                                .filter(v => v.name.toLowerCase() !== "promedio")
                                                .map((value) => (
                                                    <Chip
                                                        key={value.id}
                                                        label={value.name}
                                                        active={selectedSegmentValue === value.id}
                                                        onPress={() => setSelectedSegmentValue(value.id)}
                                                    />
                                                ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

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
    questionText: { fontSize: 16, color: "#444", marginTop: 8 },
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
    chartToggleContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
        justifyContent: "flex-start",
    },
    toggleButton: {
        borderRadius: 12,
        minWidth: 48,
        paddingHorizontal: 12,
    },
});
