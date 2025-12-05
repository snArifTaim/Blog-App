import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostList from '../screens/PostList';
import PostDetails from '../screens/PostDetails';
import Favorites from '../screens/Favorites';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="PostList" component={PostList} />
                <Stack.Screen name="PostDetails" component={PostDetails} />
                <Stack.Screen name="Favorites" component={Favorites} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
