// import { createClient } from '@supabase/supabase-js'
import { createClient } from "@/utils/supabase/client";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabase = createClient();

export const authHelpers = {
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signUpWithEmail: async (full_name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/callback`
      },
    });
    return { data, error };
  },

  signInWithOAuth: async (provider: "google" | "facebook" | "github") => {
    try {
      const redirectUrl = `${window.location.origin}/callback`;
      console.log("Initiating OAuth with redirect:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error("OAuth error:", error);
      } else {
        console.log("OAuth initiated successfully:", data);
      }

      return { data, error };
    } catch (err) {
      console.error("Exception in signInWithOAuth:", err);
      return {
        data: { provider, url: "" },
        error: new Error("Failed to initiate OAuth"),
      };
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },
};
