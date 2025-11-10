import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (userData) => {
        console.log('Storing user data:', userData); // Debug
        set({
          user: {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar
          },
          token: userData.token,
          isAuthenticated: true
        });
      },
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'auth-storage'
    }
  )
);

export default useAuthStore;
