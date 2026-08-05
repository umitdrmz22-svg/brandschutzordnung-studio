const defaults={meta:{company:'',site:'',area:'',documentNo:'',version:'1.0',validFrom:'',author:'',reviewer:'',approver:'',nextReview:''},scope:{people:'Beschäftigte, Fremdfirmen und Besucher',specialAreas:'',custom:''},hazards:{visitors:false,mobility:false,hotWork:false,explosion:false,hazardousSubstances:false,fireAlarm:true,sprinkler:false,evacuationHelpers:true},partA:{internalNumber:'',emergencyNumber:'112',assemblyPoint:'',alarm:'',extra:'Aufzüge nicht benutzen. Anweisungen der Einsatzleitung befolgen.'},partB:{},partC:{fireOfficer:'',evacuationLead:'',shutdown:'',fireBrigadeGuide:''},release:{siteChecked:false,fireConceptChecked:false,rolesConfirmed:false,instructionsPlanned:false,professionalReview:false,changeNote:'Erstausgabe'}};
for(const [k,,v] of BSO_RULES.partB) defaults.partB[k]=v;
for(const [k,,v] of BSO_RULES.partC) defaults.partC[k]=v;
let data=structuredClone(defaults);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function get(path){return path.split('.').reduce((o,k)=>o?.[k],data)}
function set(path,val){const p=path.split('.');let o=data;while(p.length>1)o=o[p.shift()];o[p[0]]=val}
function buildChapters(){
  $('#partBFields').innerHTML=BSO_RULES.partB.map(([k,t])=>`<div class="chapter"><h3>${t}</h3><textarea rows="4" data-path="partB.${k}"></textarea></div>`).join('');
  $('#partCFields').innerHTML=BSO_RULES.partC.map(([k,t])=>`<div class="chapter"><h3>${t}</h3><textarea rows="4" data-path="partC.${k}"></textarea></div>`).join('');
}
function bind(){
  $$('[data-path]').forEach(el=>{const v=get(el.dataset.path);if(el.type==='checkbox')el.checked=!!v;else el.value=v??'';el.addEventListener('input',()=>{set(el.dataset.path,el.type==='checkbox'?el.checked:el.value);render();saveLocal();});});
}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function meta(){return `${esc(data.meta.company||'Unternehmen')} · ${esc(data.meta.site||'Standort')} · Dok.-Nr. ${esc(data.meta.documentNo||'–')} · Version ${esc(data.meta.version||'–')}`}
function header(title){return `<header class="doc-head"><h1>${title}</h1><div class="doc-meta">${meta()}</div></header>`}
function renderA(){return `${header('BRANDSCHUTZORDNUNG – TEIL A')}<div class="a-grid">
<div class="a-row"><div class="a-icon">🔥</div><div class="a-text"><b>Brände verhüten</b>Rauch- und Feuerverbote beachten.</div></div>
<div class="a-row"><div class="a-icon">☎</div><div class="a-text"><b>Brand melden</b>Notruf ${esc(data.partA.emergencyNumber)}${data.partA.internalNumber?` · intern ${esc(data.partA.internalNumber)}`:''}<br>${esc(data.partA.alarm)}</div></div>
<div class="a-row"><div class="a-icon">↗</div><div class="a-text"><b>In Sicherheit bringen</b>Gefährdete Personen warnen. Türen schließen. Aufzüge nicht benutzen.<br>Sammelstelle: ${esc(data.partA.assemblyPoint||'–')}</div></div>
<div class="a-row"><div class="a-icon">🧯</div><div class="a-text"><b>Löschversuch unternehmen</b>Nur ohne Eigengefährdung und mit gesichertem Rückzugsweg.</div></div>
<div class="a-row"><div class="a-icon">!</div><div class="a-text"><b>Zusätzliche Festlegung</b>${esc(data.partA.extra)}</div></div></div>`}
function renderLong(type){const rules=type==='B'?BSO_RULES.partB:BSO_RULES.partC;let h=header(`BRANDSCHUTZORDNUNG – TEIL ${type}`);if(type==='C')h+=`<div class="doc-section"><h2>Verantwortlichkeiten</h2><p>Brandschutzbeauftragte/r: ${esc(data.partC.fireOfficer||'–')}\nRäumungsverantwortliche: ${esc(data.partC.evacuationLead||'–')}\nTechnische Abschaltung: ${esc(data.partC.shutdown||'–')}\nEinweisung Feuerwehr: ${esc(data.partC.fireBrigadeGuide||'–')}</p></div>`;h+=rules.map(([k,t])=>`<section class="doc-section"><h2>${t}</h2><p>${esc(data['part'+type][k])}</p></section>`).join('');h+=`<div class="signature"><div>Erstellt: ${esc(data.meta.author)}</div><div>Geprüft: ${esc(data.meta.reviewer)}</div><div>Freigegeben: ${esc(data.meta.approver)}</div></div>`;return h}
function render(){const t=$('#previewSelect').value;$('#preview').className=`document part-${t.toLowerCase()}`;$('#preview').innerHTML=t==='A'?renderA():renderLong(t);updateProgress()}
function updateProgress(){const blocks=[data.meta.company&&data.meta.site&&data.meta.documentNo,data.scope.people,data.partA.emergencyNumber&&data.partA.assemblyPoint,BSO_RULES.partB.every(([k])=>data.partB[k]?.trim()),BSO_RULES.partC.every(([k])=>data.partC[k]?.trim()),data.meta.author&&data.meta.reviewer&&data.meta.approver,data.release.siteChecked&&data.release.professionalReview];const n=blocks.filter(Boolean).length,p=Math.round(n/blocks.length*100);$('#progressLabel').textContent=`${p} % vollständig`;$('#progressCount').textContent=`${n}/7`;$('#progressBar').style.width=p+'%'}
function showSection(id){$$('.panel').forEach(x=>x.classList.toggle('active',x.id===id));$$('#steps button').forEach(x=>x.classList.toggle('active',x.dataset.section===id))}
function check(){const list=runBSOCheck(data);$('#results').className='results';$('#results').innerHTML=list.map(x=>`<div class="result ${x.type}"><b>${esc(x.title)}</b><span>${esc(x.text)}</span></div>`).join('');showSection('check')}
function saveLocal(){localStorage.setItem('bso-project',JSON.stringify(data))}
function hydrate(){const x=localStorage.getItem('bso-project');if(x)try{data={...structuredClone(defaults),...JSON.parse(x)}catch{}}
function rebind(){buildChapters();bind();render()}
function download(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${data.meta.documentNo||'brandschutzordnung'}.bso.json`;a.click();URL.revokeObjectURL(a.href)}
hydrate();rebind();
$('#steps').addEventListener('click',e=>{const b=e.target.closest('button');if(b)showSection(b.dataset.section)});
$('#previewSelect').addEventListener('change',render);$('#printBtn').onclick=()=>window.print();$('#checkBtn').onclick=check;
$('#saveBtn').onclick=download;$('#newBtn').onclick=()=>{if(confirm('Alle Eingaben zurücksetzen?')){data=structuredClone(defaults);localStorage.removeItem('bso-project');rebind();showSection('meta')}};
$('#demoBtn').onclick=()=>{data=structuredClone(defaults);Object.assign(data.meta,{company:'Muster Lebensmittel GmbH',site:'Werk Musterstadt',area:'Produktion, Lager und Verwaltung',documentNo:'BSO-001',version:'1.0',validFrom:new Date().toISOString().slice(0,10),author:'EHS Manager',reviewer:'Brandschutzbeauftragter',approver:'Werkleitung'});Object.assign(data.partA,{internalNumber:'Leitwarte 222',assemblyPoint:'Besucherparkplatz Nord',alarm:'Brandmelder, Telefon oder interne Notrufstelle'});Object.assign(data.partC,{fireOfficer:'Max Mustermann · 0123 4567',evacuationLead:'Schichtleitung / Vertretung',shutdown:'Technischer Dienst',fireBrigadeGuide:'Pforte / Feuerwehrinformationspunkt'});Object.assign(data.release,{siteChecked:true,fireConceptChecked:true,rolesConfirmed:true,instructionsPlanned:true,professionalReview:true});rebind()};
$('#openFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{data={...structuredClone(defaults),...JSON.parse(await f.text())};rebind()}catch{alert('Projektdatei konnte nicht gelesen werden.')}});