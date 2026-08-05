'use strict';
const {PART_B,PART_C,LEGAL_BASIS,FEDERAL_STATES,cloneDefaults,validate,score}=window.BSO;
let data=cloneDefaults();
let previewPart='A';
let lastResults=[];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const nl=(s='')=>esc(s).replace(/\n/g,'<br>');
function get(path){return path.split('.').reduce((o,k)=>o?.[k],data);}
function set(path,value){const parts=path.split('.');let obj=data;while(parts.length>1){const k=parts.shift();obj[k]??={};obj=obj[k];}obj[parts[0]]=value;}
function today(){return new Date().toISOString().slice(0,10);}
function plusMonths(dateString,months){const d=new Date(`${dateString}T12:00:00`);d.setMonth(d.getMonth()+months);return d.toISOString().slice(0,10);}

const hazardLabels={
  visitors:['Publikums-/Besucherverkehr','Besucher sind mit Alarmierung und Fluchtwegen nicht vertraut.'],
  mobility:['Eingeschränkte Mobilität','Assistenz, Alarmwahrnehmung und Räumung gesondert festlegen.'],
  children:['Kinder / betreuungsbedürftige Gruppen','Aufsicht, Gruppenführung und Vollzähligkeit berücksichtigen.'],
  overnight:['Nacht-/Schlafnutzung','Wecken, reduzierte Besetzung und Nachtorganisation berücksichtigen.'],
  hotWork:['Feuergefährliche Arbeiten','Erlaubnisschein, Brandwache und Nachkontrolle erforderlich.'],
  explosion:['Explosionsgefährdete Bereiche','Explosionsschutzdokument und Zündquellenkontrolle berücksichtigen.'],
  hazardousSubstances:['Brennbare/gefährliche Stoffe','Stoffinformationen, Löschmittel und Einsatzhinweise festlegen.'],
  pressureGases:['Druckgase / Gasflaschen','Lagerung, Erwärmung und Gefahren für Einsatzkräfte berücksichtigen.'],
  ammonia:['Ammoniak-/Kälteanlage','Gaswarnung, Windrichtung, Absperrung und Fachpersonal regeln.'],
  batteryCharging:['Batterieladebereiche','Lüftung, Zündquellen und geeignete Erstmaßnahmen festlegen.'],
  highBay:['Hochregal-/große Lagerbereiche','Brandlasten, Sprinklerfreiräume und Räumungswege prüfen.'],
  fireAlarm:['Brandmeldeanlage','Auslösung, Alarmweiterleitung und berechtigte Bedienung festlegen.'],
  sprinkler:['Sprinkler-/Löschanlage','Betriebsbereitschaft, Abschaltung und Freigabe regeln.'],
  gasExtinguishing:['Gaslöschanlage','Voralarm, sofortiges Verlassen, Zutrittsverbot und Freigabe regeln.'],
  smokeExtraction:['Rauch-/Wärmeabzugsanlage','Automatik und Bedienberechtigungen festlegen.'],
  criticalProcesses:['Kritische Prozesse / Anlagen','Nur vorab definierte sichere Abschaltungen vorsehen.'],
  environment:['Löschwasser-/Umweltrisiken','Rückhaltung, Kanalabsperrung und Umweltmeldung festlegen.'],
  animals:['Tiere im Objekt','Rettung nur ohne Eigengefährdung und nach objektspezifischem Konzept.']
};

function makeChapter(ch,part){
  return `<article class="chapter" id="chapter-${part}-${ch.key}"><div class="chapter-head"><div><span>Teil ${part}</span><h3>${esc(ch.title)}</h3></div><button type="button" class="mini" data-fill="${part}.${ch.key}">Formulierungsvorschlag</button></div><p class="chapter-hint">${esc(ch.hint)}</p><textarea data-path="part${part}.${ch.key}" rows="6" placeholder="Objektspezifische Regelung eintragen"></textarea></article>`;
}
function buildStatic(){
  $('#stateSelect').innerHTML=FEDERAL_STATES.map(x=>`<option>${esc(x)}</option>`).join('');
  $('#hazardGrid').innerHTML=Object.entries(hazardLabels).map(([k,[t,h]])=>`<label><input type="checkbox" data-path="hazards.${k}"><span><b>${esc(t)}</b><small>${esc(h)}</small></span></label>`).join('');
  $('#partBFields').innerHTML=PART_B.map(ch=>makeChapter(ch,'B')).join('');
  $('#partCFields').innerHTML=PART_C.map(ch=>makeChapter(ch,'C')).join('');
  $('#legalBasis').innerHTML=`<table><thead><tr><th>Ebene</th><th>Quelle</th><th>Bezug</th><th>Bedeutung</th></tr></thead><tbody>${LEGAL_BASIS.map(x=>`<tr><td>${esc(x.level)}</td><td><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.source)}</a></td><td>${esc(x.reference)}</td><td>${esc(x.purpose)}</td></tr>`).join('')}</tbody></table>`;
  $$('.part-toggle').forEach(box=>{const p=box.dataset.part;box.innerHTML=`<label class="switch"><input type="checkbox" data-path="output.${p}"><span></span>Teil ${p} in Ausgabe einbeziehen</label>`;});
}
function suggestion(part,key){
  const s={
    'B.intro':`Diese Brandschutzordnung gilt für ${data.meta.area||'den festgelegten Geltungsbereich'} am Standort ${data.meta.site||'–'}. Sie richtet sich an ${data.scope.people||'alle regelmäßig anwesenden Personen'}. Die Regelungen sind verbindlich. Ergänzende Anweisungen, Gefährdungsbeurteilungen und Genehmigungsauflagen bleiben unberührt.`,
    'B.brandverhuetung':`Rauchverbote und Verbote für offenes Feuer sind einzuhalten. Brennbare Stoffe dürfen nur in den vorgesehenen Bereichen und Mengen gelagert werden. Elektrische Geräte sind bestimmungsgemäß zu benutzen und nach Gebrauch sicher abzuschalten. Feuergefährliche Arbeiten dürfen nur nach betrieblicher Freigabe durchgeführt werden.`,
    'B.brandRauch':`Brand- und Rauchschutztüren dürfen nicht festgestellt, verkeilt oder in ihrer Funktion beeinträchtigt werden. Öffnungen in brandabschnittsbildenden Bauteilen sind ordnungsgemäß abzuschotten. Ungewöhnliche Gerüche, Rauchentwicklung oder beschädigte Brandschutzeinrichtungen sind unverzüglich zu melden.`,
    'B.fluchtwege':`Flucht- und Rettungswege, Notausgänge, Treppenräume sowie Feuerwehrzufahrten und Aufstellflächen sind jederzeit freizuhalten. Sicherheitskennzeichnungen dürfen nicht verdeckt werden. Festgestellte Einschränkungen sind unverzüglich zu melden und bis zur Beseitigung organisatorisch abzusichern.`,
    'B.meldeLoesch':`Brandmelder, Notrufeinrichtungen und Feuerlöscheinrichtungen müssen sichtbar und zugänglich bleiben. Beschäftigte dürfen Einrichtungen nur bestimmungsgemäß bedienen. Störungen, Benutzungen oder Beschädigungen sind sofort der zuständigen Stelle zu melden.`,
    'B.verhaltenBrand':`Ruhe bewahren. Brand unverzüglich melden, gefährdete Personen warnen und den Gefahrenbereich über gekennzeichnete Fluchtwege verlassen. Türen schließen, jedoch nicht abschließen. Anweisungen der Räumungsorganisation und der Feuerwehr befolgen.`,
    'B.brandMelden':`Betriebliche Alarmierung: ${data.alarm.alarmMethod||'festlegen'}. Notruf: ${data.alarm.emergencyNumber||'112'}${data.alarm.internalNumber?`, intern ${data.alarm.internalNumber}`:''}. Folgende Angaben machen: Wo brennt es? Was brennt? Welche Gefahren bestehen? Sind Personen betroffen? Für Rückfragen erreichbar bleiben.`,
    'B.alarmsignale':`Alarmsignal: ${data.alarm.alarmSignal||'festlegen'}. Bei Alarm sind Tätigkeiten sicher zu unterbrechen und die Räumungsanweisungen unverzüglich umzusetzen. Durchsagen und Weisungen der verantwortlichen Personen sowie der Feuerwehr sind zu beachten.`,
    'B.sicherheit':`Gekennzeichnete Fluchtwege benutzen und die Sammelstelle „${data.alarm.assemblyPoint||'festlegen'}“ aufsuchen. Hilfsbedürftige Personen unterstützen, ohne sich selbst zu gefährden. ${data.alarm.liftRule||'Aufzüge im Brandfall nicht benutzen.'} Die Vollzähligkeitskontrolle erfolgt durch ${data.alarm.fullCountMethod||'das festgelegte Verfahren'}.`,
    'B.loeschversuch':`Löschversuche nur bei Entstehungsbränden, mit geeignetem Löschmittel, gesichertem Rückzugsweg und ohne Eigengefährdung unternehmen. Rauch, Hitze, unbekannte Stoffe oder rasche Brandausbreitung sind Abbruchkriterien. Menschenrettung und Alarmierung haben Vorrang.`,
    'B.besondereRegeln':data.scope.custom||`Bereichsspezifische Gefahren, Zutrittsregeln, Gefahrstoffe, besondere Abschaltungen und Hygieneanforderungen sind in ergänzenden Anweisungen festgelegt und zu beachten.`,
    'C.intro':`Teil C richtet sich an die benannten Personen mit besonderen Brandschutzaufgaben. Aufgaben, Weisungsbefugnisse, Erreichbarkeit und Vertretungen müssen schriftlich festgelegt und aktuell gehalten werden.`,
    'C.brandverhuetung':`Die zuständigen Funktionen überwachen die Einhaltung organisatorischer Brandschutzmaßnahmen, begleiten Änderungen und Fremdfirmenarbeiten und veranlassen die Beseitigung festgestellter Mängel. Feuergefährliche Arbeiten werden nur über das festgelegte Freigabeverfahren zugelassen.`,
    'C.alarmierung':`Nach Eingang einer Brandmeldung wird die interne Alarmkette ausgelöst. Feuerwehr und betriebliche Stellen werden gemäß Alarmplan informiert. Zuständigkeiten für Alarmierung, Weitergabe von Zusatzinformationen und Dokumentation sind schichtbezogen sicherzustellen.`,
    'C.sicherheitsmassnahmen':`Die Räumung hat Vorrang. Technische Maßnahmen dürfen nur durch beauftragte Personen und nur dann durchgeführt werden, wenn dadurch die Räumung nicht verzögert und niemand gefährdet wird. Besondere Gefahren, Stoffe, Anlagen und Umweltmaßnahmen sind der Feuerwehr unverzüglich mitzuteilen.`,
    'C.loeschmassnahmen':`Betriebliche Löschmaßnahmen beschränken sich auf sichere Erstmaßnahmen im Rahmen der Ausbildung und Ausrüstung. Die Einsatzleitung der Feuerwehr übernimmt nach Eintreffen die Führung. Unkoordinierte Eingriffe in Lösch-, Brandmelde- oder Energieanlagen sind unzulässig.`,
    'C.feuerwehr':`Zufahrt und Zugang sind freizuhalten. Die Feuerwehr wird am Punkt „${data.alarm.fireBrigadeMeetingPoint||'festlegen'}“ eingewiesen. Schlüssel, Feuerwehrpläne, Gefahrstoffinformationen und Angaben zu vermissten Personen werden bereitgestellt. Ansprechpartner: ${data.roles.gate||data.roles.fireOfficer||'festlegen'}.`,
    'C.nachsorge':`Der betroffene Bereich bleibt bis zur Freigabe abgesperrt. Erforderliche Brandwachen, Wiederherstellung von Brandschutzeinrichtungen, interne und externe Meldungen sowie Ereignis- und Maßnahmenanalyse werden organisiert. Die Wiederaufnahme des Betriebs erfolgt nur nach dokumentierter Freigabe.`
  };
  return s[`${part}.${key}`]||'';
}
function bind(){
  $$('[data-path]').forEach(el=>{
    const v=get(el.dataset.path); if(el.type==='checkbox')el.checked=!!v; else el.value=v??'';
    el.addEventListener('input',()=>{
      let value=el.type==='checkbox'?el.checked:el.value;
      set(el.dataset.path,value);
      if(el.dataset.path==='meta.validFrom'&&!data.meta.nextReview&&value){data.meta.nextReview=plusMonths(value,24);const n=$('[data-path="meta.nextReview"]');if(n)n.value=data.meta.nextReview;}
      renderAll(); saveLocal();
    });
  });
  $$('[data-fill]').forEach(btn=>btn.addEventListener('click',()=>{const [p,k]=btn.dataset.fill.split('.');set(`part${p}.${k}`,suggestion(p,k));const el=$(`[data-path="part${p}.${k}"]`);if(el)el.value=get(`part${p}.${k}`);renderAll();saveLocal();}));
}
function showSection(id){
  $$('.panel').forEach(x=>x.classList.toggle('active',x.id===id));
  $$('#steps button').forEach(x=>x.classList.toggle('active',x.dataset.section===id));
  $('#editor').scrollTop=0;
}
function documentMeta(){return `${esc(data.meta.company||'Unternehmen')} · ${esc(data.meta.site||'Standort')} · ${esc(data.meta.area||'Geltungsbereich')} · Dok.-Nr. ${esc(data.meta.documentNo||'–')} · Version ${esc(data.meta.version||'–')}`;}
function docHeader(title,part){return `<header class="doc-head"><div class="doc-title"><span>Brandschutzordnung</span><h1>${esc(title)}</h1></div><div class="part-badge">Teil ${part}</div></header><div class="doc-meta">${documentMeta()}</div>`;}
function sign(type,code,label,symbol){return `<div class="safety-sign ${type}" aria-label="${esc(label)}"><span class="sign-symbol">${symbol}</span><small>${esc(code)}</small></div>`;}
function renderA(){
  return `<div class="a-frame"><div class="a-inner">
    <header class="a-title"><span>BRANDSCHUTZORDNUNG</span><h1>BRÄNDE VERHÜTEN</h1><p>${esc(data.meta.company||'Unternehmen')} · ${esc(data.meta.site||'Standort')}</p></header>
    <section class="a-prevent">${sign('prohibition','P002 / P003','Rauchen und offene Flamme verboten','◉')}<div><h2>Brände verhüten</h2><p>${nl(data.partA.prevent)}</p></div></section>
    <h1 class="emergency-title">VERHALTEN IM BRANDFALL</h1>
    <div class="a-calm"><b>Ruhe bewahren</b></div>
    <section class="a-step">${sign('fire','F005 / F006','Brand melden','☎')}<div><h2>Brand melden</h2><p>${nl(data.partA.report)}</p><dl><div><dt>Notruf</dt><dd>${esc(data.alarm.emergencyNumber||'112')}</dd></div>${data.alarm.internalNumber?`<div><dt>Intern</dt><dd>${esc(data.alarm.internalNumber)}</dd></div>`:''}<div><dt>Alarmierung</dt><dd>${esc(data.alarm.alarmMethod||'–')}</dd></div></dl></div></section>
    <section class="a-step">${sign('rescue','E001/E002 · E007','In Sicherheit bringen','↗')}<div><h2>In Sicherheit bringen</h2><p>${nl(data.partA.rescue)}</p><dl><div><dt>Sammelstelle</dt><dd>${esc(data.alarm.assemblyPoint||'–')}</dd></div><div><dt>Alarm</dt><dd>${esc(data.alarm.alarmSignal||'–')}</dd></div></dl></div></section>
    <section class="a-step">${sign('fire','F001','Feuerlöscher','▰')}<div><h2>Löschversuch unternehmen</h2><p>${nl(data.partA.extinguish)}</p></div></section>
    <footer class="a-extra"><b>Besondere Festlegung</b><span>${nl(data.partA.extra)}</span><small>Dok.-Nr. ${esc(data.meta.documentNo||'–')} · Version ${esc(data.meta.version||'–')} · Stand ${esc(data.meta.validFrom||'–')}</small></footer>
  </div></div>`;
}
function cover(part){return `<section class="doc-page cover-page">${docHeader(`Teil ${part}`,part)}<div class="cover-center"><span>BRANDSCHUTZORDNUNG</span><h2>Teil ${part}</h2><p>${part==='B'?'für Personen ohne besondere Brandschutzaufgaben':'für Personen mit besonderen Brandschutzaufgaben'}</p></div><dl class="cover-data"><div><dt>Unternehmen</dt><dd>${esc(data.meta.company||'–')}</dd></div><div><dt>Standort</dt><dd>${esc(data.meta.site||'–')}</dd></div><div><dt>Geltungsbereich</dt><dd>${esc(data.meta.area||'–')}</dd></div><div><dt>Dokument</dt><dd>${esc(data.meta.documentNo||'–')} · Version ${esc(data.meta.version||'–')}</dd></div><div><dt>Gültig ab</dt><dd>${esc(data.meta.validFrom||'–')}</dd></div><div><dt>Nächste Prüfung</dt><dd>${esc(data.meta.nextReview||'–')}</dd></div></dl><div class="workflow"><span>Erstellt: ${esc(data.meta.author||'–')}</span><span>Geprüft: ${esc(data.meta.reviewer||'–')}</span><span>Freigegeben: ${esc(data.meta.approver||'–')}</span></div></section>`;}
function toc(part,rules){return `<section class="doc-page">${docHeader(`Inhaltsübersicht – Teil ${part}`,part)}<ol class="toc">${rules.map((x,i)=>`<li><span>${i+1}. ${esc(x.title)}</span><i></i></li>`).join('')}</ol><div class="doc-note"><b>Geltungsbereich</b><p>${nl(data.scope.people)}<br>${nl(data.scope.specialAreas)}</p></div></section>`;}
function chapterPages(part,rules){return rules.map((x,i)=>`<section class="doc-page chapter-page">${docHeader(`${i+1}. ${x.title}`,part)}<div class="chapter-body">${nl(data[`part${part}`][x.key]||'Noch nicht ausgefüllt.')}</div><footer>Brandschutzordnung Teil ${part} · ${esc(data.meta.documentNo||'–')} · Version ${esc(data.meta.version||'–')}</footer></section>`).join('');}
function rolesPage(){return `<section class="doc-page">${docHeader('Funktionen und Zuständigkeiten','C')}<table class="roles-table"><tbody>${Object.entries({Brandschutzbeauftragte:r:data.roles.fireOfficer,Vertretung:data.roles.deputyFireOfficer,Räumungsleitung:data.roles.evacuationLead,'Vertretung Räumungsleitung':data.roles.deputyEvacuationLead,'Brandschutz-/Räumungshelfer':data.roles.fireWardens,'Erste Hilfe':data.roles.firstAid,'Technischer Dienst':data.roles.technicalService,'Pforte / Empfang':data.roles.gate,'Umwelt / Löschwasserschutz':data.roles.environment,'Werk-/Unternehmensleitung':data.roles.management,'Weitere Funktionen':data.roles.other}).map(([k,v])=>`<tr><th>${esc(k)}</th><td>${nl(v||'–')}</td></tr>`).join('')}</tbody></table></section>`;}
function releasePage(part){return `<section class="doc-page release-page">${docHeader('Dokumentenlenkung und Freigabe',part)}<table class="release-table"><tr><th>Dokumentnummer</th><td>${esc(data.meta.documentNo||'–')}</td><th>Version</th><td>${esc(data.meta.version||'–')}</td></tr><tr><th>Gültig ab</th><td>${esc(data.meta.validFrom||'–')}</td><th>Nächste Prüfung</th><td>${esc(data.meta.nextReview||'–')}</td></tr><tr><th>Änderungsvermerk</th><td colspan="3">${nl(data.meta.changeNote||'–')}</td></tr></table><div class="signature-grid"><div><b>Erstellt durch</b><span>${esc(data.meta.author||'–')}</span><i>Datum / Unterschrift</i></div><div><b>Geprüft durch</b><span>${esc(data.meta.reviewer||'–')}</span><i>Datum / Unterschrift</i></div><div><b>Freigegeben durch</b><span>${esc(data.meta.approver||'–')}</span><i>Datum / Unterschrift</i></div></div><div class="doc-note"><b>Verteilung und Unterweisung</b><p>${nl(data.distribution.deliveryMethod)}<br>${nl(data.distribution.trainingMethod)}</p></div></section>`;}
function renderLong(part){const rules=part==='B'?PART_B:PART_C;return cover(part)+toc(part,rules)+(part==='C'?rolesPage():'')+chapterPages(part,rules)+releasePage(part);}
function renderPreview(){
  if(!data.output[previewPart]){const available=['A','B','C'].find(p=>data.output[p]);if(available)previewPart=available;}
  $('#preview').className=`document part-${previewPart.toLowerCase()}`;
  $('#preview').innerHTML=previewPart==='A'?renderA():renderLong(previewPart);
  $$('#previewTabs button').forEach(b=>{b.classList.toggle('active',b.dataset.preview===previewPart);b.disabled=!data.output[b.dataset.preview];});
}
function updateVisibility(){
  ['A','B','C'].forEach(p=>{const on=data.output[p];const section=$(`#part${p}`);if(section)section.classList.toggle('part-disabled',!on);$$(`.part-toggle[data-part="${p}"] input`).forEach(x=>x.checked=on);});
  $('#stateEcho').textContent=data.meta.federalState||'–';
  $$('[data-count]').forEach(x=>{const path=x.dataset.count,v=get(path)||'',max=$(`[data-path="${path}"]`)?.maxLength||0;x.textContent=`${v.length}${max>0?` / ${max}`:''} Zeichen`;});
}
function updateProgress(){
  const s=score(data), total=s.errors+s.warnings;
  $('#progressLabel').textContent=`${s.percent} % Bearbeitungsstand`;
  $('#progressCount').textContent=s.errors?`${s.errors} Pflichtpunkte`:(s.warnings?`${s.warnings} Hinweise`:'vollständig');
  $('#progressBar').style.width=`${s.percent}%`;
  $('#issueBadge').textContent=total;
  $('#issueBadge').classList.toggle('clear',total===0);
}
function renderAll(){updateVisibility();renderPreview();updateProgress();}
function showCheck(){
  lastResults=validate(data);
  const counts={error:0,warn:0,info:0,ok:0};lastResults.forEach(x=>counts[x.type]++);
  $('#checkSummary').innerHTML=`<div class="summary error"><b>${counts.error}</b><span>Pflichtabweichungen</span></div><div class="summary warn"><b>${counts.warn}</b><span>Warnungen</span></div><div class="summary info"><b>${counts.info}</b><span>Hinweise</span></div>`;
  $('#results').className='results';
  $('#results').innerHTML=lastResults.map(x=>`<button class="result ${x.type}" data-go="${esc(x.section)}"><span class="result-code">${esc(x.code)}</span><b>${esc(x.title)}</b><small>${esc(x.text)}</small></button>`).join('');
  $('#results').querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.go)));
  showSection('check');renderAll();
}
function saveLocal(){try{localStorage.setItem('bso-studio-project',JSON.stringify(data));}catch(e){console.warn('Lokale Speicherung nicht möglich',e);}}
function hydrate(){const raw=localStorage.getItem('bso-studio-project');if(raw)try{mergeProject(JSON.parse(raw));}catch(e){console.warn('Lokales Projekt konnte nicht gelesen werden',e);}}
function deepMerge(target,source){for(const [k,v] of Object.entries(source||{})){if(v&&typeof v==='object'&&!Array.isArray(v)){target[k]??={};deepMerge(target[k],v);}else target[k]=v;}return target;}
function mergeProject(project){data=deepMerge(cloneDefaults(),project||{});}
function downloadProject(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${(data.meta.documentNo||'brandschutzordnung').replace(/[^a-z0-9_-]+/gi,'_')}.bso.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function demo(){
  data=cloneDefaults();const now=today();
  Object.assign(data.meta,{company:'Muster Lebensmittel GmbH',site:'Werk Musterstadt',address:'Werkstraße 1, 86150 Musterstadt',area:'Produktion, Kühllager, Technik und Verwaltung',documentNo:'BSO-WERK-001',version:'1.0',status:'In Prüfung',validFrom:now,nextReview:plusMonths(now,24),author:'EHS Manager',reviewer:'Brandschutzbeauftragte Person',approver:'Werkleitung',changeNote:'Erstausgabe nach Überarbeitung der Alarmorganisation.'});
  Object.assign(data.applicability,{requiredByConcept:true,requiredByRiskAssessment:true,conceptReference:'Brandschutzkonzept BSK-01, Rev. 3',stateBuildingLawChecked:true,specialBuildingRulesChecked:true,fireBrigadeRequirementsChecked:true,insurerRequirementsChecked:true});
  Object.assign(data.scope,{specialAreas:'Produktion, Hochregallager, Ammoniak-Kälteanlage, Batterieladestation, Büros',shiftModel:'Drei-Schicht-Betrieb, 24/7',maxPersons:'220',visitorsPerDay:'25',operatingHours:'Montag bis Sonntag, durchgehend',custom:'Hygienebereiche nur über festgelegte Fluchtwege verlassen. Betriebsfremde Personen werden durch ihre Ansprechperson geführt.'});
  Object.assign(data.alarm,{internalNumber:'Leitwarte 222',alarmMethod:'Druckknopfmelder oder interne Notrufstelle; anschließend Notruf 112',alarmSignal:'Evakuierungssirene und Lautsprecherdurchsage',assemblyPoint:'Besucherparkplatz Nord',fireBrigadeMeetingPoint:'Tor 1 / Feuerwehrinformationspunkt',fullCountMethod:'Bereichsverantwortliche melden Vollzähligkeit an die Räumungsleitung',fireDepartmentAccess:'Tor 1, Zufahrt Nord',keyDepot:'Feuerwehrschlüsseldepot am Tor 1',shutdownResponsible:'Technischer Dienst nach Freigabe der Einsatzleitung',emergencyContacts:'Leitwarte: 222\nTechnischer Bereitschaftsdienst: 333\nEHS/Brandschutz: 444'});
  Object.assign(data.hazards,{visitors:true,mobility:true,hotWork:true,explosion:true,hazardousSubstances:true,pressureGases:true,ammonia:true,batteryCharging:true,highBay:true,fireAlarm:true,sprinkler:true,gasExtinguishing:true,smokeExtraction:true,criticalProcesses:true,environment:true});
  Object.assign(data.roles,{fireOfficer:'Brandschutzbeauftragte Person · Durchwahl 444',deputyFireOfficer:'EHS-Vertretung · Durchwahl 445',evacuationLead:'Schichtleitung',deputyEvacuationLead:'Stellvertretende Schichtleitung',fireWardens:'Bereichsbezogene Brandschutz- und Räumungshelfer gemäß aktueller Liste',firstAid:'Ersthelfer gemäß Schichtplan',technicalService:'Technischer Dienst / Kältebereitschaft',gate:'Pforte Tor 1',environment:'Umweltmanagement / EHS',management:'Werkleitung',other:'Ammoniak-Fachkundige und Sprinklerwart'});
  [...PART_B].forEach(ch=>data.partB[ch.key]=suggestion('B',ch.key));[...PART_C].forEach(ch=>data.partC[ch.key]=suggestion('C',ch.key));
  Object.assign(data.distribution,{languageNeeds:'Unterweisung in verständlicher Sprache; zusätzliche Kurzinformationen für Fremdfirmen und Besucher.',distributionList:'Werkleitung\nAbteilungsleitungen\nSchichtleitungen\nTechnischer Dienst\nPforte\nEHS/Brandschutz\nFremdfirmenkoordination'});
  Object.assign(data.release,{siteChecked:true,fireConceptChecked:true,rolesConfirmed:true,instructionsPlanned:true,symbolsChecked:true,professionalReview:false,authorityCoordination:true,approved:false});
  refreshInputs();showSection('meta');saveLocal();
}
function refreshInputs(){
  $$('[data-path]').forEach(el=>{const v=get(el.dataset.path);if(el.type==='checkbox')el.checked=!!v;else el.value=v??'';});renderAll();
}

buildStatic();hydrate();bind();refreshInputs();
$('#steps').addEventListener('click',e=>{const b=e.target.closest('button[data-section]');if(b)showSection(b.dataset.section);});
$('#previewTabs').addEventListener('click',e=>{const b=e.target.closest('button[data-preview]');if(b&&!b.disabled){previewPart=b.dataset.preview;renderPreview();}});
$('#checkBtn').addEventListener('click',showCheck);$('#finalCheckBtn').addEventListener('click',showCheck);
$('#printBtn').addEventListener('click',()=>window.print());
$('#saveBtn').addEventListener('click',downloadProject);
$('#newBtn').addEventListener('click',()=>{if(confirm('Alle Eingaben dieses Projekts zurücksetzen?')){data=cloneDefaults();lastResults=[];localStorage.removeItem('bso-studio-project');refreshInputs();showSection('meta');}});
$('#demoBtn').addEventListener('click',demo);
$('#openFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const parsed=JSON.parse(await file.text());mergeProject(parsed);refreshInputs();saveLocal();showSection('meta');}catch(err){alert('Die Projektdatei ist ungültig oder konnte nicht gelesen werden.');}finally{e.target.value='';}});
