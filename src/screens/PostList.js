import React, { useState } from 'react';
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
import { useQuery } from '@apollo/client';
import { useTheme } from '../context/ThemeContext';
import { GET_POSTS } from '../apollo/queries';
import PostCard from '../components/PostCard';
import { Ionicons } from '@expo/vector-icons';

const PostList = ({ navigation }) => {
    const { colors, toggleTheme, theme } = useTheme();
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS, {
        variables: { page: 1, limit: LIMIT },
        notifyOnNetworkStatusChange: true,
    });

    const handleLoadMore = () => {
        if (!loading) {
            fetchMore({
                variables: { page: page + 1, limit: LIMIT },
            }).then(() => {
                setPage(page + 1);
            });
        }
    };

    const handleRefresh = () => {
        setPage(1);
        refetch({ page: 1, limit: LIMIT });
    };

    const insets = useSafeAreaInsets();

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Mini Blog</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.iconButton}>
                    <Ionicons name="star" size={24} color={colors.primary} />
                </TouchableOpacity>
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
        if (!loading) return null;
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

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>Error loading posts</Text>
                    <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>{error.message}</Text>
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
                data={data?.posts || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard post={item} onPress={() => navigation.navigate('PostDetails', { postId: item.id })} />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={!loading ? renderEmpty : null}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && page === 1}
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
