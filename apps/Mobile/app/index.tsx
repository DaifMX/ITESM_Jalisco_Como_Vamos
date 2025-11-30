import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';

import { authClient } from '@/lib/auth-client';

export default function Index() {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#003DA5" />
      </View>
    );
  }

  if (session.data) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
