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
import ErrorDialog from "@/components/error-dialog";

import { ArrowLeftIcon, ShareIcon, FilterIcon } from "lucide-react-native";
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
    const [errorDialog, setErrorDialog] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ""
    });

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
            setErrorDialog({ isOpen: true, message: 'Debes iniciar sesión para comentar' });
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
        } catch (err: any) {
            setErrorDialog({ isOpen: true, message: err.message ?? 'Error al agregar comentario' });
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
        } catch (err: any) {
            setErrorDialog({ isOpen: true, message: err.message ?? 'Error al eliminar comentario' });
        }
    };

    const toggleLike = async (commentId: string) => {
        if (!session.data?.user) {
            setErrorDialog({ isOpen: true, message: 'Debes iniciar sesión para dar like' });
            return;
        }
        
        try {
            await axiosInstance.post(`/api/comment/${commentId}/like`);
            mutateComments();
        } catch (err: any) {
            setErrorDialog({ isOpen: true, message: err.message ?? 'Error al dar like' });
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
                <View className="flex flex-row justify-between items-center">
                    <Pressable onPress={() => router.back()}>
                        <ArrowLeftIcon size={40} />
                    </Pressable>
                    <ThemedText type="title">{data.question.xlsxCode}</ThemedText>
                    <AvatarSection
                        user={session.data?.user}
                        handleMyAccount={() => router.push('/my-account')}
                        handleInfo={() => router.push('/info')}
                        handleSignIn={() => router.push('/login')}
                        handleSignOut={() => { authClient.signOut(); router.push('/login') }}
                    />
                </View>
            </View>

            <ScrollView contentContainerClassName="p-4 gap-4">
                <View className="border border-pantone-light-blue rounded-2xl p-3 bg-white shadow-sm">
                    <Text className="text-base text-black font-semibold leading-6">{data.question.value}</Text>
                </View>
                <ChartCard
                    title="Distribución de respuestas"
                    subtitle={`Total: ${total.toFixed(1)}%`}
                    chartData={chartData}
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                    actionButtons={
                        <>
                            <Pressable 
                                onPress={exportJSON} 
                                className="bg-gray-300 rounded-xl p-2.5 active:opacity-80"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                <ShareIcon size={20} color="#6b7280" />
                            </Pressable>
                            <Pressable 
                                onPress={() => setFilterOpen(true)} 
                                className="bg-gray-300 rounded-xl p-2.5 active:opacity-80"
                                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                            >
                                <FilterIcon size={20} color="#6b7280" />
                            </Pressable>
                        </>
                    }
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

            <ErrorDialog
                isOpen={errorDialog.isOpen}
                cause={errorDialog.message}
                handleClose={() => setErrorDialog({ isOpen: false, message: "" })}
            />
        </SafeAreaView>
    );
}

// ======== Estilos ========
const styles = StyleSheet.create({
    header: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgb(153, 179, 214)",
        backgroundColor: "rgb(255, 255, 255)",
    },
});
