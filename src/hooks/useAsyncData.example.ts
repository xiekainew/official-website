import { useAsyncData } from './useAsyncData'

// Example usage
async function fetchUserData(userId: string): Promise<{ id: string; name: string; email: string }> {
  // Simulate API call
  const response = await fetch(`https://api.example.com/users/${userId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`)
  }
  return response.json()
}

export function useUserData() {
  const { data: userData, error, loading, execute: fetchUser } = useAsyncData(fetchUserData)
  
  // You can call fetchUser with the required arguments
  // fetchUser('123') 
  
  return {
    userData,
    error,
    loading,
    fetchUser
  }
}

// In a Vue component:
/*
import { useUserData } from './hooks/useAsyncData.example'

export default {
  setup() {
    const { userData, error, loading, fetchUser } = useUserData()
    
    // Load user data when component is mounted
    onMounted(() => {
      fetchUser('123')
    })
    
    return {
      userData,
      error,
      loading,
      refreshUserData: () => fetchUser('123')
    }
  }
}
*/
