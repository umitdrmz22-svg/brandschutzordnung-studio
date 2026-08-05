(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.BSO=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const PART_B=[
    {key:'intro',title:'Einleitung',hint:'Zweck, Geltungsbereich, Zielgruppen, Inkraftsetzung und Verbindlichkeit.'},
    {key:'brandverhuetung',title:'Brandverhütung',hint:'Rauch- und Feuerverbote, Ordnung, Lagerung, elektrische Geräte, Heißarbeiten und betriebliche Freigaben.'},
    {key:'brandRauch',title:'Brand- und Rauchausbreitung',hint:'Brand- und Rauchschutztüren, Abschottungen, Brandlasten und technische Einrichtungen.'},
    {key:'fluchtwege',title:'Flucht- und Rettungswege',hint:'Freihaltung, Kennzeichnung, Notausgänge, Feuerwehrflächen und Verhalten bei Einschränkungen.'},
    {key:'meldeLoesch',title:'Melde- und Löscheinrichtungen',hint:'Brandmelder, Alarmierung, Feuerlöscher, Wandhydranten und besondere Löschanlagen.'},
    {key:'verhaltenBrand',title:'Verhalten im Brandfall',hint:'Ruhe bewahren, Alarm auslösen, warnen, räumen, Türen schließen und Anweisungen beachten.'},
    {key:'brandMelden',title:'Brand melden',hint:'Betrieblicher Meldeweg, Notruf, notwendige Angaben und Einweisung der Feuerwehr.'},
    {key:'alarmsignale',title:'Alarmsignale und Anweisungen beachten',hint:'Alarmton, Durchsage, optische Alarmierung und Weisungsbefugnisse.'},
    {key:'sicherheit',title:'In Sicherheit bringen',hint:'Räumung, Sammelstelle, hilfsbedürftige Personen, Aufzüge, Vollzähligkeitskontrolle.'},
    {key:'loeschversuch',title:'Löschversuche unternehmen',hint:'Nur ohne Eigengefährdung, Rückzugsweg, geeignete Löschmittel und Abbruchkriterien.'},
    {key:'besondereRegeln',title:'Besondere Verhaltensregeln',hint:'Objekt-, bereichs- und prozessspezifische Gefahren und Maßnahmen.'}
  ];

  const PART_C=[
    {key:'intro',title:'Einleitung',hint:'Adressatenkreis, Aufgabenübertragung, Geltungsbereich, Vertretungen und Weisungsbefugnisse.'},
    {key:'brandverhuetung',title:'Brandverhütung',hint:'Kontrollen, Freigaben, Heißarbeiten, Brandschutz bei Änderungen und Fremdfirmen.'},
    {key:'alarmierung',title:'Meldung und Alarmierungsablauf',hint:'Alarmkette, interne Stellen, Feuerwehr, Werkleitung und externe Stellen.'},
    {key:'sicherheitsmassnahmen',title:'Sicherheitsmaßnahmen für Personen, Tiere, Umwelt und Sachwerte',hint:'Räumung, Abschaltungen, Gefahrstoffe, Löschanlagen, Umweltschutz und kritische Prozesse.'},
    {key:'loeschmassnahmen',title:'Löschmaßnahmen',hint:'Betriebliche Erstmaßnahmen, Grenzen, Koordination und Schutz der Handelnden.'},
    {key:'feuerwehr',title:'Vorbereitung für den Einsatz der Feuerwehr',hint:'Zufahrten, Schlüssel, Pläne, Gefahrstoffinformationen, Ansprechpartner und Einweisung.'},
    {key:'nachsorge',title:'Nachsorge',hint:'Absperrung, Brandwache, Freigabe, Ereignisdokumentation, Meldungen und Wirksamkeitskontrolle.'}
  ];

  const LEGAL_BASIS=[
    {level:'Bund',source:'Arbeitsschutzgesetz',reference:'§§ 4, 10 und 12',purpose:'Grundsätze, Brandbekämpfung/Evakuierung und Unterweisung',url:'https://www.gesetze-im-internet.de/arbschg/'},
    {level:'Bund',source:'Arbeitsstättenverordnung',reference:'§§ 3a, 4 sowie Anhang 2.2/2.3',purpose:'Brandschutz, Alarmierung, Flucht und Rettung',url:'https://www.gesetze-im-internet.de/arbst_ttv_2004/'},
    {level:'Technische Regel',source:'ASR A2.2',reference:'Maßnahmen gegen Brände',purpose:'Organisatorischer Brandschutz und betriebliche Festlegungen',url:'https://www.baua.de/DE/Angebote/Regelwerk/ASR/ASR-A2-2'},
    {level:'Technische Regel',source:'ASR A2.3',reference:'Fluchtwege und Notausgänge',purpose:'Räumung, Fluchtwege und Übungen',url:'https://www.baua.de/DE/Angebote/Regelwerk/ASR/ASR-A2-3'},
    {level:'Technische Regel',source:'ASR A1.3',reference:'Sicherheitskennzeichnung',purpose:'Sicherheitszeichen und Kennzeichnung',url:'https://www.baua.de/DE/Angebote/Regelwerk/ASR/ASR-A1-3'},
    {level:'Technische Regel',source:'ASR V3a.2',reference:'Barrierefreie Gestaltung',purpose:'Belange von Beschäftigten mit Behinderungen',url:'https://www.baua.de/DE/Angebote/Regelwerk/ASR/ASR-V3a-2'},
    {level:'Norm',source:'DIN 14096:2014-05',reference:'Brandschutzordnung',purpose:'Gliederung, Erstellung, Aushang und regelmäßige Prüfung',url:'https://www.dinmedia.de/de/norm/din-14096/199452736'},
    {level:'Norm',source:'DIN EN ISO 216',reference:'Papierformate',purpose:'Ausgabeformate',url:'https://www.dinmedia.de/'},
    {level:'Norm',source:'DIN EN ISO 7010 / ASR A1.3',reference:'Sicherheitszeichen',purpose:'Piktogramme in Teil A und ergänzenden Unterlagen',url:'https://www.bghm.de/arbeitsschuetzer/praxishilfen/sicherheitszeichen'},
    {level:'Gefahrstoffe',source:'Gefahrstoffverordnung',reference:'§§ 6, 8, 12 und 14',purpose:'Brand- und Explosionsgefährdungen, Schutzmaßnahmen und Unterweisung',url:'https://www.gesetze-im-internet.de/gefstoffv_2010/'},
    {level:'DGUV',source:'DGUV Information 205-001',reference:'Betrieblicher Brandschutz in der Praxis',purpose:'Umsetzungshilfe',url:'https://publikationen.dguv.de/regelwerk/dguv-informationen/324/'},
    {level:'DGUV',source:'DGUV Information 205-003',reference:'Brandschutzbeauftragte',purpose:'Aufgaben, Qualifikation und Organisation',url:'https://publikationen.dguv.de/regelwerk/dguv-informationen/3872/'},
    {level:'DGUV',source:'DGUV Information 205-023',reference:'Brandschutzhelfer',purpose:'Ausbildung und Befähigung',url:'https://publikationen.dguv.de/regelwerk/dguv-informationen/2848/'}
  ];

  const FEDERAL_STATES=['Baden-Württemberg','Bayern','Berlin','Brandenburg','Bremen','Hamburg','Hessen','Mecklenburg-Vorpommern','Niedersachsen','Nordrhein-Westfalen','Rheinland-Pfalz','Saarland','Sachsen','Sachsen-Anhalt','Schleswig-Holstein','Thüringen'];

  const DEFAULTS={
    schemaVersion:2,
    meta:{company:'',site:'',address:'',area:'',federalState:'Bayern',documentNo:'',version:'1.0',status:'Entwurf',validFrom:'',author:'',reviewer:'',approver:'',nextReview:'',changeNote:'Erstausgabe'},
    output:{A:true,B:true,C:true,language:'Deutsch',partAFormat:'A4',includeLogo:false},
    applicability:{requiredByPermit:false,requiredByConcept:false,requiredByAuthority:false,requiredByRiskAssessment:true,permitReference:'',conceptReference:'',authorityReference:'',stateBuildingLawChecked:false,specialBuildingRulesChecked:false,fireBrigadeRequirementsChecked:false,insurerRequirementsChecked:false,worksCouncilChecked:false,notes:''},
    scope:{people:'Beschäftigte, Fremdfirmen und Besucher',specialAreas:'',custom:'',shiftModel:'',maxPersons:'',visitorsPerDay:'',operatingHours:''},
    alarm:{emergencyNumber:'112',internalNumber:'',alarmMethod:'',alarmSignal:'',assemblyPoint:'',fireBrigadeMeetingPoint:'',fullCountMethod:'',fireDepartmentAccess:'',keyDepot:'',shutdownResponsible:'',liftRule:'Aufzüge im Brandfall nicht benutzen.',emergencyContacts:''},
    hazards:{visitors:false,mobility:false,children:false,overnight:false,hotWork:false,explosion:false,hazardousSubstances:false,pressureGases:false,ammonia:false,batteryCharging:false,highBay:false,fireAlarm:true,sprinkler:false,gasExtinguishing:false,smokeExtraction:false,criticalProcesses:false,environment:false,animals:false},
    partA:{prevent:'Feuer, offenes Licht und Rauchen nur in den dafür freigegebenen Bereichen.',report:'Brand über die betriebliche Alarmierung melden und Notruf absetzen.',rescue:'Gefährdete Personen warnen. Hilfsbedürftige Personen unterstützen. Gekennzeichnete Fluchtwege benutzen. Türen schließen.',extinguish:'Löschversuch nur ohne Eigengefährdung und mit gesichertem Rückzugsweg unternehmen.',extra:'Aufzüge nicht benutzen. Anweisungen der Einsatzleitung befolgen.'},
    partB:{},partC:{},
    roles:{fireOfficer:'',deputyFireOfficer:'',evacuationLead:'',deputyEvacuationLead:'',fireWardens:'',firstAid:'',technicalService:'',gate:'',environment:'',management:'',other:''},
    distribution:{targetGroups:'Alle Beschäftigten und regelmäßig anwesenden Personen',deliveryMethod:'Digital und in geeigneter Form zugänglich; erforderliche Exemplare in Papierform.',trainingMethod:'Unterweisung vor Tätigkeitsaufnahme bzw. bei Einführung und anschließend bedarfsbezogen wiederholen.',acknowledgement:true,languageNeeds:'',locationsPartA:'Eingangsbereiche, Verkehrswege, Pausenbereiche und weitere geeignete Stellen.',locationsBC:'Intranet / Dokumentenmanagement / zuständige Funktionen',distributionList:'',retention:'Freigegebene Version und Änderungsnachweise gemäß betrieblicher Dokumentenlenkung aufbewahren.'},
    release:{siteChecked:false,fireConceptChecked:false,rolesConfirmed:false,instructionsPlanned:false,symbolsChecked:false,professionalReview:false,authorityCoordination:false,approved:false}
  };

  PART_B.forEach(ch=>DEFAULTS.partB[ch.key]='');
  PART_C.forEach(ch=>DEFAULTS.partC[ch.key]='');

  function cloneDefaults(){return JSON.parse(JSON.stringify(DEFAULTS));}
  function isBlank(v){return v===null||v===undefined||String(v).trim()==='';}
  function parseDate(s){if(!s)return null;const d=new Date(`${s}T12:00:00`);return Number.isNaN(d.getTime())?null:d;}
  function monthsBetween(a,b){return (b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth();}
  function push(list,type,code,title,text,section){list.push({type,code,title,text,section});}
  function includesAny(text,words){const t=String(text||'').toLowerCase();return words.some(w=>t.includes(w));}
  function allText(d){return [d.partA.prevent,d.partA.report,d.partA.rescue,d.partA.extinguish,d.partA.extra,...Object.values(d.partB),...Object.values(d.partC),...Object.values(d.roles)].join(' ');}

  function validate(d){
    const r=[];
    const err=(ok,code,title,text,section)=>{if(!ok)push(r,'error',code,title,text,section);};
    const warn=(ok,code,title,text,section)=>{if(!ok)push(r,'warn',code,title,text,section);};
    const info=(ok,code,title,text,section)=>{if(!ok)push(r,'info',code,title,text,section);};
    const text=allText(d);

    err(!isBlank(d.meta.company),'META_COMPANY','Unternehmen fehlt','Unternehmen eindeutig angeben.','meta');
    err(!isBlank(d.meta.site),'META_SITE','Standort fehlt','Standort bzw. Objekt eindeutig angeben.','meta');
    err(!isBlank(d.meta.address),'META_ADDRESS','Objektanschrift fehlt','Vollständige Anschrift ergänzen.','meta');
    err(!isBlank(d.meta.area),'META_AREA','Geltungsbereich fehlt','Gebäude, Betriebsteil oder Bereich eindeutig abgrenzen.','meta');
    err(!isBlank(d.meta.documentNo),'META_DOCNO','Dokumentnummer fehlt','Eindeutige Dokumentnummer festlegen.','meta');
    err(!isBlank(d.meta.version),'META_VERSION','Versionsstand fehlt','Versionsstand für die Dokumentenlenkung angeben.','meta');
    err(!isBlank(d.meta.validFrom),'META_VALID','Gültigkeitsdatum fehlt','Gültig-ab-Datum festlegen.','meta');
    err(!isBlank(d.meta.author)&&!isBlank(d.meta.reviewer)&&!isBlank(d.meta.approver),'META_ROLES','Dokumentenrollen unvollständig','Ersteller, Prüfer und Freigeber benennen.','meta');
    warn(d.meta.author!==d.meta.reviewer&&d.meta.reviewer!==d.meta.approver,'META_SEPARATION','Funktionstrennung prüfen','Ersteller, Prüfer und Freigeber sollten bei formaler Dokumentenlenkung nachvollziehbar getrennt sein.','meta');

    const valid=parseDate(d.meta.validFrom), next=parseDate(d.meta.nextReview);
    err(!!next,'META_REVIEW_DATE','Prüftermin fehlt','Nächsten fachkundigen Prüftermin festlegen.','meta');
    if(valid&&next){
      err(next>valid,'META_REVIEW_ORDER','Prüftermin unplausibel','Nächste Prüfung muss nach dem Gültigkeitsdatum liegen.','meta');
      warn(monthsBetween(valid,next)<=24,'META_REVIEW_24','Prüfintervall länger als zwei Jahre','DIN 14096 nennt eine fachkundige Prüfung mindestens alle zwei Jahre. Kürzeren Termin festlegen.','meta');
    }

    err(d.output.A||d.output.B||d.output.C,'OUTPUT_NONE','Keine Ausgabe gewählt','Mindestens Teil A, B oder C auswählen.','meta');
    if(d.output.A) err(d.output.partAFormat==='A4','OUTPUT_A4','Teil A nicht im A4-Format','Teil A wird als einseitiger A4-Aushang ausgegeben.','partA');

    const applicabilitySet=d.applicability.requiredByPermit||d.applicability.requiredByConcept||d.applicability.requiredByAuthority||d.applicability.requiredByRiskAssessment;
    warn(applicabilitySet,'APP_TRIGGER','Anlass nicht dokumentiert','Baugenehmigung, Brandschutzkonzept, behördliche Auflage oder Gefährdungsbeurteilung als Anlass dokumentieren.','applicability');
    if(d.applicability.requiredByPermit) err(!isBlank(d.applicability.permitReference),'APP_PERMIT_REF','Baugenehmigungsauflage nicht referenziert','Aktenzeichen, Datum oder relevante Fundstelle eintragen.','applicability');
    if(d.applicability.requiredByConcept) err(!isBlank(d.applicability.conceptReference),'APP_CONCEPT_REF','Brandschutzkonzept nicht referenziert','Dokument, Version und Datum eintragen.','applicability');
    if(d.applicability.requiredByAuthority) err(!isBlank(d.applicability.authorityReference),'APP_AUTH_REF','Behördliche Forderung nicht referenziert','Behörde, Schreiben, Aktenzeichen und Datum eintragen.','applicability');
    warn(d.applicability.stateBuildingLawChecked,'APP_STATE_LAW','Landesbauordnung offen','Landesbauordnung des ausgewählten Bundeslands prüfen.','applicability');
    warn(d.applicability.specialBuildingRulesChecked,'APP_SPECIAL','Sonderbauvorschriften offen','Nutzungsabhängige Sonderbauvorschriften und Verordnungen prüfen.','applicability');
    info(d.applicability.fireBrigadeRequirementsChecked,'APP_FIRE_DEPT','Örtliche Feuerwehrvorgaben offen','Örtliche Anschlussbedingungen, Alarmplanung und Anforderungen der Brandschutzdienststelle prüfen.','applicability');

    err(!isBlank(d.scope.people),'SCOPE_PEOPLE','Personengruppen fehlen','Alle adressierten Personengruppen beschreiben.','scope');
    warn(!isBlank(d.scope.maxPersons),'SCOPE_MAX','Maximale Personenzahl fehlt','Höchstmögliche anwesende Personenzahl dokumentieren.','scope');
    warn(!isBlank(d.scope.operatingHours),'SCOPE_HOURS','Betriebszeiten fehlen','Betriebs-, Nacht- und Wochenendbetrieb dokumentieren.','scope');

    err(!isBlank(d.alarm.emergencyNumber),'ALARM_112','Notrufnummer fehlt','Notrufnummer für den Standort angeben.','scope');
    err(!isBlank(d.alarm.alarmMethod),'ALARM_METHOD','Meldeweg fehlt','Betriebliche Brandmeldung konkret beschreiben.','scope');
    err(!isBlank(d.alarm.alarmSignal),'ALARM_SIGNAL','Alarmsignal fehlt','Akustische, optische oder sprachliche Alarmierung konkret beschreiben.','scope');
    err(!isBlank(d.alarm.assemblyPoint),'ALARM_ASSEMBLY','Sammelstelle fehlt','Sammelstelle oder begründete objektspezifische Alternative angeben.','scope');
    warn(!isBlank(d.alarm.fullCountMethod),'ALARM_COUNT','Vollzähligkeitskontrolle fehlt','Verfahren für Rückmeldung und vermisste Personen festlegen.','scope');
    warn(!isBlank(d.alarm.fireBrigadeMeetingPoint),'ALARM_MEETING','Feuerwehr-Einweisungspunkt fehlt','Treffpunkt für die Einweisung der Feuerwehr festlegen.','scope');

    if(d.output.A){
      ['prevent','report','rescue','extinguish'].forEach(k=>err(!isBlank(d.partA[k]),`A_${k.toUpperCase()}`,`Teil A: ${k} fehlt`,'Kurze, objektspezifische Anweisung ergänzen.','partA'));
      warn((d.partA.prevent+d.partA.report+d.partA.rescue+d.partA.extinguish+d.partA.extra).length<=900,'A_LENGTH','Teil A ist zu umfangreich','Teil A muss schnell erfassbar und auf einer A4-Seite lesbar bleiben. Inhalte kürzen.','partA');
      warn(!isBlank(d.partA.extra),'A_EXTRA','Zusatzregel offen','Objektspezifische Festlegung, z. B. Aufzugsverbot oder Sonderalarm, ergänzen.','partA');
    }

    if(d.output.B){
      PART_B.forEach(ch=>err(!isBlank(d.partB[ch.key]),`B_${ch.key.toUpperCase()}`,`Teil B: ${ch.title}`,`Kapitel „${ch.title}“ objektspezifisch ausfüllen.`,'partB'));
    }
    if(d.output.C){
      PART_C.forEach(ch=>err(!isBlank(d.partC[ch.key]),`C_${ch.key.toUpperCase()}`,`Teil C: ${ch.title}`,`Kapitel „${ch.title}“ objektspezifisch ausfüllen.`,'partC'));
      err(!isBlank(d.roles.fireOfficer)||!isBlank(d.roles.evacuationLead),'C_RESP','Besondere Brandschutzfunktionen fehlen','Mindestens verantwortliche Funktion und Vertretung festlegen.','partC');
      warn(!isBlank(d.alarm.shutdownResponsible)||!isBlank(d.roles.technicalService),'C_SHUTDOWN','Technische Abschaltung ungeklärt','Zuständigkeit für betriebssichere Abschaltungen und deren Grenzen festlegen.','partC');
      warn(!isBlank(d.roles.gate)||!isBlank(d.alarm.fireBrigadeMeetingPoint),'C_GUIDE','Feuerwehreinweisung ungeklärt','Person/Funktion für Zugang und Einweisung benennen.','partC');
    }

    if(d.hazards.mobility) err(includesAny(text,['mobil','hilfsbedürftig','barriere','assistenz']),'HZ_MOBILITY','Räumung mobilitätseingeschränkter Personen fehlt','Assistenz, sichere Bereiche, Alarmwahrnehmung und Verantwortlichkeiten konkret festlegen.','scope');
    if(d.hazards.children) warn(includesAny(text,['kind','aufsicht','gruppe']),'HZ_CHILDREN','Kinder/Betreuung nicht konkretisiert','Aufsicht, Gruppenführung und Vollzähligkeitskontrolle festlegen.','scope');
    if(d.hazards.overnight) warn(includesAny(text,['nacht','schlaf','wecken']),'HZ_OVERNIGHT','Nachtbetrieb/Schlafnutzung nicht konkretisiert','Alarmierung und Räumung während Schlaf- oder Nachtzeiten festlegen.','scope');
    if(d.hazards.hotWork) err(includesAny(text,['heißarbeit','feuergefährlich','erlaubnisschein','brandwache']),'HZ_HOTWORK','Heißarbeiten nicht geregelt','Freigabe, Schutzmaßnahmen, Brandwache und Nachkontrolle festlegen.','partB');
    if(d.hazards.explosion) err(includesAny(text,['explosion','ex-bereich','zündquelle','explosionsschutz']),'HZ_EX','Explosionsgefährdung nicht geregelt','Explosionsschutzdokument, Zündquellenkontrolle, Alarmierung und Einsatzhinweise berücksichtigen.','partB');
    if(d.hazards.hazardousSubstances||d.hazards.pressureGases) err(includesAny(text,['gefahrstoff','druckgas','gasflasche','stoffliste','sicherheitsdatenblatt']),'HZ_SUBSTANCES','Gefahrstoffe/Druckgase nicht konkretisiert','Gefahren, Lagerorte, Löschmittel, Stoffinformationen und Feuerwehrinformationen festlegen.','partC');
    if(d.hazards.ammonia) err(includesAny(text,['ammoniak','nh3','kälteanlage','gasalarm']),'HZ_NH3','Ammoniak-Szenario fehlt','Gaswarnung, Räumungsrichtung, Absperrung, Fachpersonal und Feuerwehrinformation festlegen.','partC');
    if(d.hazards.batteryCharging) warn(includesAny(text,['batterie','ladebereich','wasserstoff']),'HZ_BATTERY','Batterieladebereich fehlt','Lüftung, Zündquellen, Freihaltung und geeignete Erstmaßnahmen beschreiben.','partB');
    if(d.hazards.highBay) warn(includesAny(text,['hochregal','regal','sprinklerabstand']),'HZ_HIGHBAY','Hochregallager nicht konkretisiert','Brandlasten, Lagergrenzen, Sprinklerfreiräume und Räumung berücksichtigen.','partB');
    if(d.hazards.fireAlarm) err(includesAny(text,['brandmelde','alarm','druckknopfmelder','sirene']),'HZ_BMA','Brandmeldeanlage nicht eingebunden','Auslösung, Alarmbild, interne Reaktion und Rückstellung nur durch Berechtigte festlegen.','partB');
    if(d.hazards.sprinkler) warn(includesAny(text,['sprinkler','löschanlage']),'HZ_SPRINKLER','Sprinkler-/Löschanlage nicht beschrieben','Betriebsbereitschaft, Abschaltungen, Alarmweiterleitung und Freigaben beschreiben.','partC');
    if(d.hazards.gasExtinguishing) err(includesAny(text,['gaslösch','voralarm','löschbereich','erstick']),'HZ_GAS_EXT','Gaslöschanlage nicht geregelt','Voralarm, sofortiges Verlassen, Zutrittsverbot und Wiederfreigabe festlegen.','partB');
    if(d.hazards.smokeExtraction) warn(includesAny(text,['rauchabzug','rwa','rauchwärme']),'HZ_RWA','Rauchabzug nicht geregelt','Bedienberechtigung, automatische Funktion und Feuerwehrbedienung festlegen.','partC');
    if(d.hazards.criticalProcesses) warn(includesAny(text,['kritisch','notabschaltung','kontrolliert abfahren']),'HZ_CRITICAL','Kritische Prozesse nicht geregelt','Nur sichere und vorab festgelegte Abschaltungen vorsehen; Räumung darf nicht verzögert werden.','partC');
    if(d.hazards.environment) warn(includesAny(text,['umwelt','löschwasser','kanal','rückhaltung']),'HZ_ENV','Umwelt-/Löschwasserschutz fehlt','Löschwasserrückhaltung, Kanalabsperrung und Umweltmeldung berücksichtigen.','partC');

    err(d.release.siteChecked,'REL_SITE','Örtliche Prüfung offen','Tatsächliche Gegebenheiten und Alarmierung vor Ort prüfen.','release');
    err(d.release.fireConceptChecked,'REL_CONCEPT','Brandschutzunterlagen nicht bestätigt','Brandschutzkonzept, Genehmigungsauflagen und Gefährdungsbeurteilung abgleichen.','release');
    err(d.release.rolesConfirmed,'REL_ROLES','Funktionen nicht bestätigt','Benannte Funktionen, Vertretungen und Erreichbarkeiten bestätigen.','release');
    err(d.release.instructionsPlanned,'REL_TRAINING','Bekanntgabe/Unterweisung offen','Verteilung, Unterweisung und Nachweisführung festlegen.','release');
    err(d.release.symbolsChecked,'REL_SYMBOLS','Sicherheitszeichen nicht geprüft','Verwendete Sicherheitszeichen mit ASR A1.3 und dem tatsächlichen Betrieb abgleichen.','release');
    err(d.release.professionalReview,'REL_PRO','Fachkundige Prüfung offen','Fachkundige Person muss Inhalt, Anwendbarkeit und Objektbezug prüfen.','release');
    if(d.release.approved) err(!r.some(x=>x.type==='error'),'REL_ERRORS','Freigabe trotz Pflichtabweichungen','Offene Pflichtabweichungen vor Freigabe schließen.','release');

    if(!r.length) push(r,'ok','OK','Plausibilitätsprüfung ohne offene Punkte','Alle regelbasierten Pflicht- und Plausibilitätsprüfungen sind erfüllt. Fachkundige und örtliche Prüfung bleibt maßgebend.','release');
    return r;
  }

  function score(d){
    const r=validate(d), errors=r.filter(x=>x.type==='error').length, warnings=r.filter(x=>x.type==='warn').length;
    return {errors,warnings,infos:r.filter(x=>x.type==='info').length,percent:Math.max(0,Math.min(100,100-errors*5-warnings*2))};
  }

  return {PART_B,PART_C,LEGAL_BASIS,FEDERAL_STATES,DEFAULTS,cloneDefaults,validate,score};
});
