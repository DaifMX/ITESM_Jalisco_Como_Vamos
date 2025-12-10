import { View, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { CommentItem } from "./CommentItem";

interface User {
    id: string;
    name?: string;
}

interface CommentData {
    id: string;
    msgContent: string;
    userId: string;
    userName: string;
    createdAt: string;
    likesCount: number;
    hasLiked: boolean;
}

interface CommentSectionProps {
    comments: CommentData[] | undefined;
    commentsError: any;
    isSubmittingComment: boolean;
    comment: string;
    user: User | null | undefined;
    onCommentChange: (text: string) => void;
    onAddComment: () => void;
    onDeleteComment: (commentId: string) => void;
    onToggleLike: (commentId: string) => void;
}

export function CommentSection({
    comments,
    commentsError,
    isSubmittingComment,
    comment,
    user,
    onCommentChange,
    onAddComment,
    onDeleteComment,
    onToggleLike,
}: CommentSectionProps) {
    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        const diffMonths = Math.floor(diffMs / 2592000000);
        
        if (diffMins < 1) return 'justo ahora';
        if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
        if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        if (diffDays < 30) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        return `hace ${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
    };

    return (
        <View style={styles.commentsBlock}>
            <Text style={styles.sectionTitle}>Comentarios</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder={user ? "Agrega un comentario…" : "Inicia sesión para comentar"}
                    value={comment}
                    onChangeText={onCommentChange}
                    multiline
                    editable={!!user && !isSubmittingComment}
                />
                <Button 
                    onPress={onAddComment} 
                    className="bg-pantone-dark-blue rounded-xl"
                    disabled={isSubmittingComment || !user}
                >
                    <ButtonText className="text-white">
                        {isSubmittingComment ? 'Enviando...' : 'Compartir'}
                    </ButtonText>
                </Button>
            </View>
            {commentsError && (
                <Text style={styles.errorText}>
                    Error al cargar comentarios
                </Text>
            )}
            {!comments && !commentsError && (
                <ActivityIndicator size="small" color="rgb(0, 61, 165)" />
            )}
            {comments && comments.length === 0 && (
                <Text style={styles.emptyText}>
                    No hay comentarios aún. ¡Sé el primero en comentar!
                </Text>
            )}
            {comments?.map((c) => (
                <CommentItem
                    key={c.id}
                    id={c.id}
                    msgContent={c.msgContent}
                    userName={c.userName}
                    createdAt={c.createdAt}
                    likesCount={c.likesCount}
                    hasLiked={c.hasLiked}
                    isOwnComment={c.userId === user?.id}
                    onDelete={onDeleteComment}
                    onToggleLike={onToggleLike}
                    formatTimeAgo={formatTimeAgo}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    commentsBlock: { 
        gap: 12 
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "600", 
        color: "#000" 
    },
    inputRow: { 
        gap: 8 
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 12,
        padding: 10,
        minHeight: 80,
        textAlignVertical: "top",
        color: "#000",
    },
    errorText: {
        color: 'rgb(220, 38, 38)', 
        textAlign: 'center'
    },
    emptyText: {
        textAlign: 'center', 
        color: 'rgb(153, 179, 214)', 
        marginTop: 16
    },
});
