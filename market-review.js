(function(root){
  'use strict';
  const BSO=root.BSO;
  if(!BSO) throw new Error('market-review.js benötigt rules.js');

  const PERSPECTIVES={
    REGELWERK:'Regelwerk',
    BSB:'BSB-Fachprüfung',
    INSURER:'Sachschutz/Betriebsunterbrechung'
  };
  const OBJECT_TYPES=[
    'Büro / Verwaltung','Industrie / Produktion','Gewerbe / Handwerk','Logistik / Lager','Verkaufsstätte / Handel',
    'Versammlungsstätte','Beherbergungsstätte','Schule / Hochschule','Kindertagesstätte / Betreuung',
    'Krankenhaus / Pflege / Gesundheit','Labor / Forschung','Werkstatt / Instandhaltung','Rechenzentrum / IT',
    'Wohnnutzung mit Arbeitsbereichen','Gemischte Nutzung','Sonstige Nutzung'
  ];
  const SPECIAL_TYPES=new Set(['Verkaufsstätte / Handel','Versammlungsstätte','Beherbergungsstätte','Schule / Hochschule','Kindertagesstätte / Betreuung','Krankenhaus / Pflege / Gesundheit']);

  BSO.DEFAULTS.schemaVersion=3;
  Object.assign(BSO.DEFAULTS.meta,{federalState:'',objectType:'',useDescription:''});
  Object.assign(BSO.DEFAULTS.applicability,{requiredByRiskAssessment:false,sectorRulesChecked:false,sectorRuleReference:''});
  Object.assign(BSO.DEFAULTS.hazards,{
    multiTenant:false,contractors:false,kitchen:false,lithium:false,photovoltaic:false,combustibleDust:false,
    serverRoom:false,wasteStorage:false,externalFireExposure:false,arson:false
  });
  BSO.DEFAULTS.object={
    specialBuildingStatus:'Prüfung offen',multiTenantInterfaces:'',grossArea:'',floors:'',construction:'',
    propertyCriticality:'Nicht bewertet',businessInterruptionCriticality:'Nicht bewertet',criticalFunctions:''
  };
  BSO.DEFAULTS.expertReview={
    fireOfficerRequirement:'Prüfung offen',fireOfficerBasis:'',currentUseVerified:false,documentsConsistent:false,
    targetGroupsChecked:false,shiftCoverageChecked:false,evacuationChecked:false,specialPersonsChecked:false,
    preventionProcessesChecked:false,changeManagementChecked:false,impairmentManagementChecked:false,
    interfaceCoordinationChecked:false
  };
  BSO.DEFAULTS.insurance={
    status:'Prüfung offen',reference:'',requirements:'',recommendations:'',fireSectionsChecked:false,
    ignitionSourcesChecked:false,storageFireLoadChecked:false,protectionSystemsChecked:false,
    impairmentProcedureChecked:false,fireBrigadeWaterChecked:false,businessContinuityChecked:false,
    recommendationsTracked:false
  };

  if(!BSO.LEGAL_BASIS.some(x=>x.source==='TRGS 800')){
    BSO.LEGAL_BASIS.push({level:'Technische Regel',source:'TRGS 800',reference:'Brandschutzmaßnahmen',purpose:'Brandgefährdungen bei Tätigkeiten mit Gefahrstoffen und daraus abgeleitete Schutzmaßnahmen',url:'https://www.baua.de/DE/Angebote/Regelwerk/TRGS/TRGS-800'});
  }
  if(!BSO.LEGAL_BASIS.some(x=>x.source==='VdS 2000')){
    BSO.LEGAL_BASIS.push({level:'Sachversicherung',source:'VdS 2000',reference:'Brandschutz im Betrieb',purpose:'Schadenverhütung sowie Sachwert- und Betriebsunterbrechungsschutz; vertragliche Anforderungen bleiben objektspezifisch',url:'https://shop.vds.de/publikation/vds-2000'});
  }

  const baseValidate=BSO.validate;
  const blank=v=>v===null||v===undefined||String(v).trim()==='';
  const contains=(value,words)=>words.some(word=>String(value||'').toLowerCase().includes(word));
  const add=(list,type,code,title,text,section,perspective)=>list.push({type,code,title,text,section,perspective});
  const classify=result=>{
    if(result.perspective) return result;
    const code=String(result.code||'');
    const perspective=code.startsWith('HZ_')||code.startsWith('C_')||code.startsWith('ALARM_')?PERSPECTIVES.BSB:PERSPECTIVES.REGELWERK;
    return {...result,perspective};
  };
  const reviewGate=(list,d,ok,code,title,text,perspective=PERSPECTIVES.BSB)=>{
    if(ok) return;
    add(list,d.release?.approved?'error':'warn',code,title,text,'expertReview',perspective);
  };

  BSO.validate=function validateMarketProject(d){
    const r=baseValidate(d).map(classify);
    d.object=d.object||{};
    d.expertReview=d.expertReview||{};
    d.insurance=d.insurance||{};

    if(blank(d.meta.federalState)) add(r,'error','OBJ_STATE','Bundesland fehlt','Das maßgebliche Bundesland auswählen; Landes- und Sonderbauvorschriften unterscheiden sich.','meta',PERSPECTIVES.REGELWERK);
    if(blank(d.meta.objectType)) add(r,'error','OBJ_TYPE','Nutzungs-/Objektart fehlt','Die tatsächliche Hauptnutzung bzw. gemischte Nutzung auswählen.','meta',PERSPECTIVES.BSB);
    if(blank(d.meta.useDescription)) add(r,'warn','OBJ_USE_DESC','Nutzung nicht beschrieben','Nutzung, wesentliche Tätigkeiten, Lagerungen und besondere Betriebszustände kurz beschreiben.','meta',PERSPECTIVES.BSB);
    if(!d.object.specialBuildingStatus||d.object.specialBuildingStatus==='Prüfung offen') add(r,'warn','OBJ_SPECIAL_OPEN','Sonderbauprüfung offen','Prüfen und dokumentieren, ob landesrechtliche Sonderbauvorschriften anwendbar sind.','applicability',PERSPECTIVES.REGELWERK);
    if(SPECIAL_TYPES.has(d.meta.objectType)&&d.object.specialBuildingStatus!=='Sonderbau / besondere Vorschriften anwendbar') add(r,'error','OBJ_SPECIAL_EXPECTED','Sonderbauvorschriften nicht bestätigt','Für diese Nutzungsart ist die Anwendbarkeit besonderer bauordnungsrechtlicher Anforderungen konkret zu prüfen.','applicability',PERSPECTIVES.REGELWERK);
    if(d.object.specialBuildingStatus==='Sonderbau / besondere Vorschriften anwendbar'&&!d.applicability.specialBuildingRulesChecked) add(r,'error','OBJ_SPECIAL_RULES','Sonderbauvorschriften nicht abgeglichen','Anwendbare Sonderbauvorschriften, Bescheide und objektspezifische Abweichungen abgleichen.','applicability',PERSPECTIVES.REGELWERK);
    if(!d.applicability.sectorRulesChecked) add(r,'info','OBJ_SECTOR_RULES','Branchen-/Nutzungsregeln offen','Zusätzliche Regeln des Unfallversicherungsträgers, Gefahrstoff-, Explosionsschutz- und branchenspezifische Vorgaben prüfen.','applicability',PERSPECTIVES.BSB);

    if(d.hazards.multiTenant&&blank(d.object.multiTenantInterfaces)) add(r,'error','BSB_INTERFACES','Schnittstellen bei Mehrfachnutzung fehlen','Verantwortung von Eigentümer, Betreiber, Mietparteien, Fremdfirmen und gemeinsamen Einrichtungen festlegen.','scope',PERSPECTIVES.BSB);
    if(d.hazards.multiTenant&&!d.expertReview.interfaceCoordinationChecked) add(r,'warn','BSB_INTERFACE_CHECK','Schnittstellen nicht fachlich geprüft','Gemeinsame Alarmierung, Räumung, Sammelstellen, technische Anlagen und Verantwortlichkeiten abstimmen.','expertReview',PERSPECTIVES.BSB);

    const requirement=d.expertReview.fireOfficerRequirement||'Prüfung offen';
    if(requirement==='Prüfung offen') add(r,'error','BSB_REQUIREMENT_OPEN','Erforderlichkeit einer brandschutzbeauftragten Person offen','Besondere Rechtsvorschriften, behördliche Auflagen, Gefährdungsbeurteilung und Versichererempfehlungen prüfen und die Entscheidung dokumentieren.','expertReview',PERSPECTIVES.BSB);
    if(requirement!=='Prüfung offen'&&blank(d.expertReview.fireOfficerBasis)) add(r,'error','BSB_REQUIREMENT_BASIS','Entscheidungsgrundlage fehlt','Fundstelle, Gefährdungsbeurteilung oder fachliche Begründung zur Erforderlichkeit dokumentieren.','expertReview',PERSPECTIVES.BSB);
    if(requirement==='Erforderlich'){
      if(blank(d.roles.fireOfficer)) add(r,'error','BSB_REQUIRED','Brandschutzbeauftragte Person fehlt','Bei dokumentierter Erforderlichkeit die bestellte und qualifizierte Funktion mit Erreichbarkeit eintragen.','partC',PERSPECTIVES.BSB);
      if(blank(d.roles.deputyFireOfficer)) add(r,'warn','BSB_DEPUTY','Vertretung nicht geregelt','Vertretung und Erreichbarkeit für Abwesenheiten und alle relevanten Betriebszeiten festlegen.','partC',PERSPECTIVES.BSB);
    }
    if(requirement==='Empfohlen'&&blank(d.roles.fireOfficer)) add(r,'info','BSB_RECOMMENDED','Empfehlung noch nicht umgesetzt','Entscheidung der Unternehmensleitung zur empfohlenen Bestellung dokumentieren.','expertReview',PERSPECTIVES.BSB);

    reviewGate(r,d,d.expertReview.currentUseVerified,'BSB_USE_CHECK','Aktuelle Nutzung nicht bestätigt','Nutzungen, Tätigkeiten, Personenzahlen und Betriebszeiten vor Ort verifizieren.');
    reviewGate(r,d,d.expertReview.documentsConsistent,'BSB_DOC_CHECK','Dokumentenabgleich offen','Brandschutzordnung mit Genehmigung, Brandschutzkonzept, Alarmplan, Feuerwehrplan sowie Flucht- und Rettungsplänen abgleichen.');
    reviewGate(r,d,d.expertReview.targetGroupsChecked,'BSB_TARGET_CHECK','Zielgruppenprüfung offen','Teil A, B und C den richtigen Personengruppen zuordnen und Verteilung, Sprache und Zugänglichkeit prüfen.');
    reviewGate(r,d,d.expertReview.shiftCoverageChecked,'BSB_SHIFT_CHECK','Betriebszeiten/Vertretung offen','Alarm-, Räumungs- und Einweisungsfunktionen für Schichten, Nacht-, Wochenend- und Alleinarbeit sicherstellen.');
    reviewGate(r,d,d.expertReview.evacuationChecked,'BSB_EVAC_CHECK','Räumungsorganisation offen','Alarmwahrnehmung, Räumungsbereiche, Sammelstellen, Vollzähligkeit und Meldung vermisster Personen prüfen.');
    reviewGate(r,d,d.expertReview.specialPersonsChecked,'BSB_PERSONS_CHECK','Besondere Personengruppen offen','Besucher, Kinder, Pflegebedürftige, mobilitäts- oder sinnesbeeinträchtigte Personen objektspezifisch berücksichtigen.');
    reviewGate(r,d,d.expertReview.preventionProcessesChecked,'BSB_PREVENTION_CHECK','Brandverhütungsprozesse offen','Heißarbeiten, Fremdfirmen, Ordnung/Sauberkeit, Lagerung, Zündquellen und Meldewege für Mängel prüfen.');
    reviewGate(r,d,d.expertReview.changeManagementChecked,'BSB_CHANGE_CHECK','Änderungsmanagement offen','Aktualisierung bei Umbau, Nutzungsänderung, Anlagenänderung, Organisationsänderung oder Ereignissen festlegen.');
    reviewGate(r,d,d.expertReview.impairmentManagementChecked,'BSB_IMPAIRMENT_CHECK','Ausfallmanagement offen','Ausfall oder Abschaltung von BMA, Löschanlage, RWA, Sicherheitsbeleuchtung und Abschlüssen mit Ersatzmaßnahmen regeln.');

    const insuranceStatus=d.insurance.status||'Prüfung offen';
    if(insuranceStatus==='Prüfung offen') add(r,'warn','INS_STATUS_OPEN','Sachversicherungsanforderungen nicht geklärt','Versicherungsvertrag, Risikobericht und objektspezifische Empfehlungen auf zusätzliche Anforderungen prüfen.','expertReview',PERSPECTIVES.INSURER);
    if(['Vertragliche Anforderungen vorhanden','Risikobericht / Empfehlungen vorhanden'].includes(insuranceStatus)){
      if(blank(d.insurance.reference)) add(r,'error','INS_REFERENCE','Versichererreferenz fehlt','Versicherer, Bericht/Schreiben, Datum und Referenz dokumentieren.','expertReview',PERSPECTIVES.INSURER);
      if(blank(d.insurance.requirements)&&blank(d.insurance.recommendations)) add(r,'error','INS_REQUIREMENTS','Anforderungen/Empfehlungen fehlen','Die für die Brandschutzordnung relevanten Anforderungen oder Empfehlungen zusammenfassen.','expertReview',PERSPECTIVES.INSURER);
    }

    const technicalProtection=d.hazards.fireAlarm||d.hazards.sprinkler||d.hazards.gasExtinguishing||d.hazards.smokeExtraction;
    const elevatedStorage=d.hazards.highBay||d.hazards.lithium||d.hazards.combustibleDust||d.hazards.hazardousSubstances||d.hazards.wasteStorage;
    const ignitionExposure=d.hazards.hotWork||d.hazards.contractors||d.hazards.kitchen||d.hazards.photovoltaic||d.hazards.arson||d.hazards.externalFireExposure;
    const highCriticality=['Hoch','Existenzkritisch'].includes(d.object.propertyCriticality)||['Hoch','Existenzkritisch'].includes(d.object.businessInterruptionCriticality);

    reviewGate(r,d,d.insurance.fireSectionsChecked,'INS_COMPARTMENTS','Brandabschnitte/Abschlüsse nicht risikotechnisch geprüft','Brand- und Rauchabschnitte, Türen/Tore, Abschottungen und betriebliche Freihaltung auf Schadenbegrenzung prüfen.',PERSPECTIVES.INSURER);
    if(ignitionExposure) reviewGate(r,d,d.insurance.ignitionSourcesChecked,'INS_IGNITION','Zündquellenkontrolle offen','Heißarbeiten, Elektrik, Küchen, PV, Brandstiftung, Fremdfirmen und Außenbereiche risikotechnisch prüfen.',PERSPECTIVES.INSURER);
    if(elevatedStorage) reviewGate(r,d,d.insurance.storageFireLoadChecked,'INS_STORAGE','Brandlast/Lagerung offen','Brandlasten, Lagerhöhen, Abstände, Stofftrennung, Außenlager und Löschanlagenwirksamkeit prüfen.',PERSPECTIVES.INSURER);
    if(technicalProtection){
      reviewGate(r,d,d.insurance.protectionSystemsChecked,'INS_PROTECTION','Schutzanlagen nicht bewertet','Auslegung, Schutzumfang, Alarmweiterleitung, Wartung und bekannte Einschränkungen der Schutzanlagen prüfen.',PERSPECTIVES.INSURER);
      reviewGate(r,d,d.insurance.impairmentProcedureChecked,'INS_IMPAIRMENT','Außerbetriebnahmeverfahren fehlt','Meldung, Genehmigung, Ersatzmaßnahmen, Brandwache und Wiederinbetriebnahme bei Anlagenausfällen festlegen.',PERSPECTIVES.INSURER);
    }
    reviewGate(r,d,d.insurance.fireBrigadeWaterChecked,'INS_FIRE_SERVICE','Feuerwehr/Löschwasserprüfung offen','Feuerwehrzugang, Aufstellflächen, Schlüssel, Pläne, Löschwasserversorgung und Rückhaltung prüfen.',PERSPECTIVES.INSURER);
    if(highCriticality){
      reviewGate(r,d,d.insurance.businessContinuityChecked,'INS_BC','Betriebsunterbrechung nicht bewertet','Kritische Prozesse, Wiederanlauf, Ersatzkapazitäten, Daten, Lieferketten und Abhängigkeiten in die Notfallorganisation einbeziehen.',PERSPECTIVES.INSURER);
      if(blank(d.object.criticalFunctions)) add(r,'warn','INS_CRITICAL_FUNCTIONS','Kritische Funktionen nicht benannt','Existenz- oder lieferkritische Anlagen, Bereiche, Daten und Versorgungen dokumentieren.','expertReview',PERSPECTIVES.INSURER);
    }
    if(!blank(d.insurance.recommendations)&&!d.insurance.recommendationsTracked) add(r,'warn','INS_TRACKING','Versichererempfehlungen nicht nachverfolgt','Verantwortliche, Fristen, Status und Wirksamkeitskontrolle außerhalb der Brandschutzordnung dokumentieren.','expertReview',PERSPECTIVES.INSURER);

    const text=[d.partA?.prevent,d.partA?.report,d.partA?.rescue,d.partA?.extinguish,d.partA?.extra,...Object.values(d.partB||{}),...Object.values(d.partC||{})].join(' ').toLowerCase();
    const contentCheck=(active,words,code,title,detail,section='partB')=>{if(active&&!contains(text,words)) add(r,'warn',code,title,detail,section,PERSPECTIVES.BSB);};
    contentCheck(d.hazards.contractors,['fremdfirma','auftragnehmer','koordination'],'HZ_CONTRACTORS','Fremdfirmen nicht berücksichtigt','Zutritt, Unterweisung, Heißarbeiten, Alarmierung und Verantwortungsübergaben regeln.');
    contentCheck(d.hazards.kitchen,['küche','fettbrand','dunstabzug'],'HZ_KITCHEN','Küchen-/Fettbrandrisiko fehlt','Geeignete Löschmittel, Abschaltung, Reinigung und Verhalten bei Fettbränden festlegen.');
    contentCheck(d.hazards.lithium,['lithium','akku','batterie'],'HZ_LITHIUM','Lithium-Ionen-Risiko fehlt','Lagerung/Laden, beschädigte Akkus, Alarmierung, Quarantäne und Einsatzhinweise objektspezifisch festlegen.');
    contentCheck(d.hazards.photovoltaic,['photovoltaik','pv-anlage','pv '],'HZ_PV','Photovoltaikanlage nicht berücksichtigt','Kennzeichnung, Abschaltmöglichkeiten, Restspannungen und Feuerwehrinformationen festlegen.','partC');
    contentCheck(d.hazards.combustibleDust,['staub','staubexplosion','absaugung'],'HZ_DUST','Brennbare Stäube nicht berücksichtigt','Staubablagerungen, Absaugung, Zündquellen und Explosionsschutzorganisation berücksichtigen.');
    contentCheck(d.hazards.serverRoom,['server','rechenzentrum','it-raum'],'HZ_SERVER','IT-/Serverbereich nicht berücksichtigt','Alarmierung, Löschanlage, Energieabschaltung, Zutritt und Wiederfreigabe regeln.','partC');
    contentCheck(d.hazards.wasteStorage,['abfall','container','außenlager'],'HZ_WASTE','Abfall-/Außenlagerung nicht berücksichtigt','Abstände, Entleerungsrhythmus, Zündquellen und Schutz gegen Brandstiftung berücksichtigen.');

    const seen=new Set();
    return r.filter(item=>{const key=`${item.code}|${item.perspective}`;if(seen.has(key))return false;seen.add(key);return true;});
  };

  BSO.score=function scoreMarketProject(d){
    const r=BSO.validate(d),errors=r.filter(x=>x.type==='error').length,warnings=r.filter(x=>x.type==='warn').length,infos=r.filter(x=>x.type==='info').length;
    return {errors,warnings,infos,percent:Math.max(0,Math.min(100,100-errors*4-warnings*1.5))};
  };
  BSO.OBJECT_TYPES=OBJECT_TYPES;
  BSO.PERSPECTIVES=PERSPECTIVES;

  if(typeof module==='object'&&module.exports) module.exports=BSO;
})(typeof globalThis!=='undefined'?globalThis:this);
