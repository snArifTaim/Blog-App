import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { favoritePostsVar } from '../apollo/client';
import { useTheme } from '../context/ThemeContext';
import { GET_POST, LIKE_POST } from '../apollo/queries';
import { Ionicons } from '@expo/vector-icons';

const PostDetails = ({ route, navigation }) => {
    const { postId } = route.params;
    const { colors } = useTheme();
    const [liked, setLiked] = useState(false);
    const favorites = useReactiveVar(favoritePostsVar);

    const { data, loading, error } = useQuery(GET_POST, {
        variables: { id: postId },
    });

    const [likePost, { loading: likeLoading }] = useMutation(LIKE_POST, {
        onCompleted: () => {
            setLiked(true);
        },
    });

    const handleLike = () => {
        likePost({ variables: { id: postId } });
    };

    const isFavorite = favorites.some((p) => p.id === data?.post?.id);

    const toggleFavorite = () => {
        if (!data?.post) return;
        const currentFavorites = favoritePostsVar();
        if (isFavorite) {
            favoritePostsVar(currentFavorites.filter((p) => p.id !== data.post.id));
        } else {
            favoritePostsVar([...currentFavorites, data.post]);
        }
    };

    const insets = useSafeAreaInsets();

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top }]}>
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

    if (error || !data?.post) {
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

    const post = data.post;

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
                            {(post.likes || 0) + (liked ? 1 : 0)} {((post.likes || 0) + (liked ? 1 : 0)) === 1 ? 'like' : 'likes'}
                        </Text>
                    </View>

                    <Text style={[styles.body, { color: colors.textSecondary }]}>{post.body}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.likeButton, { opacity: likeLoading || liked ? 0.6 : 1 }]}
                            onPress={handleLike}
                            disabled={likeLoading || liked}
                        >
                            {likeLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons
                                        name="thumbs-up"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                    <Text style={styles.likeButtonText}>
                                        {liked ? 'Liked!' : 'Like Post'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.favoriteButton, { borderColor: colors.border }]}
                            onPress={toggleFavorite}
                        >
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={20}
                                color={isFavorite ? '#FF4458' : colors.text}
                            />
                            <Text style={[styles.favoriteButtonText, { color: colors.text }]}>
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
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
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        gap: 8,
    },
    likeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
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
