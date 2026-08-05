'use strict';
const fs=require('fs');
const assert=require('assert');

const js=fs.readFileSync('part-a-v2.js','utf8');
const css=fs.readFileSync('part-a-v2.css','utf8');

for(const token of ['P002','P003','F005','F006','E001','E007','F001']){
  assert(js.includes(token),`Sicherheitszeichen ${token} fehlt`);
}
for(const heading of ['Brände verhüten','Verhalten im Brandfall','Ruhe bewahren','Brand melden','In Sicherheit bringen','Löschversuch']){
  assert(js.includes(heading),`Pflichtüberschrift ${heading} fehlt`);
}
assert(css.includes('width:210mm'), 'A4-Breite fehlt');
assert(css.includes('height:297mm'), 'A4-Höhe fehlt');
assert(css.includes('border:10mm solid'), '10-mm-Rahmen fehlt');
assert(css.includes('@page{size:A4 portrait;margin:0}'), 'A4-Druckregel fehlt');
assert(js.includes('symbol-draft-watermark'), 'Altes Entwurfs-Wasserzeichen wird nicht bereinigt');
assert(js.includes('ASR A1.3 / DIN EN ISO 7010'), 'Fachlicher Zeichenhinweis fehlt');

console.log('Teil-A-Layoutprüfungen erfolgreich.');
