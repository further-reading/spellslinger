let gnosis_elm;
let arcana_elm;
let level_elm;
let potency_elm;

let base_duration = [
    '1 turn',
    '2 turns',
    '3 turns',
    '5 turns',
    '10 turns',
]

let advanced_duration = [
    'One scene/hour',
    'One Day',
    'One Week',
    'One Month',
    'One Year',
    'Indefinite (requires an additional Reach and 1 Mana)'
]

let base_scale = [
    '1 subject/Largest Size 5/Arm\'s reach',
    '2 subjects/Largest Size 6/A small room',
    '4 subjects/Largest Size 7/A large room',
    '8 Subjects/Largest Size 8/Several rooms or a single floor of a house',
    '16 subjects/Largest Size 9/Ballroom or small house'
]

let advanced_scale = [
    '5 subjects/Largest Size 5/A large house or building',
    '10 subjects/Largest Size 10/A small warehouse or parking lot',
    '20 subjects/Largest Size 15/A large warehouse or supermarket',
    '40 subjects/Largest Size 20/A small factor or shopping mall',
    '80 subjects/Largest Size 30/A campus or a small neighbourhood',
]

let cast_time = [
    '3 Hours',
    '3 Hours',
    '1 Hour',
    '1 Hour',
    '30 Minutes',
    '30 Minutes',
    '10 Minutes',
    '10 Minutes',
    '1 Minute/20 Turns',
    '1 Minute/20 Turns'
]

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    gnosis_elm = document.querySelector('#gnosis');
    arcana_elm = document.querySelector('#arcana');
    level_elm = document.querySelector('#level');
    potency_elm = document.querySelector('#potency');

    document.querySelectorAll('.factor').forEach(
        item => {item.addEventListener('change', update_factors);}
        )

    document.querySelectorAll('.pool, .bonus, .penalty').forEach(
        item => {item.addEventListener('change', calc_pool);}
    )
    potency_elm.addEventListener('change', calc_pool)
    update_factors()
    calc_pool()

}

function calc_pool(event){
    let gnosis = Number(gnosis_elm.value);
    let arcana = Number(arcana_elm.value);
    let pool = gnosis + arcana;
    document.querySelectorAll('.base').forEach(item => {item.innerText=pool})

    let penalties = calc_penalties(arcana)
    let bonuses = calc_bonuses()

    let total = pool + bonuses - penalties
    if (total <= 0){
        total = 'CHANCE'
    }
    let total_elm = document.querySelector('#total')
    total_elm.innerText = total
}

function calc_penalties(arcana){
    let penalties = 0
    for (let item of document.querySelectorAll('.penalty')){
        if (item.value){
            penalties += Number(item.value)
        }
    }
    let potency = Number(potency_elm.value)
    console.log(potency)
    if (document.querySelector('#pfactor').value === 'potency') {
        // min value of potency if primary factor
        potency -= arcana
    }
    // 1 potency costs 2 dice
    penalties += potency * 2
    document.querySelectorAll('.total.penalty').forEach(item => {item.innerText=penalties})
    return penalties
}

function calc_bonuses(){
    let bonuses = 0
    for (let item of document.querySelectorAll('.bonus')){
        if (item.value){
            bonuses += Number(item.value)
        }
    }
    document.querySelectorAll('.total.bonus').forEach(item => {item.innerText=bonuses})
    return bonuses
}
function update_factors(event){
    let pfactor = document.querySelector('#pfactor').value
    let arcana = Number(arcana_elm.value)

    update_potency_factor(pfactor, arcana)
    update_ctime_factor()
    update_range_factor()
    update_duration_factor(pfactor, arcana)
    update_scale_factor(pfactor, arcana)
}

function update_ctime_factor (){
    let content
    if (document.querySelector('#actime').checked){
        content = "Instant"
    }
    else{
        content = get_ritual_time()
    }
    document.querySelector('#cast_time').value = content
}

function update_range_factor (){
    let content
    if (document.querySelector('#arange').checked){
        content = "Sensory"
    }
    else{
        content = "Self/Touch"
    }
    document.querySelector('#range').value = content
}

function update_potency_factor (pfactor, arcana){
    let potency_select = document.querySelector('#potency')
    if (pfactor === 'potency'){
        potency_select.min = arcana
    }
    else{
        potency_select.min = 1
    }
    potency_select.value = potency_select.min
}

function update_duration_factor (pfactor, arcana){
    let duration = base_duration
    if (document.querySelector('#aduration').checked){
        duration = advanced_duration
    }

    let start = 0
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
}

function update_scale_factor(pfactor, arcana){
    // scale
    let scale = base_scale
    if (document.querySelector('#ascale').checked){
        scale = advanced_scale
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
}

function get_ritual_time(){
    let gnosis = Number(gnosis_elm.value)
    return cast_time[gnosis - 1]
}