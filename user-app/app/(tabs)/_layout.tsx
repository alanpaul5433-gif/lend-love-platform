import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '../../src/theme/ThemeProvider';

const TabIcon = ({ glyph, color }: { glyph: string; color: string }) => (
  <Text style={{ fontSize: 22, color }}>{glyph}</Text>
);

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.bgSurface,
          borderTopColor: theme.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon glyph="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color }) => <TabIcon glyph="◫" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-loans"
        options={{
          title: 'My Loans',
          tabBarIcon: ({ color }) => <TabIcon glyph="₪" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <TabIcon glyph="✎" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon glyph="◉" color={color} />,
        }}
      />
    </Tabs>
  );
}
