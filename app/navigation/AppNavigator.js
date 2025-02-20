import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
        }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          title: 'Crucigrama',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
