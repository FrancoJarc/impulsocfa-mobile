import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kweqoqguupwxgbwavyfb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ZXFvcWd1dXB3eGdid2F2eWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMTYzMTcsImV4cCI6MjA3MjY5MjMxN30.8mTZig7qpVjXWyHAjrPHenWwNbSQMbRUMNSqZr-m6u4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);