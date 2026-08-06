'use strict';
(function(){
  const shared=window.EHS_PLATFORM_CONFIG||{};
  window.BSO_CLOUD_CONFIG=Object.freeze({
    supabaseUrl:shared.supabaseUrl||'',
    supabasePublishableKey:shared.supabasePublishableKey||shared.supabaseAnonKey||'',
    appKey:'brandschutzordnung',
    storageKey:'bso-studio-project'
  });
})();
