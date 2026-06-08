import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

const PostCard = ({ post, onPress }) => {
    const { colors } = useTheme();
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(post.id);

    const handleToggleFavorite = () => {
        toggleFavorite(post.id);
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {post.title}
                </Text>
                <TouchableOpacity onPress={handleToggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFav ? '#FF4458' : colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>
            <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
                {post.body}
            </Text>
            <View style={styles.likesContainer}>
                <Ionicons name="heart" size={16} color="#FF4458" />
                <Text style={[styles.likesText, { color: colors.textSecondary }]}>
                    {post.likes || 0} {post.likes === 1 ? 'like' : 'likes'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// Memoize component to prevent unnecessary re-renders from parent
// Context changes (favorites) bypass memo and re-render correctly
const MemoizedPostCard = React.memo(PostCard, (prevProps, nextProps) => {
    return (
        prevProps.post.id === nextProps.post.id &&
        prevProps.post.likes === nextProps.post.likes
    );
});

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    body: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    likesText: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default MemoizedPostCard;
