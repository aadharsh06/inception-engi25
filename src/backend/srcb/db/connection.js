// Devansh pls connect SUPABASE here and export a connectToDB function from this file

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const supabaseUrl = process.env.PROJECT_URL;
const supabaseAnonKey = process.env.ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const connectToDB = async () => {
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error ) { 
           throw error;
        }
        console.log("Successfully connected to Supabase.");
    } catch (error) {
        console.error("Error connecting to Supabase:", error.message);
        process.exit(1);
    }
};

export default connectToDB;
