function displayDemoModal(){
    let modal = d3.select('#demo-modal');
    modal.style('display','block');
}

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

async function resultInit(){
    let modal = d3.select('#explanation-modal');
    modal.style('display','block');
    drawTimeline();
    await resultPre();
}

async function fetchResource(type,id){
    let results = [];
    let r = await fetch('../resources/Bundle.json');
    let response = await r.json();
    if(id === ''){
        response.entry.forEach((entry, i) => {
            if(entry.resource.resourceType === type){
                results.push(entry.resource)
            }
        });
    }
    else{
        response.entry.forEach((entry, i) => {
            if(entry.resource.resourceType === type && entry.resource.id === id){
                results.push(entry.resource)
            }
        });
    }
    return results
}

async function resultPre(){
    let div = d3.select('#result-content');
    div.html('');
    d3.select('#nav-pre').classed('active',true);
    d3.select('#nav-summary').classed('active',false);
    d3.select('#nav-pdf').classed('active',false);
    d3.select('#nav-fhir').classed('active',false);
    let container = div.append('div').attr('class','container marketing');
    let row = container.append('div').attr('class','row featurette');
    let col = row.append('div').attr('class','col-md-7');
    let header = col.append('h2').attr('class','featurette-heading').text('Review ');
    header.append('span').attr('class','text-muted').text('the form below');
    col.append('p').attr('class','lead').text('The interpretation of newborn screening results can, in some cases, vary depending on the specific health history of the infant and mother.')
    col.append('p').attr('class','lead').html('The questions below may have prepopulated "<span style="stroke:green" data-feather="check-circle"></span>" answers drawn from existing clinical records. The  <button class="btn btn-sm btn-primary"><span data-feather="file-text"></span></button>  button is included only in this demo and can be clicked to view resources used in the CQL evaluation')
    col.append('p').attr('class','lead').html('<b><i>Please mark any additional relevant factors</b></i> that may not have been detected in existing clinical records, then press "Submit".')
    let img = row.append('div').attr('class','col-md-5');
    img.append('img').attr('class','featurette-image img-fluid mx-auto').attr('src','../img/icons/waiting.png').attr('alt','pre-results');
    div.append('div').html('<hr />')
    row = div.append('div').attr('class','row text-center');
    row.append('div').attr('id','infant-header').attr('class','col-md-6');
    row.append('div').attr('id','maternal-header').attr('class','col-md-6');
    row = div.append('div').attr('class','row');
    row.append('div').attr('id','infant-qbody').attr('class','col-md-6');
    row.append('div').attr('id','maternal-qbody').attr('class','col-md-6');
    await render('infant');
    await render('maternal');
    feather.replace()
    //Add spacing elements to improve form readability
    div.append('hr');
    //Add a submit button
    div = div.append('div').attr('class','text-center');
    div.append('button').attr('class','btn btn-lg btn-primary').attr('onclick',"generateResponse()").text('Submit')
}

async function render(type){
    let url,patient;
    //Query the questionnaires
    if (type === 'infant'){
        patient = 'patient-infant'
        url = '../resources/Questionnaires/infant-factors-form.json';
    }
    else{
        patient = 'patient-mother'
        url = '../resources/Questionnaires/maternal-factors-form.json';
    }
    let r = await fetch(url);
    let questionnaire = await r.json();
    //Add a header with the questionnaire title and publisher
    let header = d3.select('#' + type + '-header');
    let title = header.append('h2').text(questionnaire.title + ' ');
    //Add a button to allow the user to open the modal and view the raw Questionnaire JSON
    if(type === 'infant'){
        title.append('button').attr('class','btn btn-sm btn-primary').attr('onclick',"questionnaireModal(true,'infant')").text('FHIR');
        title.append('button').attr('class','btn btn-sm btn-primary ml-2').attr('onclick',"cqlModal('infant')").text('CQL');

    }else{
        title.append('button').attr('class','btn btn-sm btn-primary').attr('onclick',"questionnaireModal(true,'maternal')").text('FHIR');
        title.append('button').attr('class','btn btn-sm btn-primary ml-2').attr('onclick',"cqlModal('maternal')").text('CQL');
    }
    await buildForm(questionnaire,type)
}

async function buildForm(questionnaire,type){
    //Select thee HTML div created to hold the form body
    let qbody = d3.select('#' + type + '-qbody');
    //Loop through each item in the questionnaire
    questionnaire.item.forEach((item, i) => {
        if(item.type === 'group'){
            handleGroup(type,qbody,item);
        }
        else{
            qbody.append('hr');
            switch(item.type) {
                case 'date':
                    handleDate(type,qbody,item);
                    break;
                case 'choice':
                    handleChoice(type,qbody,item);
                    break;
                case 'boolean':
                    handleBoolean(type,qbody,item);
                    break;
                case 'text':
                    handleText(type,qbody,item);
                    break;
                default:
                    //Print other question types
                    console.log(item);
            }
        }

    });
}
/*
 A "Group" is a type of questionnaire question, it acts as a parent of sub-questions.
*/
function handleGroup(type,qbody,group){
    //Add spacing elements to improve form readability
    qbody.append('hr');
    qbody.append('h6').attr('class','mb-3').text(group.text);
    //For each question in the group, determine type and add it to the form
    group.item.forEach((question, i) => {
        if(i !== 0){
            qbody.append('br');
        }
        let select;
        switch(question.type) {
            case 'date':
                handleDate(type,qbody,question);
                break;
            case 'choice':
                handleChoice(type,qbody,question);
                break;
            case 'boolean':
                handleBoolean(type,qbody,question);
                break;
            case 'group':
                handleGroup(type,qbody,question);
                break;
            case 'text':
                handleText(type,qbody,question);
                break;
            default:
                //Print other question types
                console.log(question);
        }
    });
}

dict = {
    'Infant in NICU at time of specimen collection': 'nicu-encounter.json',
    'Preterm/Low birth weight (LBW)': 'lbw-condition.json',
    'Any blood product transfusion (including ECLS/ECMO)': 'transfusion-procedure.json',
    'Acute illness': 'hypothyroxinemia-condition.json',
    'Hypothyroxinemia of preterm birth': 'hypothyroxinemia-condition.json',
    'Significant hypoxia': 'hypoxia-condition.json',
    'The date of last blood product transfusion': ['transfusion-procedure.json','2020-08-18'],
    'HELLP syndrome': 'hellp-condition.json',
    'Packed red blood cell (PRBC) transfusion': 'prbc-procedure.json',
    'Steroid treatment': 'bethamethasone-medreq.json'
}

function handleText(type,qbody,question){
    let linkId = question.linkId.split('/').join('_');
    let label = qbody.append('label').attr('for', linkId).text(question.text + '  ');
    qbody.append('textarea').attr('class','form-control ' + type).attr('id',linkId).attr('rows','4').attr('cols','50');
}
function handleDate(type,qbody,question){
    let linkId = question.linkId.split('/').join('_');
    let label = qbody.append('label').attr('id','icon-col-' + linkId).attr('for', linkId).text(question.text + ' ');
    if(question.hasOwnProperty('extension')){
        let r = dict[question.extension[0].valueExpression.expression];
        if(r !== undefined){
            label.append('span').attr('data-feather','check-square').style('stroke','green');
            label.append('button').attr('class','btn btn-sm btn-primary ml-2').attr('onclick','viewCQLResult(\'' + r[0] + '\')').html('<span data-feather="file-text"></span>')
            let d = new Date(r[1]);
            let y = d.getFullYear();
            let m = (d.getMonth() + 1).toString();
            let day = d.getDate().toString();
            if(m.length === 1){
                m = '0' + m
            }
            if(day.length === 1){
                day = '0' + day
            }
            let date = y + "-" + m + "-" + day;
            qbody.append('input').attr('type','date').attr('class','form-control ' + type).attr('id',linkId).attr('value',date);
        }
        else{
            qbody.append('input').attr('type','date').attr('class','form-control ' + type).attr('id',linkId);
        }
    }
    else{
        qbody.append('input').attr('type','date').attr('class','form-control ' + type).attr('id',linkId);
    }
}
function handleChoice(type,qbody,question){
    let linkId = question.linkId.split('/').join('_');
    qbody.append('label').attr('id','icon-col-' + linkId).attr('for', linkId).text(question.text + ' ');
    select = qbody.append('select').attr('name',linkId).attr('id',linkId).attr('class','custom-select d-block w-100 ' + type);
    select.append('option').attr('id',linkId + 'def').attr('value','default').attr('selected','selected').text('Select...');
    question.answerOption.forEach((option, i) => {
        select.append('option').attr('id',option.valueCoding.code).attr('value',option.valueCoding.code).text(option.valueCoding.display);
    });
}

function handleBoolean(type,qbody,question){
    let linkId = question.linkId.split('/').join('_');
    let label = qbody.append('label').attr('for', linkId).html(question.text + ' ');
    //True option
    if(question.hasOwnProperty('extension')){
        let r = dict[question.extension[0].valueExpression.expression];
        if(r !== undefined){
            label.append('input').attr('class',type).attr('id',linkId).attr('name',linkId).attr('type','checkbox').attr('checked',true).style('margin-right','5px').lower();
            label.append('span').attr('data-feather','check-circle').style('stroke','green');
            label.append('button').attr('class','btn btn-sm btn-primary ml-2').attr('onclick','viewCQLResult(\'' + r + '\')').html('<span data-feather="file-text"></span>')
        }
        else{
            label.append('input').attr('class',type).attr('id',linkId).attr('name',linkId).attr('type','checkbox').style('margin-right','5px').lower();
        }
    }
    else{
        label.append('input').attr('class',type).attr('id',linkId).attr('name',linkId).attr('type','checkbox').style('margin-right','5px').lower();
    }
}

async function viewCQLResult(name){
    let response = await fetch('../resources/CQL-Data/' + name);
    let r = await response.json()
    let modal = d3.select('#cql-resource-modal');
    modal.style('display','block');
    d3.select('#cql-resource-json').text(JSON.stringify(r, null, 5));
}
function questionnaireResponseModal(r){
    let modal = d3.select('#questionnaire-response-modal');
    modal.style('display','block');
    d3.select('#questionnaire-response-json').text(JSON.stringify(r, null, 5));
}

async function questionnaireModal(q,type){
    let modal = d3.select('#questionnaire-modal');
    modal.style('display','block');
    let url,bundle,json,r;
    if(q){
        if(type === 'infant'){
            r = await fetch('../resources/Questionnaires/infant-factors-form.json');
        }
        else{
            r = await fetch('../resources/Questionnaires/maternal-factors-form.json');
        }
        json = await r.json()
    }
    else{
        console.log('show resource');
    }
    d3.select('#questionnaire-json').text(JSON.stringify(json, null, 5));
}

async function cqlModal(type){
    let modal = d3.select('#cql-modal');
    modal.style('display','block');
    let url,bundle,cql,r;
    //If the user clicks submit, then generate the QuestionnaireResponse and show that resource JSON in the modal
    if(type === 'infant'){
        r = await fetch('../resources/CQL/InfantFactors.cql');
    }
    else{
        r = await fetch('../resources/CQL/MaternalFactors.cql');
    }
    cql = await r.text()
    d3.select('#cql-json').text(cql);
}

async function generateResponse(){
    //Fetch the json template
    let response = await fetch('../resources/QResponse-Templates/infant-factors-form-response.json');
    let r = await response.json();
    let infant = d3.selectAll('.infant');
    infant._groups[0].forEach((q, i) => {
        let linkId = q.id.split('_').join('/');
        let l = linkId.split('/');
        let group = '';
        if(l.length  > 2){
            group = '/' + l[1];
        }
        buildAnswer(r,q,group,linkId)
    });
    questionnaireResponseModal(r);
}

async function buildAnswer(r,q,group,linkId){
    r.item.forEach((item, i) => {
        if(item.linkId === group){
            item.item.forEach((child, i) => {
                if(child.linkId === linkId){
                    if(child.answer[0].hasOwnProperty('valueCoding')){
                        let value = q.value;
                        if(q.value === 'default'){
                            value = 'LA137-2'
                        }
                        child.answer[0].valueCoding = {
                            "code": value,
                            "system": "http://loinc.org"
                        }
                    }
                    else if(child.answer[0].hasOwnProperty('valueBoolean')){
                        child.answer[0].valueBoolean = q.checked;
                    }
                    else if(child.answer[0].hasOwnProperty('valueDate')){
                        child.answer[0].valueDate = q.value
                    }
                    else if(child.answer[0].hasOwnProperty('valueString')){
                        child.answer[0].valueString = q.value
                    }
                    else{
                        console.log(item);
                    }
                }
            });
        }
        else{
            if(item.linkId === linkId){
                if(item.answer[0].hasOwnProperty('valueCoding')){
                    let value = q.value;
                    if(q.value === 'default'){
                        value = 'LA137-2'
                    }
                    item.answer[0].valueCoding = {
                        "code": value,
                        "system": "http://loinc.org"
                    }
                }
                else if(item.answer[0].hasOwnProperty('valueBoolean')){
                    item.answer[0].valueBoolean = q.checked
                }
                else if(item.answer[0].hasOwnProperty('valueDate')){
                    item.answer[0].valueDate = q.value
                }
                else if(item.answer[0].hasOwnProperty('valueString')){
                    item.answer[0].valueString = q.value
                }
                else{
                    console.log(item);
                }
            }
        }
    });
}

async function resultSummary(){
    let div = d3.select('#result-content');
    div.html('');
    d3.select('#nav-pre').classed('active',false);
    d3.select('#nav-summary').classed('active',true);
    d3.select('#nav-pdf').classed('active',false);
    d3.select('#nav-fhir').classed('active',false);
    await waitFor(600);
    let row = div.append('div').attr('class','row');
    let col = row.append('div').attr('class','col-md-12').style('display','block');
    let bundle = await fetchResource('Patient','');
    let r = bundle[0];
    //Patient name
    let name = r.name[0].given[0] + ' ' + r.name[0].family;
    let header = col.append('div').style('vertical-align','middle').style('display','inline-block');
    header.append('h4').text(name);
    let dem = header.append('h6');
    let gender = r.gender;
    //Age in days
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let dob = new Date();
    dob.setHours(0,0,0,0);
    let now = Date.now();
    let age = Math.round(Math.abs((dob - now) / oneDay));
    //Gender
    dem.append('i').text(age + ' day-old ' + gender)
    bundle = await fetchResource('Practitioner','');
    let ordering,interpreting;
    bundle.forEach((resource, i) => {
        if(resource.identifier.length > 1){
            ordering = resource;
        }
        else{
            interpreting = resource;
        }
    });
    let detail = col.append('div').style('display','inline-block').style('float','right');
    bundle = await fetch('../resources/Bundle.json');
    b = await bundle.json();
    detail.append('span').text('Results received: ' + dob.toDateString());
    detail.append('br');
    detail.append('span').text('Ordered by: ' + ordering.name[0].given[0] + ' ' + ordering.name[0].family);
    detail.append('br');
    detail.append('span').text('Interpreted by: ' + interpreting.name[0].given[0] + ' ' + interpreting.name[0].family);
    div.append('div').html('<hr />')
    //Panels
    bundle = await fetchResource('DiagnosticReport','');
    bundle.forEach(async (report, i) => {
        let link = report.code.coding[0].system + '/' + report.code.coding[0].code.trim()
        let row = div.append('div').attr('class','row mb-5').style('border-left-style','solid').style('border-left-width','10px').style('border-left-color','rgba(2, 117, 216, 0.22)').style('border-radius','15px');
        let col = row.append('div').attr('class','col-md-12');
        col.append('h4').attr('class','mb-0 pb-0').html(report.code.coding[0].display + ' <a href=' + link + '><span style="vertical-align: middle;" data-feather="info"></span></a>').style('display','inline-block').style('padding-bottom','5px');
        feather.replace()
        let results_col = row.append('div').attr('class','col-md-7');
        let results_row = results_col.append('div').attr('class','row');
        let title = results_row.append('div').attr('class','col-md-12 pb-3');
        let effective = new Date();
        effective.setHours(i*2 + 1)
        title.append('span').html('<i>' + effective.toString() + '</i>')
        if(report.hasOwnProperty('conclusion')){
            title.append('br')
            title.append('span').html('Status: ' + report.conclusion.split('|')[0] + ' <a href=' + report.conclusion.split('|')[1] + '><span style="vertical-align: middle;" data-feather="info"></span></a>').style('display','inline-block');
            feather.replace();
        }
        await buildResultDisplay(results_row,report.result);
        let comment_col = row.append('div').attr('class','col-md-5 border-left');
        report.extension.forEach((ext, i) => {
            if(i !== 0){
                comment_col.append('div').html('<hr />')
            }
            let l = ext.valueString.split('|');
            comment_col.append('span').html('<b>COMMENT:</b> ' + l[0]);
            comment_col.append('br');
            comment_col.append('span').html('<i>Source: ' + l[1] + ' <a href=' + l[2] + '><span style="vertical-align: middle;" data-feather="info"></span></a></i>').style('display','inline-block');
            comment_col.append('br');
            comment_col.append('span').html('<i>Type: ' + l[3] + ' <a href=' + l[4] + '><span style="vertical-align: middle;" data-feather="info"></span></a></i>').style('display','inline-block');
            feather.replace();
        });

    });
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function buildResultDisplay(results_col,results){
    //Loop through results
    results.forEach(async (r, i) => {
        bundle = await fetchResource('Observation',r.reference.split('/')[1]);
        let obs = bundle[0];
        let link = obs.code.coding[0].system + '/' + obs.code.coding[0].code.trim();
        result = results_col.append('div').attr('class','col-md-6 pl-4');
        result.append('h5').html(obs.code.coding[0].display + ' <a href=' + link + '><span style="vertical-align: middle;" data-feather="info"></span></a>').style('display','inline-block');
        feather.replace();
        if(obs.hasOwnProperty('valueCodeableConcept')){
            //Coded value
            result.append('br')
            result.append('span').text('Result: ' + obs.valueCodeableConcept.coding[0].display);
            result.append('br')
        }
        else{
            //Numeric value
            result.append('br')
            let unit = obs.valueQuantity.unit;
            if (obs.valueQuantity.unit === undefined){
                unit = ''
            }
            result.append('span').text('Result: ' + obs.valueQuantity.value + ' ' + unit);

            if(obs.hasOwnProperty('referenceRange')){
                result.append('br')
                result.append('span').html('<i>Target: ' + obs.referenceRange[0].low.value + '-' + obs.referenceRange[0].high.value + ' ' + unit + '</i>');
                let id = 'obs' + obs.id + i.toString();
                result.append('div').attr('id',id);
                let el = await d3.select('#' + id);
                createGraph(el, obs.code.coding[0].code.trim(), parseInt(obs.valueQuantity.value), unit);
            }
            else{
                result.append('br')
            }
        }
        if(obs.hasOwnProperty('interpretation')){
            let link = obs.interpretation[0].coding.system;
            result.append('span').html('Interpretation: ' + obs.interpretation[0].text + ' ' + '<a href=' + link + '><span style="vertical-align: middle;" data-feather="info"></span></a>');
            result.append('br')
        }
        if(obs.hasOwnProperty('note')){
            result.append('span').html('Status: ' + obs.note[0].text);
        }
    });

}
let graph_demo = {
    //low,rl,rh,high
    '42906-8':[true,3,20,24],
    '38473-5':[false,0,12.501,30],
    '53336-4':[true,0.08,1.1,35],
    '29575-8':[false,0,40,80],
    '48633-2':[false,0,51,100],
    '92007-4':[false,0,2.8,19],
    '92002-5':[false,0,33.2,40]
}
function createGraph(el, code, percent, unit){
    var Needle, arc, arcEndRad, arcStartRad, barWidth, chart, chartInset, degToRad, endPadRad, height, i, margin, needle, numSections, padRad, percToDeg, percToRad, percent, radius, ref, sectionIndx, sectionPerc, startPadRad, svg, totalPercent, width;
    //Number of sections you want in the gauge
    if(graph_demo[code][0] === true){
        numSections = 3;
    }else{
        numSections = 2;
    }
    padRad = 0;
    barWidth = 15;
    chartInset = 5;
    totalPercent = 0.75;
    margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    width = el._groups[0][0].offsetWidth - margin.left - margin.right;
    width = width / 2;
    height = width;
    radius = Math.min(width, height) / 2;
    percToDeg = function (perc) {
        return perc * 360;
    };
    percToRad = function (perc) {
        return degToRad(percToDeg(perc));
    };
    degToRad = function (deg) {
        return deg * Math.PI / 180;
    };
    svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', (height/1.3) + margin.top + margin.bottom);
    chart = svg.append('g').attr('transform', 'translate(' + (width + margin.left) / 2 + ', ' + (height + margin.top) / 2 + ')');
    for (sectionIndx = i = 1, ref = numSections; 1 <= ref ? i <= ref : i >= ref; sectionIndx = 1 <= ref ? ++i : --i) {
        //This loop will fun through the number of sections you indicate above
        if(graph_demo[code][0] === true){
            if (sectionIndx === 1){
                //Set the percentage you want this section to take (divide by 2 so it is a horizontal gauge)
                sectionPerc = (graph_demo[code][1] / graph_demo[code][3]) / 2
            }
            if (sectionIndx === 2){
                //Set the percentage you want this section to take (divide by 2 so it is a horizontal gauge)
                sectionPerc = ((graph_demo[code][2] - graph_demo[code][1]) / graph_demo[code][3]) / 2;
            }
            if (sectionIndx === 3){
                //Set the percentage you want this section to take (divide by 2 so it is a horizontal gauge)
                sectionPerc = ((graph_demo[code][3] - graph_demo[code][2]) / graph_demo[code][3]) / 2;
            }
            arcStartRad = percToRad(totalPercent);
            arcEndRad = arcStartRad + percToRad(sectionPerc);
            totalPercent += sectionPerc;
            startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
            endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
            arc = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
            let seg = chart.append('path').attr('class', 'arc chart-color' + sectionIndx).attr('d', arc);
        }else{
            if (sectionIndx === 1){
                //Set the percentage you want this section to take (divide by 2 so it is a horizontal gauge)
                sectionPerc = (graph_demo[code][2] / graph_demo[code][3]) / 2
            }
            if (sectionIndx === 2){
                //Set the percentage you want this section to take (divide by 2 so it is a horizontal gauge)
                sectionPerc = ((graph_demo[code][3] - graph_demo[code][2]) / graph_demo[code][3]) / 2;
            }
            arcStartRad = percToRad(totalPercent);
            arcEndRad = arcStartRad + percToRad(sectionPerc);
            totalPercent += sectionPerc;
            startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
            endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
            arc = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
            sectionIndx += 1
            let seg = chart.append('path').attr('class', 'arc chart-color' + sectionIndx).attr('d', arc);
        }

        //Display the units for the value in the visualization
        chart.append('text').attr('y',30).attr('text-anchor','middle').text(unit).style('stroke-opacity', '.2').style('fill','#737373');
    }
    Needle = function () {
        function Needle(len, radius1) {
            this.len = len;
            this.radius = radius1;
        }
        Needle.prototype.drawOn = function (el, perc) {
            el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
            return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
        };
        Needle.prototype.animateOn = function (el, perc) {
            var self;
            self = this;
            return el.transition().delay(200).ease(d3.easeElastic).duration(3000).selectAll('.needle').tween('progress', function () {
                return function (percentOfPercent) {
                    var progress;
                    progress = percentOfPercent * perc;
                    return d3.select(this).attr('d', self.mkCmd(progress));
                };
            });
        };
        Needle.prototype.mkCmd = function (perc) {
            var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
            thetaRad = percToRad(perc / 2);
            centerX = 0;
            centerY = 0;
            topX = centerX - this.len * Math.cos(thetaRad);
            topY = centerY - this.len * Math.sin(thetaRad);
            leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
            leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
            rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
            rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
            return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
        };
        return Needle;
    }();
    needle = new Needle(45, 6);
    needle.drawOn(chart, 0);
    //Use a D3 scale to translate the value to a percentage readable by the needle (as explained in README)
    let scale = d3.scaleLinear()
        .domain([0,graph_demo[code][3]])
        .range([0,1]);
    needle.animateOn(chart, scale(percent));
}

function resultPDF(){
    let div = d3.select('#result-content');
    div.html('');
    d3.select('#nav-pre').classed('active',false);
    d3.select('#nav-summary').classed('active',false);
    d3.select('#nav-pdf').classed('active',true);
    d3.select('#nav-fhir').classed('active',false);
    let iframe = div.append('iframe');
    iframe.attr('src','../sample.pdf').attr('width','100%').attr('height','1000px');
}

async function resultFHIR(){
    let div = d3.select('#result-content');
    div.html('');
    d3.select('#nav-pre').classed('active',false);
    d3.select('#nav-summary').classed('active',false);
    d3.select('#nav-pdf').classed('active',false);
    d3.select('#nav-fhir').classed('active',true);
    let about = div.append('div').attr('class','main-about');
    about.append('h5').text('About FHIR');
    about.append('p').html('HL7\'s <a href="https://www.hl7.org/fhir/overview.html">FHIR</a> \
    (Fast Healthcare Interoperable Resources) standard is a widely-adopted data standard which \
    abstracts clinical scenarios into separate resources. These resources are linked together \
    to describe the given scenario.');
    about.append('p').html('The following are all the resources created in association with this \
    NBS result message:');
    div.append('br');
    let row = div.append('div').attr('class','row fhir-box');
    let col = row.append('div').attr('class','col-md-5 order-md-2 mb-4');
    let ul = col.append('ul');
    let r = await fetch('../resources/Bundle.json');
    let bundle = await r.json();
    bundle.entry.forEach((entry, i) => {
        let li = ul.append('li').attr('class','fhir-li').attr('onclick','viewResource(this,\'' + entry.resource.resourceType + '\',\'' + entry.resource.id + '\')');
        if(i === 0){
            li.classed('top',true);
        };
        li.append('p').attr('class','fhir-p').text(entry.resource.resourceType);
    });
    col = row.append('div').attr('class','col-md-7 order-md-2 mb-4');
    let pre = col.append('pre').attr('class','view-box');
    let view = pre.append('code').attr('id','view');
    view.html('Select a resource to view')
}

async function viewResource(li,type,id){
    let list = document.getElementsByClassName('selected');
    for (let i = 0; i < list.length; i++) {
        list[i].classList.remove('selected')
    }
    li.className += ' selected';
    r = await fetchResource(type,id);
    document.getElementById('view').innerText = JSON.stringify(r[0], null, 2);
}

async function messageModal(type){
    if (type === 'enter'){
        d3.select('#modal-text').node().value = '';
        let modal = d3.select('#enter-modal');
        modal.style('display','block');
    }
    else{
        let modal = d3.select('#view-modal');
        modal.style('display','block');
        let r = await fetch('../sample.txt');
        let text = await r.text();
        d3.select('#oru-text').text(text);
    }
}

async function loadingModal(){
    let modal = d3.select('#loading-modal');
    modal.style('display','block');
}
async function libraryModal(){
    let modal = d3.select('#library-modal');
    modal.style('display','block');
}
async function communityModal(){
    let modal = d3.select('#community-modal');
    modal.style('display','block');
}
async function closeLoadingModal(){
    let modal = d3.select('#loading-modal');
    modal.style('display','none');
}

async function closeModal(type){
    let id = '#' + type + '-modal'
    let modal = d3.select(id);
    modal.style('display','none');
};

function removeLoading(){
    d3.select('#preview-frame').classed('loading',false);
}

async function loadLibrary(type){
    let response = await fetch('../content-json/pku.json');
    let content = await response.json();
    drawTimeline()
    content.library[type].forEach((source, i) => {
        let list = d3.select('#content-list');
        list.classed('loading',false);
        let row = list.append('div').attr('class','row media text-muted pt-3 pb-3 border-bottom border-gray');
        let img = row.append('div').attr('class','col-md-2');
        img.append('img').attr('src','../img/content-imgs/' + content.condition +'/library/' + source.image).attr('width','70').attr('height','70').attr('class','mr-2 rounded');
        let rate_row = img.append('div').attr('class','row pt-1 pl-1');
        let like = rate_row.append('div').attr('class','col-md-6 pr-1');
        like.append('span').attr('id','like'+ i.toString()).attr('class','rate').attr('data-feather','thumbs-up').attr('onclick','like(this,' + i.toString() + ')').style('float','right');
        let dislike = rate_row.append('div').attr('class','col-md-6 pl-1');
        dislike.append('span').attr('id','dislike'+ i.toString()).attr('class','rate').attr('data-feather','thumbs-down').attr('onclick','dislike(this,' + i.toString() + ')').style('float','left');
        let info = row.append('div').attr('class','col-md-10');
        let title = info.append('div').attr('class','row ml-1');
        title.append('h6').attr('class','mb-0').text(source.title);
        let type = info.append('div').attr('class','row ml-1');
        type.append('p').attr('class','mb-1').text(source.type);
        let buttons = info.append('div').attr('class','row ml-1');
        let navigate = buttons.append('a').attr('class','btn btn-sm btn-outline-primary').attr('role','button').attr('href',source.url).text('Visit Source ');
        navigate.append('span').attr('data-feather','navigation');
        if(source.preview === 'true'){
            let preview = buttons.append('button').attr('class','btn-sm btn-outline-primary preview-button ml-3').attr('id','preview-button-' + i.toString()).attr('onclick','togglePreview(' + i.toString() + ',"' + source.url + '")').text('Preview ');
            preview.append('span').attr('data-feather','chevrons-right');
        }
    });
    feather.replace()
    d3.select('#preview-button-0').attr('class','btn-sm btn-primary preview-button ml-3')
}

function like(e,i){
    if(e.getAttribute('stroke') === 'currentColor'){
        e.setAttribute('stroke', '#0275d8');
        let dislike = d3.select('#dislike' + i);
        dislike.node().setAttribute('stroke','currentColor')
    }
    else{
        e.setAttribute('stroke','currentColor');
    }
}

function dislike(e,i){
    if(e.getAttribute('stroke') === 'currentColor'){
        e.setAttribute('stroke', '#0275d8');
        let like = d3.select('#like' + i);
        like.node().setAttribute('stroke','currentColor')
    }
    else{
        e.setAttribute('stroke', 'currentColor');
    }
}

function togglePreview(idx,url){
    let frame = d3.select('#preview-frame').attr('src',url);
    d3.selectAll('.preview-button').attr('class','btn-sm btn-outline-primary preview-button ml-3')
    let button = d3.select('#preview-button-' + idx.toString()).attr('class','btn-sm btn-primary preview-button ml-3')
}

async function loadCommunity(){
    let response = await fetch('../content-json/pku.json');
    let content = await response.json();
    drawTimeline()
    content.community.forEach((source, i) => {
        let sources = d3.select('#sources');
        let div = sources.append('div').attr('class','text-center border-bottom border-gray pb-3 pt-3');
        div.append('img').attr('class','border rounded-circle').attr('src','../img/content-imgs/' + content.condition +'/community/' + source.image).attr('width','140').attr('height','140');
        div.append('h3').text(source.title);
        let rate_row = div.append('div').attr('class','row pt-1 pl-1');
        let like = rate_row.append('div').attr('class','col-md-6 pr-1');
        like.append('span').attr('id','like'+ i.toString()).attr('class','rate').attr('data-feather','thumbs-up').attr('onclick','like(this,' + i.toString() + ')').style('float','right');
        let dislike = rate_row.append('div').attr('class','col-md-6 pl-1 pb-3');
        dislike.append('span').attr('id','dislike'+ i.toString()).attr('class','rate').attr('data-feather','thumbs-down').attr('onclick','dislike(this,' + i.toString() + ')').style('float','left');
        let p = div.append('p');
        if(source.facebook !== ""){
            let link = p.append('a').attr('href', source.facebook);
            link.append('img').attr('class','rounded-circle mr-1').attr('src','../img/icons/facebook.png').attr('width','30').attr('height','30');
        }
        if(source.instagram !== ""){
            let link = p.append('a').attr('href', source.instagram);
            link.append('img').attr('class','rounded-circle mr-1').attr('src','../img/icons/instagram.png').attr('width','30').attr('height','30');
        }
        if(source.twitter !== ""){
            let link = p.append('a').attr('href', source.twitter);
            link.append('img').attr('class','rounded-circle mr-1').attr('src','../img/icons/twitter.png').attr('width','30').attr('height','30');
        }
        if(source.website !== ""){
            let link = div.append('a').attr('href', source.website).attr('style','text-decoration:none;').html('<span data-feather="home"></span> Organization Website ');
        }
    });
    feather.replace()
}

async function accountDetail(rel,rel_display,method){
    drawTimeline();
    let options = d3.selectAll('option');
    options._groups[0].forEach(option => {
        if(option.value === rel){
            option.setAttribute('selected','selected')
        }
    });
    if(rel === 'O'){
        d3.select('#primary-rel-other').attr('placeholder',rel_display)
    }
    if(method === 'sms'){
        d3.select('#sms').attr('checked','checked');
    }
    if(method === 'phone'){
        d3.select('#phone').attr('checked','checked');
    }
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function drawTimeline(){
    let svg = d3.select("#timeline")
    .append("svg:svg")
    .attr("width", 1500)
    .attr("height", 550)
    .style("position", "absolute")
    .style("z-index", 1100);
    let line_highlight = svg.append("svg:line")
    .attr("x1", 150)
    .attr("y1", 200)
    .attr("x2", 750)
    .attr("y2", 200)
    .style("stroke", "white")
    .style("stroke-width", 10);
    let circle1_highlight = svg.append("svg:circle")
    .attr("cx", 150)
    .attr("cy", 200)
    .attr("r", 13)
    .attr("fill", "white");
    let circle1 = svg.append("svg:circle")
    .attr("cx", 150)
    .attr("cy", 200)
    .attr("r", 10)
    .attr("fill", "#50A7C2");
    let circle2_highlight = svg.append("svg:circle")
    .attr("cx", 350)
    .attr("cy", 200)
    .attr("r", 13)
    .attr("fill", "white");
    let circle2 = svg.append("svg:circle")
    .attr("cx", 350)
    .attr("cy", 200)
    .attr("r", 10)
    .attr("fill", "#50A7C2");
    let circle3_highlight = svg.append("svg:circle")
    .attr("cx", 550)
    .attr("cy", 200)
    .attr("r", 13)
    .attr("fill", "white");
    let circle3 = svg.append("svg:circle")
    .attr("cx", 550)
    .attr("cy", 200)
    .attr("r", 10)
    .attr("fill", "#50A7C2");
    let circle4_highlight = svg.append("svg:circle")
    .attr("cx", 750)
    .attr("cy", 200)
    .attr("r", 13)
    .attr("fill", "white");
    let circle4 = svg.append("svg:circle")
    .attr("cx", 750)
    .attr("cy", 200)
    .attr("r", 10)
    .attr("fill", "#50A7C2");
    let circle5 = svg.append("svg:circle")
    .attr("cx", 950)
    .attr("cy", 200)
    .attr("r", 10)
    .attr("fill", "#50A7C2");
    let line = svg.append("svg:line")
    .attr("x1", 150)
    .attr("y1", 200)
    .attr("x2", 950)
    .attr("y2", 200)
    .style("stroke", "#50A7C2")
    .style("stroke-width", 5);
    let current = svg.append("svg:circle")
    .attr("cx", 750)
    .attr("cy", 200)
    .attr("r", 5)
    .attr("fill", "white");
    let label1 = svg.append("svg:text")
    .attr("x", "75")
    .attr("y", "250")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .text("Specimen Collected");
    let label2 = svg.append("svg:text")
    .attr("x", "275")
    .attr("y", "160")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .text("Specimen Processed");
    let label3 = svg.append("svg:text")
    .attr("x", "475")
    .attr("y", "250")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .text("Results Reviewed");
    let label4 = svg.append("svg:text")
    .attr("x", "675")
    .attr("y", "160")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .text("Call from Doctor");
    let label5 = svg.append("svg:text")
    .attr("x", "875")
    .attr("y", "250")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .text("Care Plan Coordination");
}
