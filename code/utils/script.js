let gnosis_elm;
let arcana_elm;
let level_elm;
let potency_elm;
let add_yantra_button;

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
    'Indefinite (costs 1 Reach and 1 Mana)'
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
    add_yantra_button = document.querySelector('#add_yantra');

    document.querySelectorAll('input').forEach(
        item => {item.addEventListener('change', update);}
        )
    document.querySelectorAll('.no_submit').forEach(
        item => {item.addEventListener('submit', form_handler);}
        )
    add_yantra_button.onclick = add_yantra_clicked
    update()

}

function update(){
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
    // calc mana
    // calc reach

    let total = pool + bonuses - penalties
    if (total <= 0){
        total = 'CHANCE'
    }
    document.querySelector('#total').innerText = total
    document.querySelector('#total_paradox').innerText = calc_paradox()
    let yantras = 0
    for (let item of document.querySelectorAll('.yantra')){
        if (item.value){
            yantras += Number(item.value)
        }
    }
    document.querySelector('#total_yantras').innerText = yantras
}

function calc_penalties(arcana){
    let penalties = 0
    for (let item of document.querySelectorAll('.penalty')){
        if (item.value){
            penalties += Number(item.value)
        }
    }
    let potency = Number(potency_elm.value)
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

function calc_paradox(){
    let paradox
    let current_reach = calc_reach()
    let free_reach = Number(arcana_elm.value) - Number(level_elm.value) + 1
    if (current_reach > free_reach){
        paradox = current_reach - free_reach
    }
    else {
        return 0
    }

    paradox += Number(document.querySelector('#current_paradox').value)
    let multiplier = (Number(gnosis_elm.value) + Number(gnosis_elm.value) % 2) / 2

    paradox *= multiplier
    paradox -= document.querySelector('#mparadox').value
    if (paradox < 1) {
        paradox = "Chance"
    }
    return paradox.toString()


}

function calc_reach(){
    let reach = document.querySelectorAll('.reach:checked').length
    reach += document.querySelectorAll('.reach.additional').length

    let selected_duration = document.querySelector('#duration option:checked').value
    if (selected_duration === advanced_duration[advanced_duration.length -1 ]){
        // Indefinite duration requires an extra reach
        reach += 1
    }
    for (let row of document.querySelectorAll('.reach.additional')){
        reach += row.value
    }
    return reach
}

function add_yantra_clicked(){
    let warning = document.querySelector('.yantras.error');
    warning.innerHTML = ''
    let yantra_limit = 1 + ((Number(gnosis_elm.value) + Number(gnosis_elm.value) % 2) / 2);
    if (document.querySelectorAll('.yantra').length < yantra_limit){
        add_yantra_row()
    }
    else{
        warning.innerHTML = 'You have reached your yantra limit for your Gnosis.'
    }
}

function add_yantra_row(){
    let yantras_elm = document.querySelector('form.yantras');
    let last_yantra = document.querySelector('.yantra:last-child');
    let number = 0
    if (last_yantra){
        number = '\d+'.exec(last_yantra.id) + 1
    }
    let new_yantra_box = document.createElement('form');
    new_yantra_box.id = 'yantra_' + number.toString()


    let new_yantra_label = document.createElement('input');
    new_yantra_label.type = 'text'
    new_yantra_label.id = new_yantra_box.id + '_text'
    new_yantra_label.name = new_yantra_box.name + '_text'
    new_yantra_label.value = 'Enter Yantra Name'
    new_yantra_box.appendChild(new_yantra_label)

    let new_yantra_amount = document.createElement('input');
    new_yantra_amount.type = 'number'
    new_yantra_amount.className = 'yantra bonus'
    new_yantra_amount.id = new_yantra_box.id + '_amount'
    new_yantra_amount.name = new_yantra_box.id + '_amount'
    new_yantra_amount.min = '0'
    new_yantra_amount.value = '0'
    new_yantra_amount.addEventListener('change', update)

    new_yantra_box.appendChild(new_yantra_amount)

    let remove_button = document.createElement('button');
    remove_button.innerHTML = 'Remove'

    new_yantra_box.appendChild(remove_button)
    yantras_elm.appendChild(new_yantra_box)
    new_yantra_box.addEventListener('submit', remove_yantra)
}

function remove_yantra(event){
    let warning = document.querySelector('.yantras.error');
    warning.innerHTML = ''
    event.preventDefault();
    let selected = event.target
    selected.parentNode.removeChild(selected);
    update()
}

function form_handler(event){
    event.preventDefault();
}