// Test script to verify Supabase client connection
// Run this in browser console to check if client is configured correctly

// Check environment variables
console.log('=== ENVIRONMENT CHECK ===');
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log('Key length:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.length);
console.log('Key starts with eyJ:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith('eyJ'));

// Check Supabase client
import { supabase } from '@/integrations/supabase/client';

// Check current session
supabase.auth.getSession().then(({ data, error }) => {
  console.log('=== SESSION CHECK ===');
  console.log('Session:', data.session);
  console.log('Error:', error);
  console.log('User:', data.session?.user);
  console.log('Is anonymous:', !data.session?.user);
});

// Try a simple query to test connection
supabase
  .from('site_settings')
  .select('*')
  .single()
  .then(({ data, error }) => {
    console.log('=== CONNECTION TEST ===');
    console.log('Data:', data);
    console.log('Error:', error);
    if (error) {
      console.error('Connection failed:', error.message);
    } else {
      console.log('✓ Connection successful!');
    }
  });
