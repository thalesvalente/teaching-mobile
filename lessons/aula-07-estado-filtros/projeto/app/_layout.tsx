import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return <SafeAreaProvider>
    <Head><title>Aula 07 · Dados em movimento</title></Head>
    <Stack screenOptions={{ headerShown: false }} />
  </SafeAreaProvider>;
}
