import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { getPost } from '../services/mockDataService';
import { Ionicons } from '@expo/vector-icons';
import eventBus from '../services/eventBus';

const PostDetails = ({ route, navigation }) => {
    const { postId } = route.params;
    const { colors } = useTheme();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isFav = isFavorite(postId);

    useEffect(() => {
        loadPost();
    }, [postId]);

    useEffect(() => {
        const off = eventBus.on('postLikesUpdated', ({ id, likes }) => {
            if (id === postId) {
                setPost((prev) => (prev ? { ...prev, likes } : prev));
            }
        });
        return off;
    }, [postId]);

    useEffect(() => {
        const offDelta = eventBus.on('postLikesDelta', ({ id, delta }) => {
            if (id === postId) {
                setPost((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + delta } : prev));
            }
        });
        return offDelta;
    }, [postId]);

    const loadPost = async () => {
        try {
            const data = await getPost(postId);
            setPost(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = () => {
        if (!post) return;
        toggleFavorite(post.id);
    };

    const insets = useSafeAreaInsets();

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top + 12 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Post Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top + 12 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Post Details</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>Post not found</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Post Details</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView style={styles.content}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>

                    <View style={styles.likesContainer}>
                        <Ionicons name="heart" size={18} color="#FF4458" />
                        <Text style={[styles.likesCount, { color: colors.textSecondary }]}>
                            {post.likes || 0} {(post.likes || 0) === 1 ? 'like' : 'likes'}
                        </Text>
                    </View>

                    <Text style={[styles.body, { color: colors.textSecondary }]}>{post.body}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[
                                styles.favoriteButton,
                                {
                                    backgroundColor: isFav ? '#FFF0F1' : colors.card,
                                    borderColor: isFav ? '#FF4458' : colors.border,
                                },
                            ]}
                            onPress={handleToggleFavorite}
                        >
                            <Ionicons
                                name={isFav ? 'heart' : 'heart-outline'}
                                size={20}
                                color={isFav ? '#FF4458' : colors.text}
                            />
                            <Text style={[styles.favoriteButtonText, { color: isFav ? '#FF4458' : colors.text }]}>
                                {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    card: {
        margin: 16,
        padding: 20,
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    likesCount: {
        fontSize: 16,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    actions: {
        marginTop: 16,
        gap: 12,
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    favoriteButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        marginTop: 16,
    },
});

export default PostDetails;
