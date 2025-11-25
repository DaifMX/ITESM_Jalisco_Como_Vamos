import { authClient } from "@/lib/auth-client"

export const isUsingSocialProvider = async (): Promise<boolean> => {
  const session = await authClient.getSession()
  
  if (!session.data?.user) {
    return false;
  }
  
  const accountsResponse = await authClient.listAccounts()
  
  if (!accountsResponse.data || accountsResponse.data.length === 0) {
    return false;
  }
  
    return true;
}