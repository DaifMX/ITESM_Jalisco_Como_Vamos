import { authClient } from "@/lib/auth-client"

export const isUsingSocialProvider = async (): Promise<boolean> => {
  const session = await authClient.getSession()

  if (!session.data?.user) return false;

  const accountsResponse = await authClient.listAccounts();
  
  if (!accountsResponse.data || accountsResponse.data.length === 0) return false;

  for (let acc of accountsResponse.data) {
    if (acc.providerId === 'credential') return false;
  }
  
  return true;
}