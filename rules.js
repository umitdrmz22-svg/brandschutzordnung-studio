window.BSO_RULES = {
  partB: [
    ['brandverhuetung','Brandverhütung','Rauch- und Feuerverbote, Ordnung und Sauberkeit, sichere Lagerung sowie der Umgang mit Zündquellen.'],
    ['brandRauch','Brand- und Rauchausbreitung','Brandschutz- und Rauchschutztüren geschlossen halten; Öffnungen und Abschottungen nicht beeinträchtigen.'],
    ['fluchtwege','Flucht- und Rettungswege','Fluchtwege, Notausgänge und Feuerwehrzufahrten jederzeit freihalten.'],
    ['meldeLoesch','Melde- und Löscheinrichtungen','Standorte, Kennzeichnung, Zugänglichkeit und grundlegende Bedienung betrieblicher Einrichtungen.'],
    ['verhaltenBrand','Verhalten im Brandfall','Ruhe bewahren, Brand melden, gefährdete Personen warnen, Bereich verlassen und Anweisungen beachten.'],
    ['brandMelden','Brand melden','Notruf 112; Wer meldet? Was ist passiert? Wo? Wie viele Betroffene? Warten auf Rückfragen.'],
    ['alarmsignale','Alarmsignale und Anweisungen','Betriebliche Alarmzeichen, Lautsprecherdurchsagen und Weisungen der Einsatzleitung beachten.'],
    ['sicherheit','In Sicherheit bringen','Hilfsbedürftige unterstützen, Türen schließen, keine Aufzüge benutzen, Sammelstelle aufsuchen.'],
    ['loeschversuch','Löschversuche unternehmen','Nur ohne Eigengefährdung, Rückzugsweg sichern und geeignete Löschmittel einsetzen.'],
    ['besondereRegeln','Besondere Verhaltensregeln','Betriebs- und bereichsspezifische Ergänzungen, z. B. Gefahrstoffe, Energieabschaltung oder Hygienezonen.']
  ],
  partC: [
    ['alarmierung','Alarmierung und Information','Interne Alarmierung auslösen, Feuerwehr verständigen und betriebliche Stellen informieren.'],
    ['sicherheitsmassnahmen','Sicherheitsmaßnahmen','Gefährdete Anlagen sichern, Energiezufuhr unterbrechen und besondere Gefahren berücksichtigen.'],
    ['raeumung','Räumung vorbereiten und durchführen','Räumungsbereiche kontrollieren, hilfsbedürftige Personen unterstützen und Sammelstellenmeldung organisieren.'],
    ['brandbekaempfung','Brandbekämpfung','Betriebliche Löschmaßnahmen koordinieren, ohne Einsatzkräfte oder Beschäftigte zu gefährden.'],
    ['feuerwehr','Feuerwehr einweisen','Zufahrt sichern, Schlüssel und Informationen bereitstellen sowie Gefahren und Anlagentechnik erläutern.'],
    ['nachsorge','Nachsorge und Wiederinbetriebnahme','Absperrung, Brandwache, Ereignisdokumentation und Freigabe zur Wiederaufnahme des Betriebs organisieren.']
  ]
};
window.runBSOCheck = function(d){
  const r=[];
  const req=(ok,title,text)=>{if(!ok)r.push({type:'error',title,text})};
  req(d.meta.company,'Unternehmen fehlt','Unternehmen in den Grunddaten ergänzen.');
  req(d.meta.site,'Standort fehlt','Standort bzw. Objekt eindeutig benennen.');
  req(d.meta.documentNo,'Dokumentnummer fehlt','Eine eindeutige Dokumentnummer festlegen.');
  req(d.meta.version,'Versionsstand fehlt','Versionsstand für die Dokumentenlenkung angeben.');
  req(d.meta.author && d.meta.reviewer && d.meta.approver,'Rollen unvollständig','Ersteller, Prüfer und Freigeber vollständig benennen.');
  req(d.partA.emergencyNumber,'Notruf fehlt','Notrufnummer in Teil A angeben.');
  req(d.partA.assemblyPoint,'Sammelstelle fehlt','Sammelstelle oder objektspezifische Alternative angeben.');
  for(const [k,t] of window.BSO_RULES.partB) req(d.partB[k] && d.partB[k].trim(),`Teil B: ${t}`,`Kapitel „${t}“ objektspezifisch ausfüllen.`);
  for(const [k,t] of window.BSO_RULES.partC) req(d.partC[k] && d.partC[k].trim(),`Teil C: ${t}`,`Kapitel „${t}“ objektspezifisch ausfüllen.`);
  req(d.release.siteChecked,'Örtliche Prüfung offen','Örtliche Gegebenheiten und Alarmierung vor Freigabe prüfen.');
  req(d.release.professionalReview,'Fachkundige Prüfung offen','Die fachkundige Prüfung muss vor Freigabe bestätigt werden.');
  if(d.hazards.mobility && !/hilfs|mobil|eingeschränkt/i.test((d.partB.sicherheit||'')+(d.partC.raeumung||''))) r.push({type:'warn',title:'Mobilität berücksichtigen',text:'Unterstützung und Räumung von Personen mit eingeschränkter Mobilität konkret festlegen.'});
  if(d.hazards.hazardousSubstances && !/gefahrstoff|gas|druck/i.test((d.partB.besondereRegeln||'')+(d.partC.sicherheitsmassnahmen||''))) r.push({type:'warn',title:'Gefahrstoffe konkretisieren',text:'Besondere Gefahren, Abschaltungen und Informationen für die Feuerwehr ergänzen.'});
  if(d.hazards.fireAlarm && !d.partA.alarm) r.push({type:'warn',title:'Alarmierung beschreiben',text:'Brandmeldeanlage und wahrnehmbare Alarmzeichen in Teil A/B beschreiben.'});
  if(!r.length) r.push({type:'ok',title:'Plausibilitätsprüfung ohne offene Pflichtpunkte',text:'Die eingegebenen Daten sind vollständig. Fachkundige und örtliche Prüfung bleibt erforderlich.'});
  return r;
};