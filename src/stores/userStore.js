// src/store/userStore.js
import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // 사용자 정보 가져오는 액션 (선택 사항)
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/me"); // 실제 API 엔드포인트로 변경
      set({ user: response.data, loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },

  // 사용자 정보 업데이트 액션
  setUser: (userData) => set({ user: userData }),

  // 로그아웃 액션 (예시)
  clearUser: () => set({ user: null }),
}));
