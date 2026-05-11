import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/auth';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';

export default function Index() {
  const { uid, loading } = useAuthStore();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bgBase }}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  return <Redirect href={uid ? '/(tabs)/home' : '/(auth)/welcome'} />;
}
