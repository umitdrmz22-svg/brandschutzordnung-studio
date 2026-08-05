'use strict';
const assert=require('node:assert/strict');
global.BSO=require('../rules.js');
require('../market-review.js');
const BSO=global.BSO;

const codes=d=>new Set(BSO.validate(d).map(x=>x.code));

const fresh=BSO.cloneDefaults();
assert.equal(fresh.schemaVersion,3);
assert.equal(fresh.meta.federalState,'');
assert.equal(fresh.meta.objectType,'');
assert.ok(codes(fresh).has('OBJ_STATE'));
assert.ok(codes(fresh).has('OBJ_TYPE'));
assert.ok(codes(fresh).has('BSB_REQUIREMENT_OPEN'));

fresh.expertReview.fireOfficerRequirement='Erforderlich';
fresh.expertReview.fireOfficerBasis='Behördliche Auflage';
assert.ok(codes(fresh).has('BSB_REQUIRED'));
fresh.roles.fireOfficer='Bestellte Person';
assert.ok(!codes(fresh).has('BSB_REQUIRED'));

fresh.insurance.status='Risikobericht / Empfehlungen vorhanden';
assert.ok(codes(fresh).has('INS_REFERENCE'));
fresh.insurance.reference='Risikobericht 01/2026';
fresh.insurance.requirements='Außerbetriebnahmeverfahren und Heißarbeitenfreigabe';
assert.ok(!codes(fresh).has('INS_REFERENCE'));

fresh.object.businessInterruptionCriticality='Existenzkritisch';
assert.ok(codes(fresh).has('INS_BC'));
fresh.insurance.businessContinuityChecked=true;
assert.ok(!codes(fresh).has('INS_BC'));

fresh.meta.objectType='Versammlungsstätte';
fresh.object.specialBuildingStatus='Kein Sonderbau nach dokumentierter Prüfung';
assert.ok(codes(fresh).has('OBJ_SPECIAL_EXPECTED'));

const insurerFinding=BSO.validate(fresh).find(x=>x.code==='INS_COMPARTMENTS');
assert.equal(insurerFinding.perspective,'Sachschutz/Betriebsunterbrechung');
console.log('market-review tests passed');
