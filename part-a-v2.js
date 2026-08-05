'use strict';
(()=>{
  const A=window.BSO_APP;
  if(!A) throw new Error('part-a-v2.js benötigt BSO_APP');

  if(!document.querySelector('link[data-part-a-v2]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='part-a-v2.css?v=4';
    link.dataset.partAV2='true';
    document.head.appendChild(link);
  }

  const esc=A.esc;
  const blank=value=>value===null||value===undefined||String(value).trim()==='';
  const compact=value=>String(value||'').replace(/\s+/g,' ').trim();
  const unique=items=>[...new Set(items.map(compact).filter(Boolean))];
  const sentences=(value,limit=6)=>unique(String(value||'')
    .split(/(?:\r?\n|[.;](?:\s+|$))/)
    .map(item=>item.replace(/^[-•–—]\s*/,'')))
    .slice(0,limit);
  const list=items=>`<ul>${unique(items).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;

  const SVG={
    P002:`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43" fill="#fff" stroke="#c51624" stroke-width="10"/><path d="M20 60h48M28 52h34M66 52v8" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/><path d="M68 46c8-7 0-13 6-20M77 47c8-7 0-13 6-20" fill="none" stroke="#111" stroke-width="4"/><path d="M20 80 80 20" stroke="#c51624" stroke-width="11"/></svg>`,
    P003:`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43" fill="#fff" stroke="#c51624" stroke-width="10"/><path d="M49 76c-16-6-20-19-12-31 5-7 7-14 7-23 15 10 23 21 17 34 5-2 8-7 9-12 10 13 6 27-5 33-5 3-11 3-16-1Z" fill="#111"/><path d="M20 80 80 20" stroke="#c51624" stroke-width="11"/></svg>`,
    F006:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#c51624"/><path d="M24 19c5-4 12-2 15 3l7 12c2 4 1 8-2 11l-6 5c8 13 16 21 29 29l5-6c3-3 7-4 11-2l12 7c5 3 7 10 3 15l-5 7c-4 6-12 8-19 5-28-11-49-32-60-60-3-7-1-15 5-19Z" fill="#fff" transform="scale(.72) translate(14 3)"/><path d="M64 34c10 5 16 14 16 25M65 46c5 3 8 7 8 13" fill="none" stroke="#fff" stroke-width="5"/></svg>`,
    F005:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#c51624"/><rect x="25" y="15" width="31" height="36" rx="3" fill="none" stroke="#fff" stroke-width="5"/><circle cx="40.5" cy="33" r="7" fill="#fff"/><path d="M58 56c11-4 19 2 20 11l-1 16H44l1-13c1-8 5-12 13-14ZM47 57l-8-13c-2-4-8-2-7 3l5 17c1 5 5 8 10 9" fill="#fff"/></svg>`,
    E001:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#008b52"/><rect x="61" y="17" width="24" height="66" fill="none" stroke="#fff" stroke-width="5"/><circle cx="39" cy="27" r="8" fill="#fff"/><path d="m38 38 15 12 13-8M43 47l-8 18-17 9M48 50l5 19 17 10M32 42 18 56" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    E007:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#008b52"/><path d="M8 8h26v9H24l17 17-7 7-17-17v10H8ZM92 8H66v9h10L59 34l7 7 17-17v10h9ZM8 92h26v-9H24l17-17-7-7-17 17V66H8ZM92 92H66v-9h10L59 66l7-7 17 17V66h9Z" fill="#fff"/><circle cx="42" cy="47" r="6" fill="#fff"/><circle cx="58" cy="47" r="6" fill="#fff"/><path d="M34 58h32v18H34Z" fill="#fff"/></svg>`,
    F001:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#c51624"/><path d="M37 25h26v10h-6v9c9 5 14 14 14 25v17H29V69c0-11 5-20 14-25v-9h-6ZM55 17h18v7H55ZM64 20c10 1 15 6 17 14" fill="#fff"/></svg>`,
    F002:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#c51624"/><circle cx="49" cy="51" r="28" fill="none" stroke="#fff" stroke-width="8"/><circle cx="49" cy="51" r="10" fill="none" stroke="#fff" stroke-width="6"/><path d="M68 72h19v10H66c-8 0-12-6-12-12" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="m82 72 8-7" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>`,
    F004:`<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#c51624"/><path d="M22 69c5-18 17-28 28-28s23 10 28 28H22Z" fill="#fff"/><rect x="18" y="69" width="64" height="10" rx="2" fill="#fff"/><path d="M34 39c0-10 7-18 16-18s16 8 16 18" fill="none" stroke="#fff" stroke-width="7"/></svg>`
  };

  const sign=(code,label)=>`<span class="bso-a-sign" role="img" aria-label="${esc(`${code} ${label}`)}" title="${esc(`${code} ${label}`)}">${SVG[code]}</span>`;
  const signGroup=items=>`<div class="bso-a-signs">${items.map(([code,label])=>sign(code,label)).join('')}</div>`;

  A.renderA=()=>{
    const d=A.data;
    const preventText=compact(d.partA.prevent)||'Brandverhütungsregeln objektspezifisch festlegen.';
    const preventSigns=[];
    if(/rauch/i.test(preventText)) preventSigns.push(['P002','Rauchen verboten']);
    if(/flamme|offen(?:es|e|er)?\s+(?:licht|feuer)|zündquelle|feuer/i.test(preventText)) preventSigns.push(['P003','Keine offene Flamme']);
    if(!preventSigns.length) preventSigns.push(['P002','Rauchen verboten'],['P003','Keine offene Flamme']);

    const reportSigns=[['F006','Brandmeldetelefon']];
    if(/druckknopf|handfeuermelder|brandmelder|handmelder/i.test(`${d.alarm.alarmMethod} ${d.partA.report}`)) reportSigns.push(['F005','Brandmelder']);
    const reportItems=[];
    reportItems.push(`Feuerwehr ${compact(d.alarm.emergencyNumber)||'112'}`);
    if(!blank(d.alarm.internalNumber)) reportItems.push(`Interne Meldestelle: ${compact(d.alarm.internalNumber)}`);
    if(!blank(d.alarm.alarmMethod)) reportItems.push(compact(d.alarm.alarmMethod));
    sentences(d.partA.report,3).forEach(item=>{
      if(!/notruf|feuerwehr|alarmierung/i.test(item)) reportItems.push(item);
    });

    const safetySigns=[['E001','Rettungsweg / Notausgang']];
    if(!blank(d.alarm.assemblyPoint)) safetySigns.push(['E007','Sammelstelle']);
    const safetyItems=sentences(d.partA.rescue,6);
    if(!blank(d.alarm.assemblyPoint)) safetyItems.push(`Sammelstelle „${compact(d.alarm.assemblyPoint)}“ aufsuchen`);
    if(!blank(d.alarm.liftRule)&&!safetyItems.some(item=>/aufzug|aufzüge/i.test(item))) safetyItems.push(compact(d.alarm.liftRule));

    const extinguishText=`${d.partA.extinguish||''} ${d.partA.extra||''}`;
    const extinguishSigns=[['F001','Feuerlöscher']];
    if(/löschschlauch|wandhydrant/i.test(extinguishText)) extinguishSigns.push(['F002','Löschschlauch']);
    else if(/mittel und geräte|löscheinrichtung/i.test(extinguishText)) extinguishSigns.push(['F004','Mittel und Geräte zur Brandbekämpfung']);
    const extinguishItems=sentences(d.partA.extinguish,4);

    const draft=!d.release?.symbolsChecked;
    return `<div class="bso-a-sheet${draft?' is-draft':''}"><div class="bso-a-content">
      <section class="bso-a-prevent">
        <h1>Brände verhüten</h1>
        <div class="bso-a-prevent-body">${signGroup(preventSigns)}<p>${esc(preventText)}</p></div>
      </section>
      <h1 class="bso-a-emergency">Verhalten im Brandfall</h1>
      <section class="bso-a-rule bso-a-calm"><h2>Ruhe bewahren</h2></section>
      <section class="bso-a-rule"><h2>Brand melden</h2><div class="bso-a-rule-body">${signGroup(reportSigns)}<div class="bso-a-bullets">${list(reportItems)}</div></div></section>
      <section class="bso-a-rule"><h2>In Sicherheit bringen</h2><div class="bso-a-rule-body">${signGroup(safetySigns)}<div class="bso-a-bullets">${list(safetyItems)}</div></div></section>
      <section class="bso-a-rule bso-a-extinguish"><h2>Löschversuch<br>unternehmen</h2><div class="bso-a-rule-body">${signGroup(extinguishSigns)}<div class="bso-a-bullets">${list(extinguishItems)}</div></div></section>
      <footer class="bso-a-footer"><span><b>${esc(compact(d.meta.company)||'Unternehmen')}</b>${d.meta.site?` · ${esc(compact(d.meta.site))}`:''}</span><span>Dok.-Nr. ${esc(compact(d.meta.documentNo)||'–')} · Version ${esc(compact(d.meta.version)||'–')}</span><span>Brandschutzordnung Teil A</span></footer>
      ${draft?'<div class="bso-a-draft">ENTWURF · Sicherheitszeichen vor Freigabe fachkundig mit ASR A1.3 / DIN EN ISO 7010 und der örtlichen Ausstattung abgleichen.</div>':''}
    </div></div>`;
  };

  const baseRenderPreview=A.renderPreview;
  A.renderPreview=()=>{
    baseRenderPreview();
    document.querySelectorAll('.symbol-draft-watermark').forEach(node=>node.remove());
    const print=A.$('#printBtn');
    if(A.previewPart==='A'&&print){
      print.textContent=A.data.release?.symbolsChecked?'Drucken / PDF':'Entwurf drucken / PDF';
    }
  };
})();
