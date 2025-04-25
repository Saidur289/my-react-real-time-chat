export const createAuthSlice = (set) => ({
    userInfo: undefined,
    loading: true,
    setUserInfo: (userInfo) => set({userInfo}),
    setLoading: (value) => set({ loading: value }), // ✅ Add this
   
})