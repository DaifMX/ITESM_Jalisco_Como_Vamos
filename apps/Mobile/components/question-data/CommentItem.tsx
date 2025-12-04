import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HeartIcon } from "lucide-react-native";

interface CommentItemProps {
    id: string;
    msgContent: string;
    userName: string;
    createdAt: string;
    likesCount: number;
    hasLiked: boolean;
    isOwnComment: boolean;
    onDelete: (commentId: string) => void;
    onToggleLike: (commentId: string) => void;
    formatTimeAgo: (dateString: string) => string;
}

export function CommentItem({
    id,
    msgContent,
    userName,
    createdAt,
    likesCount,
    hasLiked,
    isOwnComment,
    onDelete,
    onToggleLike,
    formatTimeAgo,
}: CommentItemProps) {
    return (
        <View style={styles.comment}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </Text>
            </View>
            <View style={styles.commentBody}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentMeta}>
                        <Text style={styles.commentAuthor}>
                            {isOwnComment ? 'Tú' : (userName || 'Usuario')}
                        </Text>
                        <Text> · {formatTimeAgo(createdAt)}</Text>
                    </Text>
                    {isOwnComment && (
                        <TouchableOpacity onPress={() => onDelete(id)}>
                            <Text style={styles.deleteButton}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.commentText}>{msgContent}</Text>
                <View style={styles.likeContainer}>
                    <TouchableOpacity 
                        onPress={() => onToggleLike(id)}
                        style={[
                            styles.likeButton,
                            hasLiked && styles.likeButtonActive
                        ]}
                    >
                        <HeartIcon 
                            size={20} 
                            color={hasLiked ? "rgb(220, 38, 38)" : "rgb(153, 179, 214)"}
                            fill={hasLiked ? "rgb(220, 38, 38)" : "transparent"}
                            strokeWidth={hasLiked ? 0 : 2}
                        />
                        <Text style={[
                            styles.likeCount,
                            hasLiked && styles.likeCountActive
                        ]}>
                            {likesCount}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    comment: { 
        flexDirection: "row", 
        gap: 8, 
        alignItems: "flex-start" 
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgb(153, 179, 214)",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: { 
        fontWeight: "700", 
        color: "#000" 
    },
    commentBody: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgb(153, 179, 214)",
        borderRadius: 12,
        padding: 10,
    },
    commentHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    commentMeta: { 
        fontSize: 12, 
        color: "rgb(153, 179, 214)", 
        marginBottom: 4 
    },
    commentAuthor: { 
        fontWeight: "600", 
        color: "#000" 
    },
    deleteButton: { 
        color: 'rgb(220, 38, 38)', 
        fontSize: 12 
    },
    commentText: { 
        fontSize: 14, 
        lineHeight: 20, 
        color: "#000" 
    },
    likeContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 8, 
        gap: 4 
    },
    likeButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4,
        padding: 4,
        borderRadius: 8,
    },
    likeButtonActive: {
        backgroundColor: 'rgb(254, 226, 226)',
    },
    likeCount: { 
        fontSize: 14, 
        color: "rgb(153, 179, 214)",
        fontWeight: '400'
    },
    likeCountActive: {
        color: "rgb(220, 38, 38)",
        fontWeight: '600'
    },
});
