import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

const SPOTS_BUCKET = 'ride-spot-photos';

export async function uploadSpotPhoto(localUri: string, fileName: string): Promise<string> {
  if (!supabase) {
    // No Supabase project configured yet — keep using the local URI so the
    // prototype still works end-to-end without a backend.
    return localUri;
  }

  const response = await fetch(localUri);
  const blob = await response.blob();
  const path = `${Date.now()}-${fileName}`;

  const { error } = await supabase.storage.from(SPOTS_BUCKET).upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
  });
  if (error) throw error;

  const { data } = supabase.storage.from(SPOTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
