'use strict';
(async()=>{
  const modules=['market-review.js','market-classification.js','app-core.js','app-preview.js','app-forms.js','market-ui.js','market-classification-ui.js','market-layout.js','part-a-v2.js','app-main.js'];
  for(const src of modules){
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=`${src}?v=4`;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`Modul konnte nicht geladen werden: ${src}`));
      document.body.appendChild(script);
    });
  }
})().catch(error=>{
  console.error(error);
  const target=document.getElementById('preview');
  if(target) target.innerHTML='<div style="padding:24px;color:#b42318"><strong>Anwendung konnte nicht geladen werden.</strong><br>Bitte Seite neu laden oder Browser-Konsole prüfen.</div>';
});
