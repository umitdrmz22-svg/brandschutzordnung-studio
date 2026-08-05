'use strict';
(()=>{
  const A=window.BSO_APP,{PART_B,PART_C,LEGAL_BASIS,FEDERAL_STATES,validate,score}=A.R,$=A.$,$$=A.$$,esc=A.esc;
  const chapter=(ch,part)=>`<article class="chapter"><div class="chapter-head"><div><span>Teil ${part}</span><h3>${esc(ch.title)}</h3></div><button type="button" class="mini" data-fill="${part}.${ch.key}">Formulierungsvorschlag</button></div><p class="chapter-hint">${esc(ch.hint)}</p><textarea data-path="part${part}.${ch.key}" rows="6" placeholder="Objektspezifische Regelung eintragen"></textarea></article>`;
  A.buildStatic=()=>{
    $('#stateSelect').innerHTML=FEDERAL_STATES.map(x=>`<option>${esc(x)}</option>`).join('');
    $('#hazardGrid').innerHTML=Object.entries(A.hazardLabels).map(([k,[t,h]])=>`<label><input type="checkbox" data-path="hazards.${k}"><span><b>${esc(t)}</b><small>${esc(h)}</small></span></label>`).join('');
    $('#partBFields').innerHTML=PART_B.map(ch=>chapter(ch,'B')).join('');
    $('#partCFields').innerHTML=PART_C.map(ch=>chapter(ch,'C')).join('');
    $('#legalBasis').innerHTML=`<table><thead><tr><th>Ebene</th><th>Quelle</th><th>Bezug</th><th>Bedeutung</th></tr></thead><tbody>${LEGAL_BASIS.map(x=>`<tr><td>${esc(x.level)}</td><td><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.source)}</a></td><td>${esc(x.reference)}</td><td>${esc(x.purpose)}</td></tr>`).join('')}</tbody></table>`;
    $$('.part-toggle').forEach(box=>{const p=box.dataset.part;box.innerHTML=`<label class="switch"><input type="checkbox" data-path="output.${p}"><span></span>Teil ${p} in Ausgabe einbeziehen</label>`;});
  };
  A.suggestion=(part,key)=>{
    const d=A.data;
    const common={
      'B.intro':`Diese Brandschutzordnung gilt für ${d.meta.area||'den festgelegten Geltungsbereich'} am Standort ${d.meta.site||'–'}. Sie richtet sich an ${d.scope.people||'alle regelmäßig anwesenden Personen'}. Ergänzende Gefährdungsbeurteilungen, Betriebsanweisungen und Genehmigungsauflagen bleiben unberührt.`,
      'B.brandverhuetung':'Rauchverbote und Verbote für offenes Feuer sind einzuhalten. Brennbare Stoffe dürfen nur in den vorgesehenen Bereichen und Mengen gelagert werden. Elektrische Geräte sind bestimmungsgemäß zu benutzen. Feuergefährliche Arbeiten dürfen nur nach dokumentierter Freigabe durchgeführt werden.',
      'B.brandRauch':'Brand- und Rauchschutztüren dürfen nicht festgestellt, verkeilt oder in ihrer Funktion beeinträchtigt werden. Abschottungen und Brandschutzeinrichtungen dürfen nicht verändert werden. Schäden oder ungewöhnliche Rauch- und Geruchsentwicklung sind unverzüglich zu melden.',
      'B.fluchtwege':'Flucht- und Rettungswege, Notausgänge, Treppenräume sowie Feuerwehrzufahrten und Aufstellflächen sind jederzeit freizuhalten. Sicherheitskennzeichnungen dürfen nicht verdeckt werden. Einschränkungen sind unverzüglich zu melden und organisatorisch abzusichern.',
      'B.meldeLoesch':'Brandmelder, Notruf- und Feuerlöscheinrichtungen müssen sichtbar und zugänglich bleiben. Störungen, Benutzungen oder Beschädigungen sind sofort der zuständigen Stelle zu melden. Eingriffe und Rückstellungen dürfen nur durch berechtigte Personen erfolgen.',
      'B.verhaltenBrand':'Ruhe bewahren. Brand unverzüglich melden, gefährdete Personen warnen und den Gefahrenbereich über gekennzeichnete Fluchtwege verlassen. Türen schließen, jedoch nicht abschließen. Anweisungen der Räumungsorganisation und der Feuerwehr befolgen.',
      'B.brandMelden':`Betriebliche Alarmierung: ${d.alarm.alarmMethod||'festlegen'}. Notruf: ${d.alarm.emergencyNumber||'112'}${d.alarm.internalNumber?`, intern ${d.alarm.internalNumber}`:''}. Melden: Wo? Was? Welche Gefahren? Betroffene Personen? Für Rückfragen erreichbar bleiben.`,
      'B.alarmsignale':`Alarmsignal: ${d.alarm.alarmSignal||'festlegen'}. Bei Alarm sind Tätigkeiten sicher zu unterbrechen und die Räumungsanweisungen unverzüglich umzusetzen. Durchsagen und Weisungen der verantwortlichen Personen und der Feuerwehr sind zu beachten.`,
      'B.sicherheit':`Gekennzeichnete Fluchtwege benutzen und die Sammelstelle „${d.alarm.assemblyPoint||'festlegen'}“ aufsuchen. Hilfsbedürftige Personen unterstützen, ohne sich selbst zu gefährden. ${d.alarm.liftRule||'Aufzüge im Brandfall nicht benutzen.'} Vollzähligkeitskontrolle: ${d.alarm.fullCountMethod||'festlegen'}.`,
      'B.loeschversuch':'Löschversuche nur bei Entstehungsbränden, mit geeignetem Löschmittel, gesichertem Rückzugsweg und ohne Eigengefährdung unternehmen. Rauch, Hitze, unbekannte Stoffe oder schnelle Brandausbreitung sind Abbruchkriterien. Menschenrettung und Alarmierung haben Vorrang.',
      'B.besondereRegeln':d.scope.custom||'Bereichsspezifische Gefahren, Zutrittsregeln, Gefahrstoffe, besondere Abschaltungen und ergänzende betriebliche Anweisungen sind zu beachten.',
      'C.intro':'Teil C richtet sich an die benannten Personen mit besonderen Brandschutzaufgaben. Aufgaben, Weisungsbefugnisse, Erreichbarkeit und Vertretungen sind schriftlich festzulegen und aktuell zu halten.',
      'C.brandverhuetung':'Die zuständigen Funktionen überwachen organisatorische Brandschutzmaßnahmen, begleiten Änderungen und Fremdfirmenarbeiten und veranlassen die Beseitigung festgestellter Mängel. Feuergefährliche Arbeiten werden nur über das festgelegte Freigabeverfahren zugelassen.',
      'C.alarmierung':'Nach Eingang einer Brandmeldung wird die interne Alarmkette ausgelöst. Feuerwehr und betriebliche Stellen werden gemäß Alarmplan informiert. Zuständigkeiten für Alarmierung, Zusatzinformationen und Dokumentation sind schichtbezogen sicherzustellen.',
      'C.sicherheitsmassnahmen':'Die Räumung hat Vorrang. Technische Maßnahmen dürfen nur durch beauftragte Personen erfolgen, wenn dadurch die Räumung nicht verzögert und niemand gefährdet wird. Besondere Gefahren, Stoffe, Anlagen und Umweltmaßnahmen sind der Feuerwehr mitzuteilen.',
      'C.loeschmassnahmen':'Betriebliche Löschmaßnahmen beschränken sich auf sichere Erstmaßnahmen im Rahmen von Ausbildung und Ausrüstung. Nach Eintreffen übernimmt die Feuerwehr die Einsatzleitung. Unkoordinierte Eingriffe in Lösch-, Brandmelde- oder Energieanlagen sind unzulässig.',
      'C.feuerwehr':`Zufahrt und Zugang sind freizuhalten. Die Feuerwehr wird am Punkt „${d.alarm.fireBrigadeMeetingPoint||'festlegen'}“ eingewiesen. Schlüssel, Feuerwehrpläne, Gefahrstoffinformationen und Angaben zu vermissten Personen werden bereitgestellt. Ansprechpartner: ${d.roles.gate||d.roles.fireOfficer||'festlegen'}.`,
      'C.nachsorge':'Der betroffene Bereich bleibt bis zur Freigabe abgesperrt. Erforderliche Brandwachen, Wiederherstellung von Brandschutzeinrichtungen, Meldungen sowie Ereignis- und Maßnahmenanalyse werden organisiert. Die Wiederaufnahme des Betriebs erfolgt nur nach dokumentierter Freigabe.'
    };
    return common[`${part}.${key}`]||'';
  };
  A.showSection=id=>{$$('.panel').forEach(x=>x.classList.toggle('active',x.id===id));$$('#steps button').forEach(x=>x.classList.toggle('active',x.dataset.section===id));$('#editor').scrollTop=0;};
  A.updateVisibility=()=>{
    ['A','B','C'].forEach(p=>{const on=A.data.output[p],section=$(`#part${p}`);if(section)section.classList.toggle('part-disabled',!on);$$(`.part-toggle[data-part="${p}"] input`).forEach(x=>x.checked=on);});
    $('#stateEcho').textContent=A.data.meta.federalState||'–';
    $$('[data-count]').forEach(x=>{const path=x.dataset.count,v=A.get(path)||'',max=$(`[data-path="${path}"]`)?.maxLength||0;x.textContent=`${v.length}${max?` / ${max}`:''} Zeichen`;});
  };
  A.updateProgress=()=>{const s=score(A.data),total=s.errors+s.warnings;$('#progressLabel').textContent=`${s.percent} % Bearbeitungsstand`;$('#progressCount').textContent=s.errors?`${s.errors} Pflichtpunkte`:(s.warnings?`${s.warnings} Hinweise`:'vollständig');$('#progressBar').style.width=`${s.percent}%`;$('#issueBadge').textContent=total;$('#issueBadge').classList.toggle('clear',total===0);};
  A.renderAll=()=>{A.updateVisibility();A.renderPreview();A.updateProgress();};
  A.refreshInputs=()=>{$$('[data-path]').forEach(el=>{const v=A.get(el.dataset.path);if(el.type==='checkbox')el.checked=!!v;else el.value=v??'';});A.renderAll();};
  A.bind=()=>{
    $$('[data-path]').forEach(el=>{const v=A.get(el.dataset.path);if(el.type==='checkbox')el.checked=!!v;else el.value=v??'';el.addEventListener('input',()=>{A.set(el.dataset.path,el.type==='checkbox'?el.checked:el.value);if(el.dataset.path==='meta.validFrom'&&!A.data.meta.nextReview&&el.value){A.data.meta.nextReview=A.plusMonths(el.value,24);const n=$('[data-path="meta.nextReview"]');if(n)n.value=A.data.meta.nextReview;}A.renderAll();A.saveLocal();});});
    $$('[data-fill]').forEach(btn=>btn.addEventListener('click',()=>{const [p,k]=btn.dataset.fill.split('.');A.set(`part${p}.${k}`,A.suggestion(p,k));const el=$(`[data-path="part${p}.${k}"]`);if(el)el.value=A.get(`part${p}.${k}`);A.renderAll();A.saveLocal();}));
  };
  A.showCheck=()=>{A.lastResults=validate(A.data);const c={error:0,warn:0,info:0,ok:0};A.lastResults.forEach(x=>c[x.type]++);$('#checkSummary').innerHTML=`<div class="summary error"><b>${c.error}</b><span>Pflichtabweichungen</span></div><div class="summary warn"><b>${c.warn}</b><span>Warnungen</span></div><div class="summary info"><b>${c.info}</b><span>Hinweise</span></div>`;$('#results').className='results';$('#results').innerHTML=A.lastResults.map(x=>`<button class="result ${x.type}" data-go="${esc(x.section)}"><span class="result-code">${esc(x.code)}</span><b>${esc(x.title)}</b><small>${esc(x.text)}</small></button>`).join('');$('#results').querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>A.showSection(b.dataset.go)));A.showSection('check');A.renderAll();};
  A.demo=()=>{
    A.data=A.R.cloneDefaults();const now=A.today();
    Object.assign(A.data.meta,{company:'Muster Lebensmittel GmbH',site:'Werk Musterstadt',address:'Werkstraße 1, 86150 Musterstadt',area:'Produktion, Kühllager, Technik und Verwaltung',documentNo:'BSO-WERK-001',version:'1.0',status:'In Prüfung',validFrom:now,nextReview:A.plusMonths(now,24),author:'EHS Manager',reviewer:'Brandschutzbeauftragte Person',approver:'Werkleitung'});
    Object.assign(A.data.applicability,{requiredByConcept:true,requiredByRiskAssessment:true,conceptReference:'Brandschutzkonzept BSK-01, Rev. 3',stateBuildingLawChecked:true,specialBuildingRulesChecked:true,fireBrigadeRequirementsChecked:true,insurerRequirementsChecked:true});
    Object.assign(A.data.scope,{specialAreas:'Produktion, Hochregallager, Ammoniak-Kälteanlage, Batterieladestation, Büros',shiftModel:'Drei-Schicht-Betrieb, 24/7',maxPersons:'220',visitorsPerDay:'25',operatingHours:'Montag bis Sonntag, durchgehend',custom:'Betriebsfremde Personen werden durch ihre Ansprechperson geführt.'});
    Object.assign(A.data.alarm,{internalNumber:'Leitwarte 222',alarmMethod:'Druckknopfmelder oder interne Notrufstelle; anschließend Notruf 112',alarmSignal:'Evakuierungssirene und Lautsprecherdurchsage',assemblyPoint:'Besucherparkplatz Nord',fireBrigadeMeetingPoint:'Tor 1 / Feuerwehrinformationspunkt',fullCountMethod:'Bereichsverantwortliche melden Vollzähligkeit an die Räumungsleitung',fireDepartmentAccess:'Tor 1, Zufahrt Nord',keyDepot:'Feuerwehrschlüsseldepot am Tor 1',shutdownResponsible:'Technischer Dienst nach Freigabe der Einsatzleitung'});
    Object.assign(A.data.hazards,{visitors:true,mobility:true,hotWork:true,explosion:true,hazardousSubstances:true,pressureGases:true,ammonia:true,batteryCharging:true,highBay:true,fireAlarm:true,sprinkler:true,gasExtinguishing:true,smokeExtraction:true,criticalProcesses:true,environment:true});
    Object.assign(A.data.roles,{fireOfficer:'Brandschutzbeauftragte Person · Durchwahl 444',deputyFireOfficer:'EHS-Vertretung · Durchwahl 445',evacuationLead:'Schichtleitung',deputyEvacuationLead:'Stellvertretende Schichtleitung',fireWardens:'Bereichsbezogene Brandschutz- und Räumungshelfer',firstAid:'Ersthelfer gemäß Schichtplan',technicalService:'Technischer Dienst / Kältebereitschaft',gate:'Pforte Tor 1',environment:'Umweltmanagement / EHS',management:'Werkleitung',other:'Ammoniak-Fachkundige und Sprinklerwart'});
    PART_B.forEach(ch=>A.data.partB[ch.key]=A.suggestion('B',ch.key));PART_C.forEach(ch=>A.data.partC[ch.key]=A.suggestion('C',ch.key));
    Object.assign(A.data.release,{siteChecked:true,fireConceptChecked:true,rolesConfirmed:true,instructionsPlanned:true,symbolsChecked:true,professionalReview:false,authorityCoordination:true,approved:false});
    A.refreshInputs();A.showSection('meta');A.saveLocal();
  };
})();
