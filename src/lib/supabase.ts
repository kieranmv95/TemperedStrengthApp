import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: number;
          name: string;
          pattern: string;
          muscle: string;
          equipment: string;
          created_at: string;
          updated_at: string;
          logging_type: "reps" | "time";
        };
        Insert: {
          id: string;
          name: string;
          pattern: string;
          muscle: string;
          equipment: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          pattern?: string;
          muscle?: string;
          equipment?: string;
          updated_at?: string;
        };
      };
    };
  };
};

const supabaseUrl = "https://dkuttngffalvevvwtmkz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdXR0bmdmZmFsdmV2dnd0bWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDQzMjMsImV4cCI6MjA4MzUyMDMyM30.9CxQCxwHim-YHouOTcppU6huE12xowjdclFpdk2F7-g";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
