import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../services/store';

export default function RootLayout() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  // We can track hydration here if needed, but since we are running a mobile app,
  // standard Stack navigator works directly.
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0c0a0f' },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="home" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="text-input" />
        <Stack.Screen name="explanation" />
        <Stack.Screen name="flashcards" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="history" />
        <Stack.Screen name="profile" />
      </Stack>
    </>
  );
}
