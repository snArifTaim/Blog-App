import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getPosts } from '../services/mockDataService';
import PostCard from '../components/PostCard';
import { Ionicons } from '@expo/vector-icons';
import eventBus from '../services/eventBus';

const TAB_BAR_HEIGHT = 100; // Floating tab bar height + bottom margin

const PostList = ({ navigation }) => {
    const { colors, toggleTheme, theme } = useTheme();
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;

    const fetchPosts = async (pageNum) => {
        try {
            setError(null);
            const result = await getPosts(pageNum, LIMIT);
            if (pageNum === 1) {
                setPosts(result.posts);
            } else {
                setPosts(prev => [...prev, ...result.posts]);
            }
            setHasMore(result.hasMore);
        } catch (err) {
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, []);

    useEffect(() => {
        const off = eventBus.on('postLikesUpdated', ({ id, likes }) => {
            setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes } : p)));
        });
        return off;
    }, []);

    useEffect(() => {
        const offDelta = eventBus.on('postLikesDelta', ({ id, delta }) => {
            setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + delta } : p)));
        });
        return offDelta;
    }, []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            setLoading(true);
            fetchPosts(nextPage);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchPosts(1);
    };

    const insets = useSafeAreaInsets();

    const handlePostPress = useCallback((postId) => {
        navigation.navigate('PostDetails', { postId });
    }, [navigation]);

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top + 12 }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Mini Blog</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                    <Ionicons
                        name={theme === 'light' ? 'moon' : 'sunny'}
                        size={24}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFooter = () => {
        if (!loading || posts.length === 0) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No posts found</Text>
        </View>
    );

    const renderItem = useCallback(({ item }) => (
        <PostCard post={item} onPress={() => handlePostPress(item.id)} />
    ), [handlePostPress]);

    const keyExtractor = useCallback((item) => item.id, []);

    if (error && posts.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>Error loading posts</Text>
                    <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>{error}</Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: colors.primary }]}
                        onPress={handleRefresh}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {renderHeader()}
            <FlatList
                data={posts}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={!loading ? renderEmpty : null}
                contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
            />
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
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        marginTop: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    errorMessage: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PostList;
