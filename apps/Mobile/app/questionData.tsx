import { useMemo, useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Share,
    Pressable,
    ActivityIndicator
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useSWR from "swr";

import { authClient } from "@/lib/auth-client";
import axiosInstance, { fetcher } from "@/lib/axios";

import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { AvatarSection } from "@/components/avatar-section";
import { CommentSection } from "@/components/question-data/CommentSection";
import { FilterModal } from "@/components/question-data/FilterModal";
import { ChartCard } from "@/components/question-data/ChartCard";

import { ArrowLeftIcon } from "lucide-react-native";
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
    id: string;
    msgContent: string;
    userId: string;
    userName: string;
    createdAt: string;
    likesCount: number;
    hasLiked: boolean;
}


// ======== Componente principal ========
export default function QuestionData() {
    const session = authClient.useSession();
    const params = useLocalSearchParams();
    const questionId = params.id as string;

    const [selectedSegmentValue, setSelectedSegmentValue] = useState<string | null>(null);
    const [promedioSegmentValueId, setPromedioSegmentValueId] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [chartType, setChartType] = useState<"pie" | "bar">("pie");
    const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

    // Fetch segments with values to find "Promedio"
    const segmentsUrl = '/api/segment/with-values';

    const { data: segmentsData } = useSWR<Segment[]>(
        segmentsUrl,
        fetcher
    );

    // Set "Promedio" as default segmentValue on mount
    useEffect(() => {
        if (segmentsData && !promedioSegmentValueId) {
            // Find "Promedio" segment value across all segments
            for (const segment of segmentsData) {
                const promedioValue = segment.values.find(
                    (v) => v.name.toLowerCase() === "promedio"
                );
                if (promedioValue) {
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

    const fetchUrl = shouldFetch
        ? `/api/question/${questionId}?segmentValueId=${selectedSegmentValue}`
        : null;

    const { data, error, isLoading } = useSWR<QuestionResponse>(
        fetchUrl,
        fetcher
    );

    // Fetch comments for this question
    const commentsUrl = questionId ? `/api/comment/question/${questionId}` : null;
    const { data: commentsData, error: commentsError, mutate: mutateComments } = useSWR<CommentItem[]>(
        commentsUrl,
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

    const addComment = async () => {
        if (!comment.trim()) return;
        if (!session.data?.user) {
            alert('Debes iniciar sesión para comentar');
            return;
        }
        
        setIsSubmittingComment(true);
        try {
            await axiosInstance.post('/api/comment', {
                msgContent: comment.trim(),
                questionId: questionId,
                userId: session.data.user.id
            });

            setComment("");
            // Revalidar comentarios
            mutateComments();
        } catch {
            alert('Error al agregar comentario');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const deleteComment = async (commentId: string) => {
        if (!session.data?.user) return;
        
        try {
            await axiosInstance.delete(`/api/comment/${commentId}`);

            // Revalidar comentarios
            mutateComments();
        } catch {
            alert('Error al eliminar comentario');
        }
    };

    const toggleLike = async (commentId: string) => {
        if (!session.data?.user) {
            alert('Debes iniciar sesión para dar like');
            return;
        }
        
        try {
            await axiosInstance.post(`/api/comment/${commentId}/like`);
            mutateComments();
        } catch {
            alert('Error al dar like');
        }
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
                <ChartCard
                    title="Distribución de respuestas"
                    subtitle={`Total: ${total.toFixed(1)}%`}
                    chartData={chartData}
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                />

                <CommentSection
                    comments={commentsData}
                    commentsError={commentsError}
                    isSubmittingComment={isSubmittingComment}
                    comment={comment}
                    user={session.data?.user}
                    onCommentChange={setComment}
                    onAddComment={addComment}
                    onDeleteComment={deleteComment}
                    onToggleLike={toggleLike}
                />
            </ScrollView>

            <FilterModal
                visible={filterOpen}
                segments={segmentsData}
                selectedSegmentValue={selectedSegmentValue}
                promedioSegmentValueId={promedioSegmentValueId}
                onClose={() => setFilterOpen(false)}
                onSelectSegmentValue={setSelectedSegmentValue}
            />
        </SafeAreaView>
    );
}

// ======== Estilos ========
const styles = StyleSheet.create({
    header: {
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgb(153, 179, 214)",
        backgroundColor: "rgb(255, 255, 255)",
    },
    questionText: { fontSize: 16, color: "#444", marginTop: 8 },
    headerButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
    scroll: { padding: 16, gap: 16 },
});
