import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PostList from '../screens/PostList';
import PostDetails from '../screens/PostDetails';
import Favorites from '../screens/Favorites';
import { useTheme } from '../context/ThemeContext';
import CustomTabBar from '../components/CustomTabBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Explore Stack (PostList -> PostDetails)
const ExploreStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="PostList" component={PostList} />
            <Stack.Screen name="PostDetails" component={PostDetails} />
        </Stack.Navigator>
    );
};

// Bottom Tabs Navigator
const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Explore"
                component={ExploreStack}
            />
            <Tab.Screen
                name="Favorites"
                component={Favorites}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;
