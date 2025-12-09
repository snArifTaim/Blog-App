import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={styles.container}>
            <View style={[
                styles.tabBar,
                {
                    backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
                    shadowColor: isDark ? '#000' : '#000',
                    shadowOffset: { width: 0, height: isDark ? 8 : 4 },
                    shadowOpacity: isDark ? 0.4 : 0.15,
                    shadowRadius: isDark ? 16 : 12,
                }
            ]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // Get icon name based on route
                    let iconName;
                    if (route.name === 'Explore') {
                        iconName = isFocused ? 'document-text' : 'document-text-outline';
                    } else if (route.name === 'Favorites') {
                        iconName = isFocused ? 'heart' : 'heart-outline';
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabButton}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.iconContainer,
                                isFocused && styles.activeIconContainer
                            ]}>
                                <Ionicons
                                    name={iconName}
                                    size={24}
                                    color={isFocused ? '#007AFF' : (isDark ? '#8E8E93' : '#999999')}
                                />
                                {isFocused && <View style={styles.activeDot} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        height: 70,
        borderRadius: 35,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
        elevation: 24,
        minWidth: 200,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeIconContainer: {
        transform: [{ scale: 1.1 }],
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#30D158',
        position: 'absolute',
        bottom: -8,
    },
});

export default CustomTabBar;
