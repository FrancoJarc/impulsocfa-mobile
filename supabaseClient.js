import { createClient } from "@supabase/supabase-js";
import * as WebBrowser from 'expo-web-browser'; // <-- 1. Importar WebBrowser

// LLAMADA CLAVE: Esto le dice a Expo que complete la sesión de OAuth 
// y devuelva el control a la aplicación, cerrando la ventana del navegador.
WebBrowser.maybeCompleteAuthSession(); // <-- 2. Llamar a la función

const SUPABASE_URL = "https://kweqoqguupwxgbwavyfb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ZXFvcWd1dXB3eGdid2F2eWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMTYzMTcsImV4cCI6MjA3MjY5MjMxN30.8mTZig7qpVjXWyHAjrPHenWwNbSQMbRUMNSqZr-m6u4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        // 3. Configurar el flujo de autenticación para móvil/OAuth.
        // PKCE (Proof Key for Code Exchange) es el método seguro recomendado 
        // para la autenticación sin servidor (como React Native).
        flowType: 'pkce',
    },
});