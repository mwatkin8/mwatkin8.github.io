function hgvs(){
    document.getElementById('vr_model').innerHTML = JSON.stringify({
        "_id": "ga4gh:VA.KwV0q2DpNi0Ms6eKva4gNl9Wz98BiFfq",
        "location": {
            "interval": {
                "end": 705,
                "start": 706,
                "type": "SimpleInterval"
            },
            "sequence_id": "refseq:NC_000001.11",
            "type": "SequenceLocation"
        },
        "state": {
            "sequence": "T",
            "type": "SequenceState"
        },
        "type": "Allele"
    },null,2);
}

function digest(){
    document.getElementById('sq').value = 'ga4gh:SQ.S_KjnFVz-FE7M0W6yoaUDgYxLPc1jyWU'
    document.getElementById('vsl').value = 'ga4gh:VSL.csuStjdPtdBnjBgBIqTn8wUzRg5hwQeN'
    document.getElementById('va').value = 'ga4gh:VA.lO9znmMc8ZSZybtfrBow7n5hSR-hUfM3'
    document.getElementById('vr_model').innerHTML = JSON.stringify( {
        "_id": "ga4gh:VA.lO9znmMc8ZSZybtfrBow7n5hSR-hUfM3",
        "location": {
            "interval": {
                "end": "1",
                "start": "2",
                "type": "SimpleInterval"
            },
            "sequence_id": "refseq:NC_000001.10",
            "type": "SequenceLocation"
        },
        "state": {
            "sequence": "G>T",
            "type": "SequenceState"
        },
        "type": "Allele"
    } ,null,2)
}

function closeModal(type){
    let modal = d3.select('#modal');
    modal.style('display','none');
    return false;
}

async function openModal(){
    let non = document.getElementById('non-loading');
    non.style.opacity = "0.1";
    let loading = document.getElementById("loading");
    loading.style.display = "block";
    await timeout(2000);
    loading.style.display = "none";
    non.style.opacity = "1";
    vr_vcf();
}

async function demoVCF(){
    d3.select('#demo-vcf').classed('active',true);
    d3.select('#vr-vcf').classed('active',false);
    d3.select('#vr-json').classed('active',false);
    modal = d3.select('#modal');
    pre = d3.select('#modal-pre');
    r = await fetch('../static/demo-files/demo.vcf');
    content = await r.text();
    pre.text(content);
    modal.style('display','block');
    return false;
}
async function vr_vcf(){
    d3.select('#demo-vcf').classed('active',false);
    d3.select('#vr-vcf').classed('active',true);
    d3.select('#vr-json').classed('active',false);
    modal = d3.select('#modal');
    pre = d3.select('#modal-pre');
    r = await fetch('../static/demo-files/vr-demo.vcf');
    content = await r.text();
    pre.text(content);
    modal.style('display','block');
    return false;
}

async function vr_json(){
    d3.select('#demo-vcf').classed('active',false);
    d3.select('#vr-vcf').classed('active',false);
    d3.select('#vr-json').classed('active',true);
    modal = d3.select('#modal');
    pre = d3.select('#modal-pre');
    r = await fetch('../static/demo-files/vr-demo.json');
    let resource = await r.json();
    content = JSON.stringify(resource,null,2)
    pre.text(content);
    modal.style('display','block');
    return false;
}

function changeFileName(){
    let name = document.getElementById('fileName');
    let f = document.cookie.split(';');
    for (let cookie of f) {
        let parts = cookie.trim().split('=');
        if (parts[0] === 'filename') {
            name.innerHTML = parts[1];
            break
        }
    }
}

function timeout(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function copy(id){
    let copyText = document.getElementById(id).textContent;
    if (copyText === ''){
        console.log('here!');
        copyText = document.getElementById(id).value;
    }
    let textArea = document.createElement('textarea');
    textArea.id = 'temp';
    textArea.textContent = copyText;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    /* Alert the copied text */
    alert("Copied to clipboard");
    document.getElementById('temp').remove()
}
