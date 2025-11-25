
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onulpitfgejsmjlzdhil.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udWxwaXRmZ2Vqc21qbHpkaGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTY1NjAsImV4cCI6MjA3OTU3MjU2MH0.h6nYvmvoEN8IU-R0phPaTwybBqj543xfgRGLX5dDlDc';

export const supabase = createClient(supabaseUrl, supabaseKey);
