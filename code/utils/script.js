let gnosis_elm;
let arcana_elm;
let base_elm;
let gnosis;
let arcana;
let pool;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    gnosis_elm = document.querySelector('#gnosis');
    arcana_elm = document.querySelector('#arcana');
    base_elm = document.querySelector('#base');

    gnosis_elm.addEventListener('change', calc_pool);
    arcana_elm.addEventListener('change', calc_pool);
}

function calc_pool(event){
    console.log('alteration');
    gnosis = Number(gnosis_elm.value);
    arcana = Number(arcana_elm.value);
    pool = gnosis + arcana;
    base_elm.innerText = pool;
}