const assert=require('node:assert/strict');
const {cloneDefaults,validate,score}=require('../rules.js');

function codes(d){return validate(d).map(x=>x.code);}
const empty=cloneDefaults();
assert(codes(empty).includes('META_COMPANY'),'empty project must require company');
assert(codes(empty).includes('ALARM_METHOD'),'empty project must require alarm method');

const base=cloneDefaults();
Object.assign(base.meta,{company:'Test GmbH',site:'Werk 1',address:'Teststraße 1, 12345 Teststadt',area:'Gesamtwerk',documentNo:'BSO-1',version:'1.0',validFrom:'2026-01-01',nextReview:'2028-01-01',author:'A',reviewer:'B',approver:'C'});
Object.assign(base.scope,{maxPersons:'100',operatingHours:'Mo-Fr'});
Object.assign(base.alarm,{alarmMethod:'Druckknopfmelder',alarmSignal:'Sirene',assemblyPoint:'Nord',fullCountMethod:'Listen',fireBrigadeMeetingPoint:'Tor 1'});
Object.assign(base.applicability,{stateBuildingLawChecked:true,specialBuildingRulesChecked:true,fireBrigadeRequirementsChecked:true});
for(const k of Object.keys(base.partB)) base.partB[k]='Objektspezifische Regelung mit Alarm, Fluchtweg und Brandschutz.';
for(const k of Object.keys(base.partC)) base.partC[k]='Objektspezifische Regelung mit Alarm, Feuerwehr und Sicherheitsmaßnahmen.';
Object.assign(base.roles,{fireOfficer:'Brandschutzbeauftragte Person',technicalService:'Technik',gate:'Pforte'});
Object.assign(base.release,{siteChecked:true,fireConceptChecked:true,rolesConfirmed:true,instructionsPlanned:true,symbolsChecked:true,professionalReview:true});
assert(!codes(base).includes('META_REVIEW_24'),'exactly 24 months must be accepted');

const late=JSON.parse(JSON.stringify(base));late.meta.nextReview='2028-02-01';
assert(codes(late).includes('META_REVIEW_24'),'review later than 24 months must warn');

const hot=JSON.parse(JSON.stringify(base));hot.hazards.hotWork=true;hot.partB.brandverhuetung='Nur allgemeine Ordnung.';
assert(codes(hot).includes('HZ_HOTWORK'),'hot work must require permit wording');

const nh3=JSON.parse(JSON.stringify(base));nh3.hazards.ammonia=true;
assert(codes(nh3).includes('HZ_NH3'),'ammonia must require scenario wording');

const noB=JSON.parse(JSON.stringify(base));noB.output.B=false;for(const k of Object.keys(noB.partB))noB.partB[k]='';
assert(!codes(noB).some(c=>c.startsWith('B_')),'disabled part B must not be validated');

const approvedWithErrors=cloneDefaults();approvedWithErrors.release.approved=true;
assert(codes(approvedWithErrors).includes('REL_ERRORS'),'approval must be blocked while required errors remain');

const s=score(empty);assert(s.percent>=0&&s.percent<=100,'score must be bounded');
console.log('rules.test.js: all tests passed');
