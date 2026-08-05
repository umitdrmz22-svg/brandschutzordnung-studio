'use strict';
(()=>{
  const A=window.BSO_APP,$=A.$,$$=A.$$,esc=A.esc;
  const css=document.createElement('link');css.rel='stylesheet';css.href='market.css?v=3';document.head.appendChild(css);

  Object.assign(A.hazardLabels,{
    multiTenant:['Mehrere Nutzer / Mietparteien','Gemeinsame Alarmierung, Fluchtwege, Anlagen und Zuständigkeiten koordinieren.'],
    contractors:['Regelmäßige Fremdfirmen','Zutritt, Unterweisung, Freigaben und Alarmorganisation abstimmen.'],
    kitchen:['Gewerbliche Küche / Fettbrandrisiko','Fettbrände, Dunstabzug, Reinigung und geeignete Löschmittel berücksichtigen.'],
    lithium:['Lithium-Ionen-Akkus / Energiespeicher','Lagerung, Laden, beschädigte Akkus und Quarantäne regeln.'],
    photovoltaic:['Photovoltaikanlage','Kennzeichnung, Abschaltung, Restspannungen und Feuerwehrinformation berücksichtigen.'],
    combustibleDust:['Brennbare Stäube','Ablagerungen, Absaugung, Zündquellen und Explosionsschutz berücksichtigen.'],
    serverRoom:['Server-/IT-/Rechenzentrumsbereiche','Energie, Löschanlage, Zutritt und Wiederanlauf regeln.'],
    wasteStorage:['Abfall-/Außenlagerung','Abstände, Container, Brandstiftung und Entleerung berücksichtigen.'],
    externalFireExposure:['Brandübertragung von außen','Nachbargebäude, Außenlager, Vegetation und Abstände bewerten.'],
    arson:['Erhöhtes Brandstiftungsrisiko','Zutritt, Beleuchtung, Außenlager und Kontrollen berücksichtigen.']
  });

  const releaseButton=$('#steps button[data-section="release"]');
  if(releaseButton){
    releaseButton.insertAdjacentHTML('beforebegin','<button data-section="expertReview"><span>8</span>Fach- & Risikoprüfung</button>');
    releaseButton.querySelector('span').textContent='9';
    const checkButton=$('#steps button[data-section="check"]');
    if(checkButton) checkButton.querySelector('span').textContent='10';
  }

  const metaGrid=$('#meta .grid.two');
  if(metaGrid) metaGrid.insertAdjacentHTML('beforeend',`
    <label>Nutzungs-/Objektart *<select data-path="meta.objectType" id="objectTypeSelect"></select></label>
    <label>Sonderbaustatus<select data-path="object.specialBuildingStatus">
      <option>Prüfung offen</option><option>Sonderbau / besondere Vorschriften anwendbar</option>
      <option>Kein Sonderbau nach dokumentierter Prüfung</option><option>Nicht abschließend bewertet</option>
    </select></label>
    <label class="wide">Nutzung und wesentliche Tätigkeiten *<textarea data-path="meta.useDescription" rows="3" placeholder="Tatsächliche Nutzung, Tätigkeiten, Lagerungen, Publikumsverkehr und besondere Betriebszustände"></textarea></label>
    <label>Bruttogrundfläche / relevante Fläche<input data-path="object.grossArea" placeholder="z. B. 8.500 m²"></label>
    <label>Geschosse / Ebenen<input data-path="object.floors" placeholder="z. B. EG + 2 OG + UG"></label>
    <label>Wesentliche Bauart / Konstruktion<input data-path="object.construction" placeholder="z. B. Massivbau, Stahlhalle, Sandwichpaneele"></label>
    <label>Sachwertkritikalität<select data-path="object.propertyCriticality"><option>Nicht bewertet</option><option>Niedrig</option><option>Mittel</option><option>Hoch</option><option>Existenzkritisch</option></select></label>
    <label>Betriebsunterbrechungskritikalität<select data-path="object.businessInterruptionCriticality"><option>Nicht bewertet</option><option>Niedrig</option><option>Mittel</option><option>Hoch</option><option>Existenzkritisch</option></select></label>
    <label class="wide">Kritische Funktionen, Prozesse und Abhängigkeiten<textarea data-path="object.criticalFunctions" rows="3" placeholder="Kritische Anlagen, Daten, Versorgung, Lieferketten, Wiederanlauf"></textarea></label>
  `);

  const applicabilityChecks=$('#applicability .check-stack');
  if(applicabilityChecks) applicabilityChecks.insertAdjacentHTML('beforeend',`
    <label><input data-path="applicability.sectorRulesChecked" type="checkbox"><span><b>Branchen- und nutzungsspezifische Regeln geprüft</b><small>Unfallversicherungsträger, Gefahrstoff-/Explosionsschutz, technische Regeln und besondere Betriebsarten</small></span></label>
  `);
  const appNotes=$('#applicability label:last-of-type');
  if(appNotes) appNotes.insertAdjacentHTML('beforebegin','<label>Referenz Branchen-/Nutzungsregeln<input data-path="applicability.sectorRuleReference" placeholder="Regelwerk, Ausgabe, betroffene Bereiche"></label>');

  const scopeGrid=$('#scope .grid.two');
  if(scopeGrid) scopeGrid.insertAdjacentHTML('beforeend','<label class="wide">Schnittstellen bei mehreren Nutzern / Betreibern<textarea data-path="object.multiTenantInterfaces" rows="3" placeholder="Eigentümer, Betreiber, Mietparteien, gemeinsame Anlagen, Alarmierung und Zuständigkeiten"></textarea></label>');

  const release=$('#release');
  if(release) release.insertAdjacentHTML('beforebegin',`
    <section id="expertReview" class="panel">
      <div class="heading"><span>08</span><div><h1>Fach- und Risikoprüfung</h1><p>Interne Qualitätssicherung aus Sicht einer fachkundigen brandschutzbeauftragten Person und der Sachversicherung. Dieser Prüfschritt wird nicht als Bestandteil der Brandschutzordnung ausgegeben.</p></div></div>
      <div class="review-banner"><b>Zwei getrennte Schutzziele</b><p>Die BSB-Fachprüfung konzentriert sich auf Personenschutz, Organisation und konsistente Umsetzung. Die Sachversichererperspektive ergänzt Sachwertschutz, Schadenbegrenzung und Betriebsunterbrechung. Versichereranforderungen sind vertraglich und objektspezifisch; die Anwendung erteilt keine Versichererfreigabe.</p></div>

      <h2>BSB-Fachprüfung</h2>
      <div class="grid two">
        <label>Erforderlichkeit Brandschutzbeauftragte/r *<select data-path="expertReview.fireOfficerRequirement"><option>Prüfung offen</option><option>Erforderlich</option><option>Empfohlen</option><option>Nicht erforderlich</option></select></label>
        <label>Entscheidungsgrundlage *<input data-path="expertReview.fireOfficerBasis" placeholder="Rechtsvorschrift, Auflage, Gefährdungsbeurteilung, fachliche Begründung"></label>
      </div>
      <div class="check-stack review-checks">
        <label><input data-path="expertReview.currentUseVerified" type="checkbox"><span><b>Aktuelle Nutzung vor Ort verifiziert</b><small>Nutzungen, Tätigkeiten, Personen, Lagerungen und Betriebszeiten entsprechen den Eingaben.</small></span></label>
        <label><input data-path="expertReview.documentsConsistent" type="checkbox"><span><b>Brandschutzdokumente widerspruchsfrei</b><small>Genehmigung, Brandschutzkonzept, Alarmplan, Feuerwehrplan sowie Flucht- und Rettungspläne wurden abgeglichen.</small></span></label>
        <label><input data-path="expertReview.targetGroupsChecked" type="checkbox"><span><b>Zielgruppen A/B/C und Zugänglichkeit geprüft</b><small>Adressaten, Verteilung, Sprache, Verständlichkeit und Barrierefreiheit sind angemessen.</small></span></label>
        <label><input data-path="expertReview.shiftCoverageChecked" type="checkbox"><span><b>Organisation für alle Betriebszeiten geprüft</b><small>Schichten, Nacht, Wochenende, Alleinarbeit, Abwesenheiten und Vertretungen sind abgedeckt.</small></span></label>
        <label><input data-path="expertReview.evacuationChecked" type="checkbox"><span><b>Alarmierung und Räumung geprüft</b><small>Alarmwahrnehmung, Bereiche, Sammelstellen, Vollzähligkeit und vermisste Personen sind geregelt.</small></span></label>
        <label><input data-path="expertReview.specialPersonsChecked" type="checkbox"><span><b>Besondere Personengruppen geprüft</b><small>Besucher, Kinder, Pflegebedürftige sowie mobilitäts- oder sinnesbeeinträchtigte Personen sind berücksichtigt.</small></span></label>
        <label><input data-path="expertReview.preventionProcessesChecked" type="checkbox"><span><b>Brandverhütungsprozesse geprüft</b><small>Heißarbeiten, Fremdfirmen, Zündquellen, Lagerung, Ordnung und Mängelmeldung sind geregelt.</small></span></label>
        <label><input data-path="expertReview.changeManagementChecked" type="checkbox"><span><b>Änderungs- und Aktualisierungsprozess geprüft</b><small>Umbau, Nutzungs-, Anlagen- und Organisationsänderungen lösen eine dokumentierte Überprüfung aus.</small></span></label>
        <label><input data-path="expertReview.impairmentManagementChecked" type="checkbox"><span><b>Ausfallmanagement für Brandschutztechnik geprüft</b><small>Ersatzmaßnahmen, Meldung, Brandwache und Wiederinbetriebnahme sind festgelegt.</small></span></label>
        <label><input data-path="expertReview.interfaceCoordinationChecked" type="checkbox"><span><b>Schnittstellen mehrerer Betreiber geprüft</b><small>Gemeinsame Fluchtwege, Anlagen, Alarmierung und Verantwortungen sind koordiniert.</small></span></label>
      </div>

      <h2>Sachschutz und Betriebsunterbrechung</h2>
      <div class="grid two">
        <label>Status Sachversicherungsanforderungen<select data-path="insurance.status"><option>Prüfung offen</option><option>Keine zusätzlichen Anforderungen bekannt</option><option>Vertragliche Anforderungen vorhanden</option><option>Risikobericht / Empfehlungen vorhanden</option></select></label>
        <label>Referenz Versicherer / Risikobericht<input data-path="insurance.reference" placeholder="Versicherer, Bericht, Datum, Referenz"></label>
        <label>Relevante Anforderungen<textarea data-path="insurance.requirements" rows="3" placeholder="Nur für die Brandschutzorganisation relevante vertragliche Anforderungen"></textarea></label>
        <label>Empfehlungen / offene Punkte<textarea data-path="insurance.recommendations" rows="3" placeholder="Risikotechnische Empfehlungen, Fristen und Einschränkungen"></textarea></label>
      </div>
      <div class="check-stack review-checks insurer">
        <label><input data-path="insurance.fireSectionsChecked" type="checkbox"><span><b>Brandabschnitte und Abschlüsse bewertet</b><small>Brand-/Rauchabschnitte, Türen, Tore, Abschottungen und betriebliche Freihaltung.</small></span></label>
        <label><input data-path="insurance.ignitionSourcesChecked" type="checkbox"><span><b>Zündquellen und Brandentstehung bewertet</b><small>Heißarbeiten, Elektrik, Küchen, PV, Fremdfirmen, Brandstiftung und Außenbereiche.</small></span></label>
        <label><input data-path="insurance.storageFireLoadChecked" type="checkbox"><span><b>Brandlasten und Lagerung bewertet</b><small>Lagerhöhe, Abstände, Stofftrennung, Außenlager und Wirksamkeit vorhandener Schutzanlagen.</small></span></label>
        <label><input data-path="insurance.protectionSystemsChecked" type="checkbox"><span><b>Technische Schutzsysteme bewertet</b><small>Schutzumfang, Betriebsbereitschaft, Alarmweiterleitung, Wartung und bekannte Einschränkungen.</small></span></label>
        <label><input data-path="insurance.impairmentProcedureChecked" type="checkbox"><span><b>Außerbetriebnahmeverfahren bewertet</b><small>Genehmigung, Meldung, Ersatzmaßnahmen, Brandwache und Wiederherstellung.</small></span></label>
        <label><input data-path="insurance.fireBrigadeWaterChecked" type="checkbox"><span><b>Feuerwehrzugang und Löschwasser bewertet</b><small>Zufahrt, Aufstellflächen, Schlüssel, Pläne, Löschwasserversorgung und Rückhaltung.</small></span></label>
        <label><input data-path="insurance.businessContinuityChecked" type="checkbox"><span><b>Betriebsunterbrechungsrisiko bewertet</b><small>Kritische Prozesse, Daten, Versorgung, Ersatzkapazitäten, Lieferketten und Wiederanlauf.</small></span></label>
        <label><input data-path="insurance.recommendationsTracked" type="checkbox"><span><b>Empfehlungen werden außerhalb der BSO nachverfolgt</b><small>Verantwortliche, Fristen, Status, Nachweise und Wirksamkeitskontrolle sind im Maßnahmenmanagement geführt.</small></span></label>
      </div>
      <div class="legal"><b>Abgrenzung</b><p>Diese Prüfung erweitert die Qualität der Brandschutzordnung, ersetzt aber weder eine vollständige Brandschutzbegehung noch eine Risikobesichtigung des Versicherers. Bauliche und anlagentechnische Mängel gehören in ein separates Maßnahmen- und Nachweismanagement.</p></div>
    </section>
  `);

  const badge=$('.local-badge');if(badge) badge.innerHTML='<span></span>Deutschlandweit · Keine KI · lokale Verarbeitung';
  const sideNote=$('.sidebar-note');if(sideNote) sideNote.innerHTML='<b>Prüfbasis</b><span>DIN 14096 · ASR A2.2<br>BSB-Fachprüfung · Sachschutz</span>';

  const baseBuild=A.buildStatic;
  A.buildStatic=()=>{
    baseBuild();
    const state=$('#stateSelect');if(state&&!state.querySelector('option[value=""]')) state.insertAdjacentHTML('afterbegin','<option value="">Bitte auswählen</option>');
    const type=$('#objectTypeSelect');if(type) type.innerHTML='<option value="">Bitte auswählen</option>'+A.R.OBJECT_TYPES.map(x=>`<option>${esc(x)}</option>`).join('');
  };

  const baseSuggestion=A.suggestion;
  A.suggestion=(part,key)=>{
    const d=A.data;
    const enhanced={
      'B.brandverhuetung':'Rauch- und Feuerverbote sind einzuhalten. Brennbare Stoffe, Abfälle und Arbeitsmittel dürfen nur in freigegebenen Bereichen und Mengen bereitgestellt werden. Elektrische Geräte sind bestimmungsgemäß zu benutzen. Feuergefährliche Arbeiten und Arbeiten von Fremdfirmen dürfen nur nach dokumentierter Freigabe und mit festgelegten Schutz- und Nachkontrollmaßnahmen erfolgen.',
      'B.brandRauch':'Brand- und Rauchschutztüren, Tore und Abschottungen dürfen weder festgestellt noch in ihrer Funktion beeinträchtigt werden. Brandlasten und Lagerungen sind von Abschlüssen, Fluchtwegen und Brandschutzeinrichtungen fernzuhalten. Schäden oder Veränderungen sind unverzüglich zu melden.',
      'C.brandverhuetung':'Die zuständigen Funktionen überwachen organisatorische Brandschutzmaßnahmen, begleiten Nutzungs-, Bau-, Anlagen- und Prozessänderungen und koordinieren Fremdfirmen. Mängel sowie Ausfälle von Brandschutzeinrichtungen werden bewertet, mit Ersatzmaßnahmen abgesichert und bis zur wirksamen Beseitigung nachverfolgt.',
      'C.sicherheitsmassnahmen':`Die Räumung und der Personenschutz haben Vorrang. Technische Maßnahmen dürfen nur durch beauftragte Personen erfolgen, wenn niemand gefährdet und die Räumung nicht verzögert wird. Besondere Stoff-, Anlagen-, Umwelt- und Sachwertrisiken sowie kritische Funktionen (${d.object?.criticalFunctions||'objektspezifisch festlegen'}) sind der Feuerwehr mitzuteilen.`,
      'C.nachsorge':'Der betroffene Bereich bleibt bis zur fachlich verantworteten Freigabe abgesperrt. Brandwache, Wiederherstellung aller Brandschutzeinrichtungen, Meldungen, Beweissicherung, Schadenbegrenzung und Ereignisanalyse werden organisiert. Ein betrieblicher Wiederanlauf erfolgt nur nach dokumentierter technischer und organisatorischer Freigabe.'
    };
    return enhanced[`${part}.${key}`]||baseSuggestion(part,key);
  };

  A.showCheck=()=>{
    A.lastResults=A.R.validate(A.data);
    const types={error:0,warn:0,info:0,ok:0},perspectives={};
    A.lastResults.forEach(x=>{types[x.type]=(types[x.type]||0)+1;perspectives[x.perspective]=(perspectives[x.perspective]||0)+1;});
    $('#checkSummary').innerHTML=`<div class="summary error"><b>${types.error}</b><span>Pflichtabweichungen</span></div><div class="summary warn"><b>${types.warn}</b><span>Warnungen</span></div><div class="summary info"><b>${types.info}</b><span>Hinweise</span></div><div class="perspective-totals">${Object.entries(perspectives).map(([k,v])=>`<span><b>${v}</b> ${esc(k)}</span>`).join('')}</div>`;
    $('#results').className='results';
    $('#results').innerHTML=A.lastResults.map(x=>`<button class="result ${x.type}" data-go="${esc(x.section)}"><span class="perspective ${x.perspective===A.R.PERSPECTIVES.INSURER?'insurer':''}">${esc(x.perspective||'Regelwerk')}</span><span class="result-code">${esc(x.code)}</span><b>${esc(x.title)}</b><small>${esc(x.text)}</small></button>`).join('');
    $('#results').querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>A.showSection(b.dataset.go)));
    A.showSection('check');A.renderAll();
  };

  const baseRender=A.renderPreview;
  A.renderPreview=()=>{
    baseRender();
    $$('#preview .cover-data').forEach(dl=>{if(!dl.querySelector('[data-market-row]'))dl.insertAdjacentHTML('beforeend',`<div data-market-row><dt>Nutzungsart</dt><dd>${esc(A.data.meta.objectType||'–')}</dd></div>`);});
  };

  A.demo=()=>{
    A.data=A.R.cloneDefaults();const now=A.today();
    Object.assign(A.data.meta,{company:'Musterbetrieb GmbH',site:'Standort Beispielstadt',address:'Beispielstraße 10, 00000 Beispielstadt',area:'Verwaltungs-, Werkstatt- und Lagerbereiche',federalState:'Nordrhein-Westfalen',objectType:'Gemischte Nutzung',useDescription:'Verwaltung, technische Werkstatt, Lagerung von Betriebsstoffen und Waren sowie regelmäßiger Fremdfirmeneinsatz.',documentNo:'BSO-MUSTER-001',version:'1.0',status:'In Prüfung',validFrom:now,nextReview:A.plusMonths(now,24),author:'Dokumentenverantwortliche Person',reviewer:'Fachkundige brandschutzbeauftragte Person',approver:'Unternehmensleitung'});
    Object.assign(A.data.object,{specialBuildingStatus:'Kein Sonderbau nach dokumentierter Prüfung',multiTenantInterfaces:'Nicht zutreffend; der Standort wird durch einen Betreiber genutzt.',grossArea:'6.200 m²',floors:'EG + 2 OG',construction:'Massivbau und eingeschossige Stahlhalle',propertyCriticality:'Hoch',businessInterruptionCriticality:'Hoch',criticalFunctions:'Zentrale IT, Hauptlager, Energieversorgung und technische Werkstatt.'});
    Object.assign(A.data.applicability,{requiredByRiskAssessment:true,stateBuildingLawChecked:true,specialBuildingRulesChecked:true,fireBrigadeRequirementsChecked:true,insurerRequirementsChecked:true,sectorRulesChecked:true,sectorRuleReference:'Zuständiger Unfallversicherungsträger und objektspezifische technische Regeln geprüft.'});
    Object.assign(A.data.scope,{specialAreas:'Verwaltung, Werkstatt, Lager, Batterieladebereich, Serverraum',shiftModel:'Tagschicht mit Bereitschaft und zeitweiser Alleinarbeit',maxPersons:'140',visitorsPerDay:'20',operatingHours:'Montag bis Samstag; Bereitschaft außerhalb der Regelzeiten',custom:'Besucher und Fremdfirmen werden eingewiesen und durch ihre Ansprechperson betreut.'});
    Object.assign(A.data.alarm,{internalNumber:'Zentrale 100',alarmMethod:'Druckknopfmelder oder Telefon; anschließend Notruf 112',alarmSignal:'Räumungsalarm und Sprachdurchsage',assemblyPoint:'Sammelstelle Parkplatz Ost',fireBrigadeMeetingPoint:'Haupteinfahrt / Feuerwehrinformationspunkt',fullCountMethod:'Bereichsverantwortliche melden an die Räumungsleitung',fireDepartmentAccess:'Haupteinfahrt, Zufahrt Ost',keyDepot:'Feuerwehrschlüsseldepot an der Haupteinfahrt',shutdownResponsible:'Technischer Dienst nach festgelegter Priorität und ohne Verzögerung der Räumung'});
    Object.assign(A.data.hazards,{visitors:true,mobility:true,hotWork:true,contractors:true,lithium:true,batteryCharging:true,fireAlarm:true,smokeExtraction:true,serverRoom:true,wasteStorage:true,criticalProcesses:true});
    Object.assign(A.data.roles,{fireOfficer:'Bestellte brandschutzbeauftragte Person · Kontakt intern',deputyFireOfficer:'Benannte Vertretung',evacuationLead:'Betriebliche Räumungsleitung',deputyEvacuationLead:'Vertretung gemäß Anwesenheitsplan',fireWardens:'Bereichsbezogene Brandschutz- und Evakuierungshelfer',firstAid:'Ersthelfer gemäß Anwesenheitsplan',technicalService:'Technischer Dienst / Bereitschaft',gate:'Empfang / Zentrale',environment:'Beauftragte Umweltfunktion',management:'Unternehmensleitung',other:'IT-Verantwortliche und Anlagenverantwortliche'});
    A.R.PART_B.forEach(ch=>A.data.partB[ch.key]=A.suggestion('B',ch.key));A.R.PART_C.forEach(ch=>A.data.partC[ch.key]=A.suggestion('C',ch.key));
    A.data.partB.besondereRegeln+=' Lithium-Ionen-Akkus werden nur in festgelegten Bereichen geladen und gelagert; beschädigte Akkus werden gesichert separiert. Fremdfirmen unterliegen dem betrieblichen Freigabe- und Unterweisungsverfahren.';
    Object.assign(A.data.expertReview,{fireOfficerRequirement:'Erforderlich',fireOfficerBasis:'Gefährdungsbeurteilung und betriebliche Organisationsentscheidung',currentUseVerified:true,documentsConsistent:true,targetGroupsChecked:true,shiftCoverageChecked:true,evacuationChecked:true,specialPersonsChecked:true,preventionProcessesChecked:true,changeManagementChecked:true,impairmentManagementChecked:true,interfaceCoordinationChecked:true});
    Object.assign(A.data.insurance,{status:'Risikobericht / Empfehlungen vorhanden',reference:'Risikobericht Muster, Stand 01/2026',requirements:'Heißarbeitenfreigabe, kontrollierte Außerbetriebnahme von Schutzanlagen und Freihaltung von Brandabschnitten.',recommendations:'Verbesserte Trennung der Außenlagerung; Nachverfolgung im Maßnahmenmanagement.',fireSectionsChecked:true,ignitionSourcesChecked:true,storageFireLoadChecked:true,protectionSystemsChecked:true,impairmentProcedureChecked:true,fireBrigadeWaterChecked:true,businessContinuityChecked:true,recommendationsTracked:true});
    Object.assign(A.data.release,{siteChecked:true,fireConceptChecked:true,rolesConfirmed:true,instructionsPlanned:true,symbolsChecked:true,professionalReview:true,authorityCoordination:false,approved:false});
    A.refreshInputs();A.showSection('meta');A.saveLocal();
  };
})();
