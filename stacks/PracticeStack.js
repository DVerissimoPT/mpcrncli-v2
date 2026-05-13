import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Practice from '../pages/Practice';
import Profile from '../pages/Profile';
import AddForm from '../pages/AddForm';
import AddParameter from '../pages/AddParameter';
import SearchForms from '../pages/SearchForms';
import FormDetail from '../pages/FormDetail';
import Form from '../components/Form';
import FormCompleted from '../pages/FormCompleted';

const Stack = createStackNavigator();

export default function PracticeStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName='Practice'>
      <Stack.Screen
        name='Practice'
        component={Practice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='StudyProfile'
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='AddForm'
        component={AddForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='AddParameter'
        component={AddParameter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SearchForms'
        component={SearchForms}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='FormCompleted'
        component={FormCompleted}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
