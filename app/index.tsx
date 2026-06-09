import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the animated Splash screen first
  return <Redirect href="/splash" />;
}
