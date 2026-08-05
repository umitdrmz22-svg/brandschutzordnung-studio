'use strict';
(()=>{
  const A=window.BSO_APP,$=A.$,$$=A.$$;
  const sectorField=$('[data-path="applicability.sectorRuleReference"]')?.closest('label');
  const notesField=$('[data-path="applicability.notes"]')?.closest('label');
  if(sectorField&&notesField&&sectorField.nextElementSibling!==notesField){
    notesField.parentNode.insertBefore(sectorField,notesField);
  }

  const symbolNotice=$('#partA .info.warning');
  if(symbolNotice){
    symbolNotice.innerHTML='<b>Sicherheitszeichen – Entwurfsstatus</b><p>Die derzeit dargestellten Symbolfelder sind keine freigegebenen ISO-7010-Grafikdateien. Teil A darf bis zur Einbindung und Prüfung der Originalzeichen nur als Entwurf verwendet werden. Maßgeblich sind ASR A1.3, DIN EN ISO 7010 und die tatsächlichen örtlichen Einrichtungen.</p>';
  }

  const baseRender=A.renderPreview;
  A.renderPreview=()=>{
    baseRender();
    const print=$('#printBtn');
    if(A.previewPart==='A'){
      const document=$('#preview');
      if(document&&!document.querySelector('.symbol-draft-watermark')) document.insertAdjacentHTML('afterbegin','<div class="symbol-draft-watermark">ENTWURF – SICHERHEITSZEICHEN VOR FREIGABE ERSETZEN</div>');
      if(print) print.textContent='Entwurf drucken / PDF';
    }else if(print){
      print.textContent='Drucken / PDF';
    }
  };
})();
