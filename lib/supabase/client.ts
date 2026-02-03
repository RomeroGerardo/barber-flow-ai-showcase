import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Usar valores por defecto vacíos para evitar errores durante el build de Next.js
  // En runtime, las variables de entorno reales estarán disponibles
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Si no hay URL/Key (durante build), retornar un cliente "dummy" que no hará nada
  // Esto previene el error "supabaseUrl is required" durante prerendering
  if (!supabaseUrl || !supabaseAnonKey) {
    // En el build, las variables no están disponibles
    // Retornamos un objeto que satisface la interfaz básica pero no hace llamadas reales
    // Esto es seguro porque el código de cliente solo se ejecuta en el navegador
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
