'use strict';
(async()=>{
  await new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='cloud-config.js?v=1';
    script.onload=resolve;
    script.onerror=()=>reject(new Error('Cloudkonfiguration konnte nicht geladen werden.'));
    document.body.appendChild(script);
  });

  const cloud=await import('./cloud-bridge.js?v=1');
  const allowed=await cloud.prepare();
  if(!allowed)return;

  const modules=['market-review.js','market-classification.js','app-core.js','app-preview.js','app-forms.js','market-ui.js','market-classification-ui.js','market-layout.js','part-a-v2.js','app-main.js'];
  for(const src of modules){
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=`${src}?v=5`;
      script.onload=resolve;
      script.onerror=()=>reject(new Error('Modul konnte nicht geladen werden.'));
      document.body.appendChild(script);
    });
  }
})().catch(error=>{
  console.error(error);
  document.body.textContent='Anwendung konnte nicht geladen werden.';
});
