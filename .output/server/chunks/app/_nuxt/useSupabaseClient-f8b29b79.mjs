import { f as useSupabaseToken, g as createSupabaseClient, h as useNuxtApp } from '../server.mjs';

const useSupabaseClient = () => {
  var _a;
  const nuxtApp = useNuxtApp();
  const token = useSupabaseToken();
  const Authorization = token.value ? `Bearer ${token.value}` : void 0;
  const recreateClient = ((_a = nuxtApp._supabaseClient) == null ? void 0 : _a.headers.Authorization) !== Authorization;
  if (!nuxtApp._supabaseClient || recreateClient) {
    nuxtApp._supabaseClient = createSupabaseClient();
  }
  return nuxtApp._supabaseAuthClient;
};

export { useSupabaseClient as u };
//# sourceMappingURL=useSupabaseClient-f8b29b79.mjs.map
