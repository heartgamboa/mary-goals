import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
<<<<<<< HEAD
import { AuthProvider } from '../context/AuthContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="upload" options={{ headerShown: false }} />
        <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  )
}
=======

export default function RootLayout() {

  return (
  <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="goals" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}
>>>>>>> 329236c89de1b765927f9e69d38a6430509a84cb
