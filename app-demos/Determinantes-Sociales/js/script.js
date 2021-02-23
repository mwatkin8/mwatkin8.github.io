function closeDemoModal(){
    let modal = d3.select('#demo-modal');
    modal.style('display','none');
    return false;
}
function closeExpModal(){
    let modal = d3.select('#explanation-modal');
    modal.style('display','none');
    return false;
}

function closeModal(type){
    let modal;
    if(type === 'q'){
        modal = d3.select('#q-modal');
    }
    else{
        modal = d3.select('#qr-modal');
    }
    modal.style('display','none');
    return false;
}

async function openModal(type){
    let modal,pre,r;
    if(type === 'q'){
        modal = d3.select('#q-modal');
        pre = d3.select('#q-modal-pre');
        r = await fetch('../socioeconomico/questionnaire.json');
    }
    else{
        modal = d3.select('#qr-modal');
        pre = d3.select('#qr-modal-pre');
        r = await fetch('../socioeconomico/questionnaireResponse.json');
    }
    let resource = await r.json();
    pre.html(JSON.stringify(resource,null,2));
    modal.style('display','block');
    return false;
}

async function clearSummary(){
    document.getElementById('vida').innerHTML = '';
    document.getElementById('financiera').innerHTML = '';
    document.getElementById('social_emocional').innerHTML = '';
    document.getElementById('seguridad').innerHTML = '';
    document.getElementById('miembros').innerHTML = '';
    s = null;
}

function findPatient(){
    document.getElementById('patient-search-result').style.visibility = 'visible';
}


let s;
async function loadSummary(){
    await clearSummary();
    s = {
        "historia": "",
        "diagnostico": "",
        "entrevistado": "",
        "cronica": [],
        "discapacidad": [],
        "miembros": [],
        "bienes": [],
        "vida":[],
        "financiera": [],
        "social_emocional": [],
        "seguridad": []
    };
    await getQRHistory();
    if(s.historia !== ''){
        document.getElementById('historia').innerHTML = "<li class=\"h6 mb-0 text-gray-800\">" + s.historia + "</li>"
    }
    if(s.entrevistado !== ''){
        document.getElementById('historia').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">Entrevistado(a): " + s.entrevistado + "</li>"
    }
    if(s.diagnostico !== ''){
        document.getElementById('historia').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">" + s.diagnostico + "</li>"
    }
    s.vida.forEach(li => {
        document.getElementById('vida').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">" + li + "</li>"
    });
    s.financiera.forEach(li => {
        document.getElementById('financiera').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">" + li + "</li>"
    });
    s.social_emocional.forEach(li => {
        document.getElementById('social_emocional').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">" + li + "</li>"
    });
    s.cronica.forEach(li => {
        document.getElementById('social_emocional').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">" + li + "</li>"
    });
    s.discapacidad.forEach(li => {
        document.getElementById('social_emocional').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">" + li + "</li>"
    });
    s.seguridad.forEach(li => {
        document.getElementById('seguridad').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">" + li + "</li>"
    });
    let bienes = '';
    s.bienes.forEach(g => {
        bienes += g + ', '
    });
    if(bienes !== ''){
        document.getElementById('financiera').innerHTML += "<li class=\"h6 mb-0 text-gray-800\">El (La) paciente posee los siguientes bienes: " + bienes.slice(0,-2) + "</li>"
    }
    for (let i = 0; i < s.miembros.length; i++){
        let m = s.miembros[i];
        d3.select('#miembro-card').style('visibility','visible');
        if(m.relation !== ''){
            document.getElementById('miembros').innerHTML += "<li style=\"list-style:none;\" class=\"h6 mb-0 text-gray-800 font-weight-bold\">" + m.relation + "</li>"
        }
        if(m.name !== ''){
            document.getElementById('miembros').innerHTML += "<li style=\"list-style:none;\" class=\"h6 mb-0 text-gray-800\">" + m.name + "</li>"
        }
        if(m.age !== ''){
            document.getElementById('miembros').innerHTML += "<li style=\"list-style:none;\" class=\"h6 mb-0 text-gray-800\">" + m.age + " años</li>"
        }
        if(m.dni !== ''){
            document.getElementById('miembros').innerHTML += "<li style=\"list-style:none;\" class=\"h6 mb-0 text-gray-800\">DNI: " + m.dni + "</li>"
        }
        if(m.insurance !== ''){
            document.getElementById('miembros').innerHTML += "<li style=\"list-style:none;\" class=\"h6 mb-0 text-gray-800\">Seguro: " + m.insurance + "</li>"
        }
        if(m.marriage !== ''){
            document.getElementById('miembros').innerHTML += "<li style=\"list-style:none;\" class=\"h6 mb-0 text-gray-800\">Estado Civil: " + m.marriage + "</li>"
        }
        if(m.gender !== ''){
            document.getElementById('miembros').innerHTML += "<li style=\"list-style:none;\" class=\"h6 mb-0 text-gray-800\">Identidad de Género: " + m.dni + "</li>"
        }
        if(i !== s.miembros.length - 1){
            document.getElementById('miembros').innerHTML += "<hr />"
        }
    }
}

async function getQRHistory(){
    let r = await fetch('../socioeconomico/questionnaireResponse.json');
    let qr = await r.json();
    if(qr.hasOwnProperty('meta')){
        s.historia = 'Ultima actualización en: ' + qr.meta.lastUpdated;
    }
    r = await fetch('../socioeconomico/descriptions.json');
    let d = await r.json();
    let descriptions = d.compose.include[0].concept;
    qr.item.forEach(item => {
        if(item.linkId === '/3.0.0.0'){
            addMiembro(item)
        }
        else{
            findDescription(item, descriptions);
        }
    })
}

function addMiembro(miembro){
    let m = {
        "name": "",
        "age": "",
        "dni": "",
        "insurance": "",
        "marriage": "",
        "gender": "",
        "relation": ""
    };
    miembro.item.forEach(item => {
        if(item.linkId === "/3.0.0.0/45392-8"){
            m.name = item.answer[0].valueString
        }
        else if(item.linkId === "/3.0.0.0/45394-4"){
            m.name += ' ' + item.answer[0].valueString
        }
        else if(item.linkId === "/3.0.0.0/30525-0"){
            m.age = item.answer[0].valueInteger
        }
        else if(item.linkId === "/3.0.0.0/1.1.0.0"){
            m.dni = item.answer[0].valueString
        }
        else if(item.linkId === "/3.0.0.0/1.3.0.0"){
            m.insurance = item.answer[0].valueCoding.display
        }
        else if(item.linkId === "/3.0.0.0/LL3271-5"){
            m.marriage = item.answer[0].valueCoding.display
        }
        else if(item.linkId === "/3.0.0.0/76691-5"){
            m.gender = item.answer[0].valueCoding.display
        }
        else if(item.linkId === "/3.0.0.0/3.1.0.0"){
            m.relation = item.answer[0].valueString
        }
    });
    s.miembros.push(m)
}

function addCronica(item){
    let display = '';
    item.forEach(item => {
        if(item.linkId === '/7.0.0.0/7.1.0.0/7.1.1.0/2.1.0.0'){
            display = item.answer[0].valueString + ' del paciente '
        }
        if(item.linkId === '/7.0.0.0/7.1.0.0/7.1.1.0/7.1.1.1'){
            if(item.answer[0].hasOwnProperty('valueCoding')){
                display += 'tienes ' + item.answer[0].valueCoding.display
            }
            else{
                display += 'tienes ' + item.answer[0].valueString
            }
        }
    });
    s.cronica.push(display)
}

function addDiscapacidad(item){
    let display = '';
    item.forEach(item => {
        if(item.linkId === '/7.0.0.0/7.1.0.0/7.1.2.0/2.1.0.0'){
            display = item.answer[0].valueString + ' del paciente '
        }
        if(item.linkId === '/7.0.0.0/7.1.0.0/7.1.2.0/7.1.2.1'){
            display += 'tienes la siguiente discapacidad: ' + item.answer[0].valueString
        }
    });
    s.discapacidad.push(display)
}

function findDescription(item, descriptions){
    if(item.linkId === '/7.0.0.0/7.1.0.0/7.1.1.0'){
        item.answer.forEach(answer => {
            addCronica(answer.item)
        });
    }
    else if(item.linkId === '/7.0.0.0/7.1.0.0/7.1.2.0'){
        item.answer.forEach(answer => {
            addDiscapacidad(answer.item)
        });
    }
    else if(item.hasOwnProperty('item')){
        item.item.forEach(sub => {
            findDescription(sub, descriptions);
        });
    }
    else{
        let linkId = item.linkId
        if(linkId.split('/')[1] === '9.0.0.0'){
            s.diagnostico = 'Diagnostico Social: ' + item.answer[0].valueString
        }
        else if(linkId.split('/')[1] === '8.0.0.0'){
            s.seguridad.push(item.text)
        }
        else if(linkId === '/2.0.0.0/2.1.0.0'){
            s.entrevistado += item.answer[0].valueString + ' del paciente, '
        }
        else if(linkId === '/2.0.0.0/45392-8' || linkId === '/2.0.0.0/74548-9'){
            s.entrevistado += item.answer[0].valueString
        }
        else if(linkId === '/2.0.0.0/45394-4'){
            s.entrevistado += ' ' + item.answer[0].valueString + ', '
        }
        else if(linkId === '/2.0.0.0/56799-0' || linkId === '/2.0.0.0/2.2.0.0' || linkId === '/2.0.0.0/2.3.0.0' || linkId === '/2.0.0.0/2.4.0.0'){
            s.entrevistado += item.answer[0].valueString + ', '
        }
        else if(linkId === '/6.0.0.0/6.3.0.0/6.3.1.0' || linkId === '/6.0.0.0/6.3.0.0/6.3.2.0' || linkId === '/6.0.0.0/6.3.0.0/6.3.3.0' || linkId === '/6.0.0.0/6.3.0.0/6.3.4.0' || linkId === '/6.0.0.0/6.3.0.0/6.3.5.0' || linkId === '/6.0.0.0/6.3.0.0/6.3.6.0' || linkId === '/6.0.0.0/6.3.0.0/6.3.7.0' || linkId === '/6.0.0.0/6.3.0.0/6.3.8.0'){
            s.bienes.push(item.text)
        }
        else if(linkId === '/6.0.0.0/6.3.0.0/1.3.1.0'){
            s.financiera.push('El (La) paciente no tiene ningún artículo doméstico común, como teléfono o refrigeradora')
        }
        else if(linkId === '/5.0.0.0/5.5.0.0'){
            s.vida.push('El paciente no tiene un lugar exclusivo para cocinar')
        }

        else{
            for (let i = 0; i < descriptions.length; i++){
                if(descriptions[i].code === linkId){
                    let answer;
                    if(item.answer[0].hasOwnProperty('valueCoding')){
                        answer = item.answer[0].valueCoding.display;
                    }
                    if(item.answer[0].hasOwnProperty('valueString')){
                        answer = item.answer[0].valueString;
                    }
                    if(item.answer[0].hasOwnProperty('valueInteger')){
                        answer = item.answer[0].valueInteger;
                    }
                    s[descriptions[i].designation.value].push(descriptions[i].display + answer)
                }
            }
        }
    }
}
