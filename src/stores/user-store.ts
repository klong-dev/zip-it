import { authHelpers } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface UserState {
     user: User | null
     loading: boolean
     setUser: (user: User | null) => void
     fetchUser: () => Promise<void>
     getRedirectAfterLogin: () => string | null
     clearRedirectAfterLogin: () => void
}

export const useUserStore = create<UserState>((set) => ({
     user: null,
     loading: false,
     setUser: (user) => set({ user }),
     fetchUser: async () => {
          set({ loading: true })
          const response = await authHelpers.getCurrentUser()
          set({ user: response.data.user, loading: false })
     },
     getRedirectAfterLogin: () => {
          if (typeof window !== 'undefined') {
               return sessionStorage.getItem('redirectAfterLogin')
          }
          return null
     },
     clearRedirectAfterLogin: () => {
          if (typeof window !== 'undefined') {
               sessionStorage.removeItem('redirectAfterLogin')
          }
     }
}))