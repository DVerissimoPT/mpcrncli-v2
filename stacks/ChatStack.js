import React, { useEffect, useState, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../pages/Chat';
import ChatDetail from '../pages/ChatDetail';
import Messages from '../components/Messages';
import { GlobalContext } from '../context/Context';
import Person from '../components/Person';
import { Image } from 'react-native';

const Stack = createStackNavigator();

export default function PracticeStack({ navigation }) {
  const [headerTitle, setHeaderTitle] = useState('');
  const { darkEnabled } = useContext(GlobalContext);

  const setHeader = (title) => {
    setHeaderTitle(title);
  };

  return (
    <Stack.Navigator initialRouteName='Chat'>
      <Stack.Screen
        name='Chat'
        component={Chat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Messages'
        component={Messages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ChatDetail'
        component={ChatDetail}
        options={{
          headerShown: true,
          title: headerTitle,
          headerStyle: darkEnabled
            ? { backgroundColor: '#1a1a1a' }
            : { backgroundColor: '#fff' },
          headerTitleStyle: darkEnabled ? { color: '#fff' } : { color: '#000' },
          headerBackImage: () => (
            <Image
              style={
                darkEnabled
                  ? {
                      height: 20,
                      width: 10,
                      tintColor: '#fff',
                    }
                  : {
                      height: 20,
                      width: 10,
                      tintColor: '#000',
                    }
              }
              source={require('../assets/images/goback-icon-8.png')}
            />
          ),
        }}
        initialParams={{ setHeader: setHeader }}
      />
    </Stack.Navigator>
  );
}
