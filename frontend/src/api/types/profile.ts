import { Database } from "@/supabase/types/supabase.data.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
