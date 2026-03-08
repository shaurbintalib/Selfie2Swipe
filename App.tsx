import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './src/types';
import UploadScreen from './src/screens/UploadScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import SliderScreen from './src/screens/SliderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
          <Stack.Navigator
            initialRouteName="Upload"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#1A1A2E' },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Upload" component={UploadScreen} />
            <Stack.Screen
              name="Processing"
              component={ProcessingScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Gallery" component={GalleryScreen} />
            <Stack.Screen
              name="Slider"
              component={SliderScreen}
              options={{ animation: 'fade', presentation: 'fullScreenModal' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
