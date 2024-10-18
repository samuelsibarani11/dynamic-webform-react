import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://tpxilwjdobqcyadsyywq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRweGlsd2pkb2JxY3lhZHN5eXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3NzY2MjUsImV4cCI6MjA0MDM1MjYyNX0.VID-U3d6_peERxno1KGM19hdtmbTcEAnaI2At7fCzg8"
);
