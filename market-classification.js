(function(root){
  'use strict';
  const BSO=root.BSO;
  if(!BSO) throw new Error('market-classification.js benötigt market-review.js');
  const specialTypes=new Set(['Verkaufsstätte / Handel','Versammlungsstätte','Beherbergungsstätte','Schule / Hochschule','Kindertagesstätte / Betreuung','Krankenhaus / Pflege / Gesundheit']);
  BSO.DEFAULTS.object=BSO.DEFAULTS.object||{};
  BSO.DEFAULTS.object.specialBuildingBasis='';
  const previousValidate=BSO.validate;
  const blank=v=>v===null||v===undefined||String(v).trim()==='';
  BSO.validate=function validateBuildingClassification(d){
    const results=previousValidate(d).filter(x=>!['OBJ_SPECIAL_EXPECTED','OBJ_SPECIAL_OPEN'].includes(x.code));
    d.object=d.object||{};
    const status=d.object.specialBuildingStatus||'Prüfung offen';
    if(status==='Prüfung offen'||status==='Nicht abschließend bewertet'){
      results.push({
        type:specialTypes.has(d.meta?.objectType)?'error':'warn',code:'OBJ_SPECIAL_OPEN',title:'Sonderbauprüfung offen',
        text:'Prüfen und dokumentieren, ob landesrechtliche Sonderbauvorschriften oder besondere Anforderungen anwendbar sind. Schwellenwerte und Einordnung unterscheiden sich nach Bundesland und Objekt.',
        section:'applicability',perspective:'Regelwerk'
      });
    }else if(blank(d.object.specialBuildingBasis)){
      results.push({
        type:'error',code:'OBJ_SPECIAL_BASIS',title:'Begründung zum Sonderbaustatus fehlt',
        text:'Rechtsgrundlage, Schwellenwert, Genehmigungsunterlage oder fachliche Begründung der Einordnung dokumentieren.',
        section:'applicability',perspective:'Regelwerk'
      });
    }
    return results;
  };
  BSO.score=function scoreBuildingClassification(d){
    const r=BSO.validate(d),errors=r.filter(x=>x.type==='error').length,warnings=r.filter(x=>x.type==='warn').length,infos=r.filter(x=>x.type==='info').length;
    return {errors,warnings,infos,percent:Math.max(0,Math.min(100,100-errors*4-warnings*1.5))};
  };
  if(typeof module==='object'&&module.exports) module.exports=BSO;
})(typeof globalThis!=='undefined'?globalThis:this);
