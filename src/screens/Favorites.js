import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { getPost } from '../services/mockDataService';
import PostCard from '../components/PostCard';
import { Ionicons } from '@expo/vector-icons';

const TAB_BAR_HEIGHT = 100; // Floating tab bar height + bottom margin

const Favorites = ({ navigation }) => {
    const { colors } = useTheme();
    const { favoriteIds } = useFavorites();
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Reload favorite posts when screen is focused or favoriteIds change
    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [favoriteIds])
    );

    const loadFavorites = async () => {
        setLoading(true);
        try {
            if (favoriteIds.length === 0) {
                setFavoritePosts([]);
                return;
            }

            // Fetch each favorited post by ID (no wasteful full-scan)
            const postPromises = favoriteIds.map((id) => getPost(id));
            const posts = await Promise.all(postPromises);
            // Filter out any null results (deleted posts)
            setFavoritePosts(posts.filter(Boolean));
        } finally {
            setLoading(false);
        }
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No favorite posts yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Tap the heart icon on posts to add them here
            </Text>
        </View>
    );

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top + 12 }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Favorites</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={favoritePosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
                    />
                )}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={[
                    { paddingBottom: TAB_BAR_HEIGHT },
                    favoritePosts.length === 0 ? styles.emptyList : null,
                ]}
                refreshing={loading}
                onRefresh={loadFavorites}
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyList: {
        flex: 1,
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
        fontWeight: '600',
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
});

export default Favorites;
