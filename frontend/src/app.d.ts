// See https://svelte.dev/docs/kit/types#app

declare global {
  namespace App {}

  interface ImportMetaEnv {
    readonly SUPABASE_URL?: string;
    readonly SUPABASE_PUBLISHABLE_KEY?: string;
  }
}

export {};
