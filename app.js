'use strict';
(async()=>{
  const modules=['market-review.js','app-core.js','app-preview.js','app-forms.js','market-ui.js','app-main.js'];
  for(const src of modules){
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=`${src}?v=3`;
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
