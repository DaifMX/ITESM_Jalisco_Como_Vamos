import { authClient } from "@/lib/auth-client"

export const isUsingSocialProvider = async (): Promise<boolean> => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<boolean>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    const checkProvider = async (): Promise<boolean> => {
      const session = await authClient.getSession();

      if (!session.data?.user) return false;

      const accountsResponse = await authClient.listAccounts();
      
      if (!accountsResponse.data || accountsResponse.data.length === 0) return false;

      for (let acc of accountsResponse.data) {
        if (acc.providerId === 'credential') return false;
      }
      
      return true;
    };

    return await Promise.race([checkProvider(), timeoutPromise]);
  } catch {
    // Default to false (assume credential provider) if there's an error
    return false;
  }
}