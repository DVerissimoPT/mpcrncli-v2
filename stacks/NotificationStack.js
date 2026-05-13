import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';
import Notification from '../components/Notification';
import PostDetails from '../pages/PostDetails';

const Stack = createStackNavigator();

export default function NotificationStack() {
  return (
    <Stack.Navigator initialRouteName='Notifications'>
      <Stack.Screen
        name='Notifications'
        component={Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='PostDetails'
        component={PostDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}