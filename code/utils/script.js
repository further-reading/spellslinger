let gnosis_elm;
let arcana_elm;
let level_elm;

let base_duration = [
    '1 turn',
    '2 turns',
    '3 turns',
    '5 turns',
    '10 turns'
]
let base_scale = [
    '1 subject/Largest Size 5/Arm\'s reach',
    '2 subjects/Largest Size 6/A small room',
    '4 subjects/Largest Size 7/A large room',
    '8 Subjects/Largest Size 8/Several rooms or a single floor of a house',
    '16 subjects/Largest Size 9/Ballroom or small house'
]

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    gnosis_elm = document.querySelector('#gnosis');
    arcana_elm = document.querySelector('#arcana');
    level_elm = document.querySelector('#level');

    document.querySelectorAll('.factor').forEach(
        item => {item.addEventListener('change', update_factors);}
        )

    document.querySelectorAll('.pool, .bonus, .penalty').forEach(
        item => {item.addEventListener('change', calc_pool);}
    )
    update_factors()
    calc_pool()

}

function calc_pool(event){
    let gnosis = Number(gnosis_elm.value);
    let arcana = Number(arcana_elm.value);
    let pool = gnosis + arcana;
    document.querySelectorAll('.base').forEach(item => {item.innerText=pool})

    let penalties = 0
    for (let item of document.querySelectorAll('.penalty')){
        if (item.value){
            penalties += Number(item.value)
        }
    }
    document.querySelectorAll('.total.penalty').forEach(item => {item.innerText=penalties})

    let bonuses = 0
    for (let item of document.querySelectorAll('.bonus')){
        if (item.value){
            bonuses += Number(item.value)
        }
    }
    document.querySelectorAll('.total.bonus').forEach(item => {item.innerText=bonuses})
    let total = pool + bonuses - penalties
    if (total <= 0){
        total = 'CHANCE'
    }
    let total_elm = document.querySelector('#total')
    total_elm.innerText = total
}

function update_factors(event){
    let pfactor = document.querySelector('#pfactor').value
    let arcana = Number(arcana_elm.value)

    // scale
    let scale = base_scale
    if (document.querySelector('#ascale').checked){
        console.log('NYI')
    }
    let start = 0
    if (pfactor === 'scale'){
        start = arcana - 1
    }
    let scale_select = document.querySelector('#scale')
    scale_select.innerHTML = ''
    for (let index = start; index < scale.length; index++){
        let value = index * 2
        let option = document.createElement('option')

        option.value = value.toString()
        option.innerText = scale[index]
        scale_select.appendChild(option)
    }

    // duration
    let duration = base_duration
    if (document.querySelector('#aduration').checked){
        console.log('NYI')
    }

    start = 0
    if (pfactor === 'duration'){
        start = arcana - 1
    }
    let duration_select = document.querySelector('#duration')
    duration_select.innerHTML = ''
    for (let index = start; index < duration.length; index++){
        let value = index * 2
        let option = document.createElement('option')

        option.value = value.toString()
        option.innerText = duration[index]
        duration_select.appendChild(option)
    }

    // potency
    let potency_select = document.querySelector('#potency')
    if (pfactor === 'potency'){
        potency_select.min = arcana
    }
    else{
        potency_select.min = 1
    }
    potency_select.value = potency_select.min
}