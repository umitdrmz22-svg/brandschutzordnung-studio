'use strict';
window.BSO_APP=(()=>{
  const R=window.BSO;
  const A={R,data:R.cloneDefaults(),previewPart:'A',lastResults:[]};
  A.$=s=>document.querySelector(s);
  A.$$=s=>[...document.querySelectorAll(s)];
  A.esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  A.nl=(s='')=>A.esc(s).replace(/\n/g,'<br>');
  A.get=path=>path.split('.').reduce((o,k)=>o?.[k],A.data);
  A.set=(path,value)=>{const p=path.split('.');let o=A.data;while(p.length>1){const k=p.shift();o[k]??={};o=o[k];}o[p[0]]=value;};
  A.today=()=>new Date().toISOString().slice(0,10);
  A.plusMonths=(dateString,months)=>{const d=new Date(`${dateString}T12:00:00`);d.setMonth(d.getMonth()+months);return d.toISOString().slice(0,10);};
  A.deepMerge=(target,source)=>{for(const [k,v] of Object.entries(source||{})){if(v&&typeof v==='object'&&!Array.isArray(v)){target[k]??={};A.deepMerge(target[k],v);}else target[k]=v;}return target;};
  A.mergeProject=project=>{A.data=A.deepMerge(R.cloneDefaults(),project||{});};
  A.saveLocal=()=>{try{localStorage.setItem('bso-studio-project',JSON.stringify(A.data));}catch(e){console.warn('Lokale Speicherung nicht möglich',e);}};
  A.loadLocal=()=>{const raw=localStorage.getItem('bso-studio-project');if(raw)try{A.mergeProject(JSON.parse(raw));}catch(e){console.warn('Lokales Projekt konnte nicht gelesen werden',e);}};
  A.downloadProject=()=>{const blob=new Blob([JSON.stringify(A.data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${(A.data.meta.documentNo||'brandschutzordnung').replace(/[^a-z0-9_-]+/gi,'_')}.bso.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
  A.hazardLabels={
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
  return A;
})();
