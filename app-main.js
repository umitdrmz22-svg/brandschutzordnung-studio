'use strict';
(()=>{
  const A=window.BSO_APP,$=A.$;
  A.buildStatic();
  A.loadLocal();
  A.bind();
  A.refreshInputs();
  $('#steps').addEventListener('click',e=>{const b=e.target.closest('button[data-section]');if(b)A.showSection(b.dataset.section);});
  $('#previewTabs').addEventListener('click',e=>{const b=e.target.closest('button[data-preview]');if(b&&!b.disabled){A.previewPart=b.dataset.preview;A.renderPreview();}});
  $('#checkBtn').addEventListener('click',A.showCheck);
  $('#finalCheckBtn').addEventListener('click',A.showCheck);
  $('#printBtn').addEventListener('click',()=>window.print());
  $('#saveBtn').addEventListener('click',A.downloadProject);
  $('#newBtn').addEventListener('click',()=>{if(confirm('Alle Eingaben dieses Projekts zurücksetzen?')){A.data=A.R.cloneDefaults();A.lastResults=[];localStorage.removeItem('bso-studio-project');A.refreshInputs();A.showSection('meta');}});
  $('#demoBtn').addEventListener('click',A.demo);
  $('#openFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{A.mergeProject(JSON.parse(await file.text()));A.refreshInputs();A.saveLocal();A.showSection('meta');}catch(err){alert('Die Projektdatei ist ungültig oder konnte nicht gelesen werden.');}finally{e.target.value='';}});
})();
