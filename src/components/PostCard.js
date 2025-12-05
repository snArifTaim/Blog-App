import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useReactiveVar } from '@apollo/client';
import { favoritePostsVar } from '../apollo/client';
import { Ionicons } from '@expo/vector-icons';

const PostCard = ({ post, onPress }) => {
    const { colors } = useTheme();
    const favorites = useReactiveVar(favoritePostsVar);
    const isFavorite = favorites.some((p) => p.id === post.id);

    const toggleFavorite = () => {
        const currentFavorites = favoritePostsVar();
        if (isFavorite) {
            favoritePostsVar(currentFavorites.filter((p) => p.id !== post.id));
        } else {
            favoritePostsVar([...currentFavorites, post]);
        }
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
                <TouchableOpacity onPress={toggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons
                        name={isFavorite ? 'star' : 'star-outline'}
                        size={24}
                        color={isFavorite ? '#FFD700' : colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>
            <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
                {post.body}
            </Text>
        </TouchableOpacity>
    );
};

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
    },
});

export default PostCard;
