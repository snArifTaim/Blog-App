import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReactiveVar } from '@apollo/client';
import { useTheme } from '../context/ThemeContext';
import { favoritePostsVar } from '../apollo/client';
import PostCard from '../components/PostCard';
import { Ionicons } from '@expo/vector-icons';

const Favorites = ({ navigation }) => {
    const { colors } = useTheme();
    const favorites = useReactiveVar(favoritePostsVar);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No favorite posts yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Tap the star icon on posts to add them here
            </Text>
        </View>
    );

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Favorites</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
                    />
                )}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={favorites.length === 0 ? styles.emptyList : null}
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
