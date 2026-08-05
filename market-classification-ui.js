'use strict';
(()=>{
  const A=window.BSO_APP,$=A.$;
  const status=$('[data-path="object.specialBuildingStatus"]');
  if(status&&!$('[data-path="object.specialBuildingBasis"]')){
    status.closest('label').insertAdjacentHTML('afterend','<label class="wide">Begründung Sonderbaustatus *<input data-path="object.specialBuildingBasis" placeholder="Landesrecht, Schwellenwert, Genehmigung, Brandschutzkonzept oder fachliche Einordnung"></label>');
  }
  const baseDemo=A.demo;
  A.demo=()=>{
    baseDemo();
    A.data.object.specialBuildingBasis='Prüfung anhand der landesrechtlichen Schwellenwerte und der genehmigten Nutzung dokumentiert.';
    A.refreshInputs();
    A.saveLocal();
  };
})();
