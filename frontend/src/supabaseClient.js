import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dnkiajqppqxnutvwbkff.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua2lhanFwcHF4bnV0dndia2ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDA0MjY1MywiZXhwIjoyMDQ5NjE4NjUzfQ.XUfI8U9q57kaS8HDUTaDuyB5TogWMjDkgnbzy3hiEZM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
