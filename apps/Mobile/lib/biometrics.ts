import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

import { authClient } from "@/lib/auth-client";

async function checkBiometric() {
  const isAvailable = await LocalAuthentication.hasHardwareAsync();
  if (!isAvailable) throw new Error("Biometric hardware not available");

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) throw new Error("No biometrics enrolled");
}

// Check if user has registered a passkey without triggering biometric prompt
export async function hasPasskeyStored(): Promise<boolean> {
  try {
    // Check if there's a stored passkey credential in secure storage
    const passkeyData = await SecureStore.getItemAsync("jcv_passkey_credential");
    return !!passkeyData;
  } catch {
    return false;
  }
}

export async function loginBiometric() {
  await checkBiometric();

  // Ask FaceID/TouchID
  const authResult = await LocalAuthentication.authenticateAsync({
    promptMessage: "Iniciar sesión con biometricos.",
  });

  if (!authResult.success) throw new Error("Biometric authentication failed");

  // Login with passkey - signIn returns a promise
  return await authClient.signIn.passkey({ autoFill: true });
}

export async function addBiometric() {
  await checkBiometric();

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Confirm with biometrics",
  });

  if (!result.success) throw new Error("Biometric authentication failed.");

  try {
    // Check if user is already logged in
    const session = await authClient.getSession();

    if (!session || !session.user) {
      throw new Error("User must be logged in to add biometric.");
    }

    // Store a flag indicating biometric is set up
    await SecureStore.setItemAsync("jcv_passkey_credential", "true");
    
    console.log('Biometric authentication enabled successfully');
    
    return { success: true };
  } catch (error: any) {
    console.error("Error adding biometric:", error);
    throw error;
  }
}
