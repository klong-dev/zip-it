import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initialize: () => void;
  getRedirectAfterLogin: () => string | null;
  clearRedirectAfterLogin: () => void;
}

// Flag để đảm bảo chỉ khởi tạo một lần
let isInitializing = false;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  initialize: () => {
    // Đã initialized hoặc đang initializing thì return
    if (get().initialized || isInitializing) return;
    isInitializing = true;
    set({ initialized: true });

    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user || null, loading: false });
    });

    // Lắng nghe thay đổi auth state
    supabase.auth.onAuthStateChange((event, session) => {
      set({ user: session?.user || null, loading: false });
    });
  },
  getRedirectAfterLogin: () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("redirectAfterLogin");
    }
    return null;
  },
  clearRedirectAfterLogin: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("redirectAfterLogin");
    }
  },
}));
