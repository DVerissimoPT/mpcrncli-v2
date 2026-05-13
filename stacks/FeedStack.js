import React, { useEffect, useLayoutEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import PostDetails from '../pages/PostDetails';
import AddPost from '../pages/AddPost';
import EditProfile from '../pages/EditProfile';
import SearchPeople from '../pages/SearchPeople';

const Stack = createStackNavigator();

export default function FeedStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName='Feed'>
      <Stack.Screen
        name='Feed'
        component={Feed}
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
      <Stack.Screen
        name='AddPost'
        component={AddPost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='EditProfile'
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SearchPeople'
        component={SearchPeople}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
