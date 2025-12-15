import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface Prayer {
  id: string;
  author: string;
  user_id?: string;
  timestamp: string;
  mssv?: string;
  subject?: string;
  grade?: string;
  prayer?: string;
  created_at: string;
}

export interface CreatePrayerInput {
  author: string;
  user_id?: string;
  mssv?: string;
  subject?: string;
  grade?: string;
  prayer?: string;
}

// Fetch all prayers ordered by timestamp
export async function getPrayers(): Promise<Prayer[]> {
  const { data, error } = await supabase
    .from("prayers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prayers:", error);
    return [];
  }

  return data || [];
}

// Create a new prayer
export async function createPrayer(input: CreatePrayerInput): Promise<Prayer | null> {
  const { data, error } = await supabase
    .from("prayers")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating prayer:", error);
    return null;
  }

  return data;
}

// Subscribe to real-time prayer updates
export function subscribeToPrayers(
  onInsert: (prayer: Prayer) => void,
  onDelete?: (id: string) => void
): RealtimeChannel {
  const channel = supabase
    .channel("prayers-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "prayers",
      },
      (payload) => {
        onInsert(payload.new as Prayer);
      }
    );

  if (onDelete) {
    channel.on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "prayers",
      },
      (payload) => {
        onDelete((payload.old as { id: string }).id);
      }
    );
  }

  channel.subscribe();

  return channel;
}

// Unsubscribe from real-time updates
export function unsubscribeFromPrayers(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
