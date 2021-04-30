function checkClicks(){
    let checks = document.getElementsByClassName('checks');
    let count = 0;
    for(let i=0; i<checks.length; i++){
        if(checks[i].checked === true){
            count += 1
            document.getElementById('trash-button').style.display = 'block'
        }
        if(count > 1){
            document.getElementById('merge-button').style.display = 'block'
            break
        }
    }
    if(count === 1){
        document.getElementById('merge-button').style.display = 'none'
    }
    if(count === 0){
        document.getElementById('trash-button').style.display = 'none'
    }
}

function checkBoxTrash(){
    let checks = document.getElementsByClassName('checks');
    let ids = [];
    for(let i=0; i<checks.length; i++){
        if(checks[i].checked === true){
            ids.push(checks[i].value)
        }
    }
    deleteRecord(ids.join(','))
}

function checkBoxMerge(){
    let table = "<div class=\"mt-4 media rounded box-shadow\">\
                <div class=\"media-body pb-3 mb-0 lh-125\">\
                    <div>\
                        <table class=\"table table-bordered table-sm mb-1\">\
                            <thead>\
                                <tr id=\"HEADER\">"
    let header = 'ID,Result,Gene,Interpretation,StandardizedResult,CodingDNARef,ProteinRef,RefSeqID,Note,HGVS,VRS'
    let fields = header.split(',')
    for(let i=0; i < fields.length; i++){
        table += "                   <th><div style=\"text-align: center;\">" + fields[i] + "</div></th>"
    }
    table += "                   </tr>\
                            </thead>\
                            <tbody>"
    let unique = Math.floor(Math.random() * 1000000) + 1
    let record1 = '21580,c.3G>A,DDX41,Yes,p.Met1Ile,c.3G>A,p.Met1Ile,NM_016222.2,NULL,NM_007294.4:c.5096G>A,ga4gh:VA.lxDRExWJ4S5I8cgXV98LlLq3hUwcfIPc'
    fields = record1.split(',')
        table += "               <tr>" + buildSynRow(fields,unique) + "</tr>"
    let record2 = '21565,c.5096G>A,BRCA1,Yes,NULL,c.5096G>A,p.Arg1699Gln,NM_007294.3,NULL,NM_007294.3:c.5096G>A,ga4gh:VA.oISAyfH0-m7JTbA-htBUdzZrXVqvh6sO'
    fields = record2.split(',')
    table += "               <tr>" + buildSynRow(fields,unique) + "</tr>"
    table += "               </tbody>\
                        </table>\
                    </div>\
                    <div style=\"text-align: center;\"><img src=\"static/icons/arrow-down.svg\"></div>\
                    <div class=\"pt-1\">\
                        <table class=\"table table-bordered table-sm\">\
                            <tbody>\
                            <tr id=\"" + unique + "\">"
    for (let i=0; i < fields.length; i++){
        table += "               <td><div style=\"text-align: center;\"></div></td>"
    }
    table += "                   </tr>\
                            </tbody>\
                        </table>\
                    </div>\
                    <div class=\"ml-3\" style=\"text-align:center\">\
                        <button class=\"btn btn-sm btn-outline-success\" onclick=\"mergeSynModal('show','" + unique + "','21580,21565')\"> Merge </button>&nbsp;&nbsp;<button onclick=\"hideManMerge()\" class=\"btn btn-sm btn-outline-danger\">Cancel</button>\
                    </div>\
                </div>\
            </div>"
    document.getElementById("merge-modal").style.display = 'block'
    document.getElementById("merge-table").innerHTML = table
}

function hideManMerge(){
    window.location.replace("viewer.html")
}

function buildTrash(){
    trash = ['19517,c.328_333dup,BRIP1,Indeterminant,NULL,c.328_333dup,p.Tyr110_Pro111dup,NM_032043.2,NULL,NM_032043.2:c.328_333dup,ga4gh:VA.9iUHEWAMWgExI4XiqA4jlxLW6UbrVSuY',
    '19516,c.3178G>A,BRIP1,Indeterminant,NULL,c.3178G>A,p.Val1060Ile,NM_032043.2,NULL,NM_032043.2:c.3178G>A,ga4gh:VA.QyljtMnJ6nb6bMKhJ179GiLYsiUHFY8e',
    '19515,c.8450G>T,BRCA2,Indeterminant,NULL,c.8450G>T,p.Cys2817Phe,NM_000059.3,NULL,NM_000059.3:c.8450G>T,ga4gh:VA.DN66gTg53tXI4XGnXfyJ9SNPUuwBm5mn',
    '19514,c.8025A>G,BRCA2,Indeterminant,NULL,c.8025A>G,p.Ile2675Met,NM_000059.3,NULL,NM_000059.3:c.8025A>G,ga4gh:VA.ZI4NV9EX0geAlDXQiiVedWf9C7Zg3GLb',
    '19513,c.3101T>C,BRCA2,Indeterminant,NULL,c.3101T>C,p.Ile1034Thr,NM_000059.3,NULL,NM_000059.3:c.3101T>C,ga4gh:VA.yzacjQR35KkcTlrMJEMiZSm3tdID-AcQ']
    header = 'ACTION,ID,Result,Gene,Interpretation,StandardizedResult,CodingDNARef,ProteinRef,RefSeqID,Note,HGVS,VRS'
    total = 0
    t = "<table class=\"table table-striped table-bordered table-sm\"><thead>"
    t += "<tr id=\"HEADER\">"
    let fields = header.split(',')
    for(let i = 0; i < fields.length; i++){
        t += "<th><div style=\"text-align: center;\">" + fields[i] + "</div></th>"
    }
    t += "</tr></thead><tbody>"
    rows = ''
    for(let i = 0; i < trash.length; i++){
        fields = trash[i].split(',')
        row = "<tr id=" + fields[0] + ">"
        for(let j = 0; j < fields.length; j++){
            if (j == 0){
                row += "<td style=\"vertical-align: middle;\"><div style=\"text-align: center;\"><button onclick=\"alert('Restoring records from trash is not supported in this demo.')\" class=\"btn btn-sm btn-primary\"><img src=\"static/icons/rotate-ccw.svg\"></button> <button onclick=\"trashModal('true','" + fields[0] + "')\" class=\"btn btn-sm btn-danger\"><img src=\"static/icons/trash-white.svg\"></button></div></td>"
            }
            row += "<td style=\"vertical-align: middle;\"><div style=\"text-align: center;\">" + fields[j] + "</div></td>"
        }
        row += "</tr>\n"
        rows = row + rows
        total += 1
    }
    t += rows + "</tbody></table>"
    document.getElementById('table').innerHTML = t
    document.getElementById('total').innerHTML = total
}

async function buildTable(){
    r = await fetch('demo.csv');
    csv = await r.text();
    lines = csv.split('\n')
    t = "<table id=\"data-table\" class=\"viewer table table-striped table-bordered table-sm\"><thead><tr id=\"HEADER\" class=\"trow\">"
    for(let i = 0; i < lines.length; i++){
        fields = lines[i].split(',')
        if(i === 0){
            fields.forEach((f, i) => {
                t += "<th><div style=\"text-align: center;\">" + f + "</div></th>"
            });
            t += "</tr></thead><tbody>"
        }
        else{
            t += "<tr id=" + fields[0] + ">"
            fields.forEach((f, i) => {
                if(i === 0){
                    t += "<td style=\"vertical-align: middle;\"><div style=\"text-align: center;\"><span>" + f + "</span><br><input class=\"checks\" onclick=\"checkClicks()\" type=\"checkbox\" value=\"" + f + "\">\
                    </div></td>"
                }
                else{
                    t += "<td style=\"vertical-align: middle;\" onclick=\"select('"+ fields[0] + "')\"><div style=\"text-align: center;\">" + f + "</div></td>"
                }
            });
            t += "</tr>"
        }
    }
    t += "</tbody></table>"
    document.getElementById('table-div').innerHTML = t
}

async function fillTable(id){
    let body = document.getElementById('detail-body');
    r = await fetch('demo.csv');
    csv = await r.text();
    lines = csv.split('\n')
    tr = ''
    for(let i = 0; i < lines.length; i++){
        fields = lines[i].split(',')
        if (fields[0] === id){
            tr += "<tr id=\"" + id + "\">"
            fields.forEach((f, i) => {
                if(i == 0 || i == fields.length - 1){
                    tr += '<td>' + f + '</td>\n'
                }
                else{
                    tr += '<td><div class=\"edit-cells\" contenteditable>' + f + '</div></td>'
                }
                if(i == 0){
                    document.getElementById('record-id').innerHTML = f
                    h = ''
                    for(let i=0; i < history[f].length; i++){
                        h += history[f][i] + "<br><br>"
                    }
                    document.getElementById('record-history').innerHTML = h
                }
                if(i == 3){
                    document.getElementById('record-int').innerHTML += ' ' + f
                }
                if(i == 9){
                    document.getElementById('record-hgvs').innerHTML += f
                    try{
                        document.getElementById('cv-int').innerHTML = bins[f]["ClinVar Interpretation"]
                        syn = ''
                        for(let i=0; i < bins[f]["ClinVar Synonyms"].length; i++){
                            syn += bins[f]["ClinVar Synonyms"][i]["HGVS"] + "<br>"
                        }
                        document.getElementById('cv-syn').innerHTML = syn
                    }
                    catch{
                        document.getElementById('cv-int').innerHTML = 'None'
                        document.getElementById('cv-syn').innerHTML = 'None'
                    }

                }
            });
            tr += '</tr>'
            body.innerHTML = tr
            break
        }
    }
}

function select(id){
    window.location.replace("detail.html?id=" + id)
}

let exp = {
    "update":"ClinVar has a different interpretation for the HGVS expressions of these entries",
    "merge-dup":"Merge entries that have identical HGVS expressions",
    "merge-syn":"Merge entries that have synonymous HGVS expressions"
}

function suggestions(){
    let url = window.location.search;
    let type = url.split('type=')[1]
    document.getElementById('explanation').innerHTML = exp[type]
    let tabs = document.getElementsByClassName("tab");
    for(a of tabs) {
        a.classList.remove("active");
    }
    if(type === 'update'){
        tabs[0].classList.add("active")
        count = 0
        list = ''
        for (let [hgvs,val] of Object.entries(bins)){
            if ("ClinVar Interpretation" in bins[hgvs]){
                if (bins[hgvs]["Interpretation"] !== bins[hgvs]["ClinVar Interpretation"] && !bins[hgvs]["ClinVar Interpretation"].includes('Conflicting interpretations of pathogenicity')){
                    count += 1
                    list += "<div class=\"media pt-3 rounded box-shadow\">\
                        <div class=\"media-body pb-3 mb-0 lh-125\">\
                            <div class=\"ml-3\" style=\"display:inline-block\">\
                                <button class=\"btn btn-sm btn-success\" onclick=\"suggestModal('true','yes-modal')\"><img src=\"static/icons/check.svg\"></img></button>&nbsp;&nbsp;<button class=\"btn btn-sm btn-danger\" onclick=\"suggestModal('true','no-modal')\"><img src=\"static/icons/x.svg\"></button>\
                            </div>&nbsp;\
                            <h5 class=\"mt-2\" style=\"display:inline-block;font-weight:normal\">" + bins[hgvs]["Interpretation"] + "  <img class=\"pb-1\" src=\"static/icons/arrow-right.svg\"> " + bins[hgvs]["ClinVar Interpretation"] + " <span class=\"text-muted small\">(ClinVar)</span></h5>\
                            <a style=\"display:inline-block;float:right;font-size:large;\" class=\"mt-2 pl-3 mr-3\" href=\"detail.html?id=" + bins[hgvs]["ID"] + "\">" + bins[hgvs]["ID"] + "</a>\
                            <span style=\"display:inline-block;float:right;font-size:large;\" class=\"mt-2\">" + hgvs + "</span>\
                        </div>\
                    </div>"
                }
            }
        }
        document.getElementById("total").innerHTML = count
        document.getElementById("list").innerHTML = list
    }
    if(type === 'merge-dup'){
        tabs[1].classList.add("active")
        let table = "<div class=\"mt-4 media rounded box-shadow\">\
                    <div class=\"media-body pb-3 mb-0 lh-125\">\
                        <div>\
                            <table class=\"table table-bordered table-sm mb-1\">\
                                <thead>\
                                    <tr id=\"HEADER\">"
        let header = 'ID,Result,Gene,Interpretation,StandardizedResult,CodingDNARef,ProteinRef,RefSeqID,Note,HGVS,VRS'
        let fields = header.split(',')
        for(let i=0; i < fields.length; i++){
            table += "                   <th><div style=\"text-align: center;\">" + fields[i] + "</div></th>"
        }
        table += "                   </tr>\
                                </thead>\
                                <tbody>"
        let record1 = '21514,c.1175_1214del,BRCA1,Uncertain significance,NULL,c.1175_1214del,p.Leu392Glnfs*5,NM_007294.3,Different note,NM_007294.3:c.1175_1214del,ga4gh:VA.K0JQPnIutWJDOv9LoSRoj0wJpfIHqRmt'
        fields = record1.split(',')
            table += "               <tr>" + buildDupRow(fields) + "</tr>"
        let record2 = '21513,c.1175_1214del,BRCA1,Pathogenic,NULL,c.1175_1214del,p.Leu392Glnfs*5,NM_007294.3,NULL,NM_007294.3:c.1175_1214del,ga4gh:VA.K0JQPnIutWJDOv9LoSRoj0wJpfIHqRmt'
        fields = record2.split(',')
        table += "               <tr>" + buildDupRow(fields) + "</tr>"
        table += "               </tbody>\
                            </table>\
                        </div>\
                        <div style=\"text-align: center;\"><img src=\"static/icons/arrow-down.svg\"></div>\
                        <div class=\"pt-1\">\
                            <table class=\"table table-bordered table-sm\">\
                                <tbody>\
                                    <tr id=\"" + fields[9] + "\">"
        for (let i=0; i < fields.length; i++){
            if (i == 9){
                table += "               <td><div style=\"text-align: center;\">" + fields[9] + "</div></td>"
            }
            else if (i == 10){
                table += "               <td><div style=\"text-align: center;\">" + 'ga4gh:VA.K0JQPnIutWJDOv9LoSRoj0wJpfIHqRmt' + "</div></td>"
            }
            else{
                table += "               <td><div style=\"text-align: center;\"></div></td>"
            }
        }
        table += "                   </tr>\
                                </tbody>\
                            </table>\
                        </div>\
                        <div class=\"ml-3\" style=\"text-align:center\">\
                            <button class=\"btn btn-sm btn-outline-success\" onclick=\"mergeDupModal('show','" + fields[9] + "','21514,21513')\"> Merge </button>&nbsp;&nbsp;<button class=\"btn btn-sm btn-outline-danger\">Ignore</button>\
                        </div>\
                    </div>\
                </div>"
        document.getElementById("total").innerHTML = 1
        document.getElementById("list").innerHTML = table
    }
    if(type === 'merge-syn'){
        tabs[2].classList.add("active")
        let table = "<div class=\"mt-4 media rounded box-shadow\">\
                    <div class=\"media-body pb-3 mb-0 lh-125\">\
                        <div>\
                            <table class=\"table table-bordered table-sm mb-1\">\
                                <thead>\
                                    <tr id=\"HEADER\">"
        let header = 'ID,Result,Gene,Interpretation,StandardizedResult,CodingDNARef,ProteinRef,RefSeqID,Note,HGVS,VRS'
        let fields = header.split(',')
        for(let i=0; i < fields.length; i++){
            table += "                   <th><div style=\"text-align: center;\">" + fields[i] + "</div></th>"
        }
        table += "                   </tr>\
                                </thead>\
                                <tbody>"
        let unique = Math.floor(Math.random() * 1000000) + 1
        let record1 = '21580,c.3G>A,DDX41,Yes,p.Met1Ile,c.3G>A,p.Met1Ile,NM_016222.2,NULL,NM_007294.4:c.5096G>A,ga4gh:VA.lxDRExWJ4S5I8cgXV98LlLq3hUwcfIPc'
        fields = record1.split(',')
            table += "               <tr>" + buildSynRow(fields,unique) + "</tr>"
        let record2 = '21565,c.5096G>A,BRCA1,Yes,NULL,c.5096G>A,p.Arg1699Gln,NM_007294.3,NULL,NM_007294.3:c.5096G>A,ga4gh:VA.oISAyfH0-m7JTbA-htBUdzZrXVqvh6sO'
        fields = record2.split(',')
        table += "               <tr>" + buildSynRow(fields,unique) + "</tr>"
        table += "               </tbody>\
                            </table>\
                        </div>\
                        <div style=\"text-align: center;\"><img src=\"static/icons/arrow-down.svg\"></div>\
                        <div class=\"pt-1\">\
                            <table class=\"table table-bordered table-sm\">\
                                <tbody>\
                                <tr id=\"" + unique + "\">"
        for (let i=0; i < fields.length; i++){
            table += "               <td><div style=\"text-align: center;\"></div></td>"
        }
        table += "                   </tr>\
                                </tbody>\
                            </table>\
                        </div>\
                        <div class=\"ml-3\" style=\"text-align:center\">\
                            <button class=\"btn btn-sm btn-outline-success\" onclick=\"mergeSynModal('show','" + unique + "','21580,21565')\"> Merge </button>&nbsp;&nbsp;<button class=\"btn btn-sm btn-outline-danger\">Ignore</button>\
                        </div>\
                    </div>\
                </div>"
        document.getElementById("total").innerHTML = 1
        document.getElementById("list").innerHTML = table
    }
}

function buildDupRow(fields){
    row = ''
    for (let i=0; i < fields.length; i++){
        let r = Math.floor(Math.random() * 1000000) + 1
        if(i !== 9 && i !== 10){
            row += "<td id=\"" + r + "\"><div class=\"pt-2 pb-2\" style=\"text-align: center;\"><button onclick=\"merge(\'" + fields[9] + "\',\'" + String(r) + "\',\'" + String(i) + "\',\'\')\" style=\"vertical-align: bottom;\"class=\"btn btn-primary btn-sm\"><img src=\"static/icons/plus.svg\"></button></div><div class=\"cell-content\" style=\"text-align: center;\">" + fields[i] + "</div></td>"
        }
        else{
            row += "<td id=\"" + r + "\"><div class=\"cell-content\" style=\"text-align: center;\">" + fields[i] + "</div></td>"
        }
    }
    return row
}

function buildSynRow(fields,unique){
    row = ''
    for (let i=0; i < fields.length; i++){
        let r = Math.floor(Math.random() * 1000000) + 1
        if(i !== 10){
            if(i === 9){
                row += "<td id=\"" + r + "\"><div class=\"pt-2 pb-2\" style=\"text-align: center;\"><button onclick=\"mergeSyn(\'" + unique + "\',\'" + String(r) + "\',\'" + String(i) + "\',\'" + fields[10] + "\')\" style=\"vertical-align: bottom;\"class=\"btn btn-primary btn-sm\"><img src=\"static/icons/plus.svg\"></button></div><div class=\"cell-content\" style=\"text-align: center;\">" + fields[i] + "</div></td>"
            }
            else{
                row += "<td id=\"" + r + "\"><div class=\"pt-2 pb-2\" style=\"text-align: center;\"><button onclick=\"mergeSyn(\'" + unique + "\',\'" + String(r) + "\',\'" + String(i) + "\',\'\')\" style=\"vertical-align: bottom;\"class=\"btn btn-primary btn-sm\"><img src=\"static/icons/plus.svg\"></button></div><div class=\"cell-content\" style=\"text-align: center;\">" + fields[i] + "</div></td>"
            }
        }
        else{
            row += "<td id=\"" + r + "\"><div class=\"cell-content\" style=\"text-align: center;\">" + fields[i] + "</div></td>"
        }
    }
    return row
}

function mergeDupModal(visible,hgvs,ids){
    if (visible === 'show'){
        let tr = document.getElementById(hgvs);
        cancel = false
        row = ''
        for(let i = 0; i < tr.children.length; i++){
            if(tr.children[i].children[0].innerHTML === ''){
                cancel = true
                alert('All fields must have a value in order to merge.')
                break
            }
            else{
                row += tr.children[i].children[0].innerHTML + ','
            }
        }
        if (!cancel){
            document.getElementById('merge-dup-modal').style.display = 'block';
            row = row.replaceAll('&gt;','>')
            row = row.replaceAll('&lt;','<')
            row = row.slice(0,-1)
            let id = tr.children[0].children[0].innerHTML;
            let id_list = ids.split(',');
            for (let i = 0; i < id_list.length; i++){
                if (id_list[i] === id){
                    id_list.splice(i, 1);
                    document.getElementById('dup-updated-id').innerHTML = id
                }
            }
            document.getElementById('dup-removed-id').innerHTML = id_list.join()
        }
    }
    else{
        document.getElementById('merge-dup-modal').style.display = 'none';
    }
}

function mergeSynModal(visible,name,ids){
    if (visible === 'show'){
        let tr = document.getElementById(name);
        cancel = false
        row = ''
        for(let i = 0; i < tr.children.length; i++){
            if(tr.children[i].children[0].innerHTML === ''){
                cancel = true
                alert('All fields must have a value in order to merge.')
                break
            }
            else{
                row += tr.children[i].children[0].innerHTML + ','
            }
        }
        if (!cancel){
            document.getElementById('merge-syn-modal').style.display = 'block';
            row = row.replaceAll('&gt;','>')
            row = row.replaceAll('&lt;','<')
            row = row.slice(0,-1)
            let id = tr.children[0].children[0].innerHTML;
            let id_list = ids.split(',');
            for (let i = 0; i < id_list.length; i++){
                if (id_list[i] === id){
                    id_list.splice(i, 1);
                    document.getElementById('syn-updated-id').innerHTML = id
                }
            }
            document.getElementById('syn-removed-id').innerHTML = id_list.join()
        }
    }
    else{
        document.getElementById('merge-syn-modal').style.display = 'none';
    }
}

function editable(){
    let cells = document.getElementsByClassName("edit-cells");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("input", function() {
            newEdit();
        });
    }
}

function merge(hgvs,id,col){
    let td = document.getElementById(id)
    let tr = document.getElementById(hgvs);
    tr.children[parseInt(col)].innerHTML = "<div style=\"text-align: center;\">" + td.children[1].innerHTML + "</div>"
}

function mergeSyn(unique,id,col,vrs){
    let td = document.getElementById(id)
    let tr = document.getElementById(unique);
    tr.children[parseInt(col)].innerHTML = "<div style=\"text-align: center;\">" + td.children[1].innerHTML + "</div>"
    if (vrs !== ''){
        tr.children[10].innerHTML = "<div style=\"text-align: center;\">" + vrs + "</div>"
    }

}

function newEdit(){
    document.getElementById("save-edit").style.display = 'inline';
    document.getElementById("cancel-edit").style.display = 'inline';
}

function back(){
    window.location.replace("/")
}

function newEntry(){
    document.getElementById('add-row').style.display = 'block'
}

function closeEntry(){
    document.getElementById('add-row').style.display = 'none'
}

function modal(warning){
    if (warning === 'True'){
        document.getElementById('modal').style.display = 'block';
    }
}

function trashModal(show,id){
    if (show === 'true'){
        document.getElementById('entry-id').innerText = id;
        document.getElementById('trash-modal').style.display = 'block';
    }
    else{
        document.getElementById('trash-modal').style.display = 'none';
    }
}

function suggestModal(show,type){
    if (show === 'true'){
        document.getElementById(type).style.display = 'block';
    }
    else{
        document.getElementById(type).style.display = 'none';
    }
}

function showInitializing(){
    let non = document.getElementById('non');
    non.style.opacity = "0.1";
    let loading = document.getElementById("initializing");
    loading.style.display = "block";
    setTimeout(function redirect(){
        window.location.href = "viewer.html"
    },3000)
}

let bins = {'NM_007294.4:c.5096G>A': {'ID': '21580', 'Interpretation': 'Yes', 'Duplicates': [], 'ClinVar VariationID': '37636', 'ClinVar Interpretation': 'Pathogenic', 'ClinVar Synonyms': [{'HGVS': 'NM_007294.4:c.5096G>A', 'VRS': 'ga4gh:VA.lxDRExWJ4S5I8cgXV98LlLq3hUwcfIPc'}, {'HGVS': 'NM_007297.4:c.4955G>A', 'VRS': 'ga4gh:VA.eZMyyMmzGh1ChsUktSX7-9ylpNDAqKiX'}, {'HGVS': 'NM_007298.3:c.1784G>A', 'VRS': 'ga4gh:VA.UKeZ0Kz1-KlcCK6Fy7uq1O5b_RkUfnbq'}, {'HGVS': 'NM_007299.4:c.1784G>A', 'VRS': 'ga4gh:VA.BiyTYnpeyQU5NLJWMJ8SrDeX_wKGghKo'}, {'HGVS': 'NM_007300.4:c.5159G>A', 'VRS': 'ga4gh:VA.idfferKf2u9798pET5MjYZBSQlYmr5Ti'}]},'NM_007294.3:c.5096G>A': {'ID': '21565', 'Interpretation': 'Yes', 'Duplicates': [], 'ClinVar VariationID': '37636', 'ClinVar Interpretation': 'Pathogenic', 'ClinVar Synonyms': [{'HGVS': 'NM_007294.4:c.5096G>A', 'VRS': 'ga4gh:VA.lxDRExWJ4S5I8cgXV98LlLq3hUwcfIPc'}, {'HGVS': 'NM_007297.4:c.4955G>A', 'VRS': 'ga4gh:VA.eZMyyMmzGh1ChsUktSX7-9ylpNDAqKiX'}, {'HGVS': 'NM_007298.3:c.1784G>A', 'VRS': 'ga4gh:VA.UKeZ0Kz1-KlcCK6Fy7uq1O5b_RkUfnbq'}, {'HGVS': 'NM_007299.4:c.1784G>A', 'VRS': 'ga4gh:VA.BiyTYnpeyQU5NLJWMJ8SrDeX_wKGghKo'}, {'HGVS': 'NM_007300.4:c.5159G>A', 'VRS': 'ga4gh:VA.idfferKf2u9798pET5MjYZBSQlYmr5Ti'}]}, 'NM_000553.4:c.1181C>G': {'ID': '21563', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '580861', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_000553.6:c.1181C>G', 'VRS': 'ga4gh:VA.K6KjFxfGsbPwAy2iuMRn-l04QDqdMoVo'}]}, 'NM_000551.3:c.433C>G': {'ID': '21562', 'Interpretation': 'Indeterminant', 'Duplicates': []}, 'NM_000548.3:c.293G>A': {'ID': '21561', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '643234', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_000548.5:c.293G>A', 'VRS': 'ga4gh:VA.pKq5pjo3aWwj97cxvDiVmITh241nqWbs'}, {'HGVS': 'NM_001077183.2:c.293G>A', 'VRS': 'ga4gh:VA.kSOSRgk_gMhXnsyMtLYjUcXXNscJlqWz'}, {'HGVS': 'NM_001114382.2:c.293G>A', 'VRS': 'ga4gh:VA.mM5nQggAz9njKB2FoP1mOZpMmv_e0j3U'}, {'HGVS': 'NM_001318829.1:c.146G>A', 'VRS': 'ga4gh:VA.ELnpjMmn8R8OnoA4aP3pQ4aqcXnZuBZJ'}, {'HGVS': 'NM_001318832.1:c.326G>A', 'VRS': 'ga4gh:VA.ydyUJQZ8pRutTBKDFkYf9rOdQrJ3PSht'}, {'HGVS': 'NM_001363528.1:c.293G>A', 'VRS': 'ga4gh:VA.7l9f5sDhx98TQueUj1gZq26njCkWLwFH'}, {'HGVS': 'NM_001370404.1:c.293G>A', 'VRS': 'ga4gh:VA.4m9pg9ePpE2pt7DUtkgesWYduzJuRg3t'}, {'HGVS': 'NM_001370405.1:c.293G>A', 'VRS': 'ga4gh:VA.1pPug6Imn-EpFXFMA7X2N70DTNNV-XbQ'}, {'HGVS': 'NM_021055.2:c.293G>A', 'VRS': 'ga4gh:VA.kbpc6skQ7kGL26bUlYROseH08uDPgZcr'}, {'HGVS': 'NM_001318827.1:c.226-887G>A', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_001318831.1:c.-1-2787G>A', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}]}, 'NM_016222.4:c.3G>A': {'ID': '21560', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '224637', 'ClinVar Interpretation': 'Pathogenic/Likely pathogenic', 'ClinVar Synonyms': [{'HGVS': 'NM_016222.3:c.3G>A', 'VRS': 'ga4gh:VA.xKP5oKQDnoAKOFtg-TZgL_hG36EAjmR9'}, {'HGVS': 'NM_001321732.2:c.-653G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.hKm4USgfwOAZXMw2-3wYsz9FognnvLUM?start=-654&end=-653'}, {'HGVS': 'NM_001321830.2:c.-445G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.pTMxpb8vGEeqBliUWorQHgx3tMuWyhcn?start=-446&end=-445'}, {'HGVS': 'NM_016222.2:c.3G>A', 'VRS': 'ga4gh:VA.KvL2K1N2TKEuhGnpiuZgadcJ6DPA6SmV'}]}, 'NM_001128849.1:c.829C>T': {'ID': '21559', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '480580', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001128844.2:c.829C>T', 'VRS': 'ga4gh:VA.NUeSo9z80TLYav6K19rqMyGYkBA8qp51'}, {'HGVS': 'NM_001128845.1:c.829C>T', 'VRS': 'ga4gh:VA.ooJzTF9eUUlea-Bym2Gc8-v9pocvfeiT'}, {'HGVS': 'NM_001128846.1:c.829C>T', 'VRS': 'ga4gh:VA.Lf3HKZMHHA0suQGBTe0nu8ruMNNQ7N-Q'}, {'HGVS': 'NM_001128847.3:c.829C>T', 'VRS': 'ga4gh:VA.Mzw6qEDcNBuGkCFd-O8bgO1dQjTE0Bv5'}, {'HGVS': 'NM_001128848.1:c.829C>T', 'VRS': 'ga4gh:VA.bkcVhVYiLbNYCMirWSToR9QA_beSgO7q'}, {'HGVS': 'NM_001128849.2:c.829C>T', 'VRS': 'ga4gh:VA.evFcqvy1ukF4dMvZpKn1NP0-KU3FuAw7'}, {'HGVS': 'NM_003072.4:c.829C>T', 'VRS': 'ga4gh:VA.oegHxscBdzIkdctmixULg9mORQZTjUgW'}]}, 'NM_004168.3:c.456+9C>T': {'ID': '21558', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '385656', 'ClinVar Interpretation': 'Conflicting interpretations of pathogenicity', 'ClinVar Synonyms': [{'HGVS': 'NM_004168.2:c.456+9C>T', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_001330758.1:c.456+9C>T', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_001294332.1:c.313-312C>T', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_004168.4:c.456+9C>T', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}]}, 'NM_020975.4:c.604G>A': {'ID': '21557', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '184536', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_020630.5:c.604G>A', 'VRS': 'ga4gh:VA.0ZoLoYyI5e0QMx752eTm9fjslUXbfFpi'}, {'HGVS': 'NM_020630.4:c.604G>A', 'VRS': 'ga4gh:VA.MRV3IPghdZIFWZZUnaM7uO-OBiWw3Cu0'}]}, 'NM_004260.3:c.2261G>A': {'ID': '21556', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '459391', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': []}, 'NM_000321.2:c.983del': {'ID': '21555', 'Interpretation': 'Yes', 'Duplicates': []}, 'NM_002878.3:c.955_959dup': {'ID': '21554', 'Interpretation': 'Indeterminant', 'Duplicates': []}, 'NM_006231.3:c.6843C>G': {'ID': '21553', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '801270', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_006231.4:c.6843C>G', 'VRS': 'ga4gh:VA.e8neKyuAsuhLpOCSsR5EB2_WEeoR3vks'}]}, 'NM_006231.3:c.6434G>A': {'ID': '21552', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '405619', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_006231.2:c.6434G>A', 'VRS': 'ga4gh:VA.TNJ1xIagtc6bCk-mI4pVjLrSAp_CTQsO'}]}, 'NM_006231.3:c.4072A>G': {'ID': '21551', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '945423', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_006231.4:c.4072A>G', 'VRS': 'ga4gh:VA.8Gn8J5-uLiioiBOuY8-dd5YX9LcSYhQb'}]}, 'NM_006231.3:c.1574A>G': {'ID': '21550', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '484455', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_006231.2:c.1574A>G', 'VRS': 'ga4gh:VA.G42nhw1J2pbNHYYVqNmLlb9Q4D6D0bUy'}]}, 'NM_002691.3:c.3221G>A': {'ID': '21549', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '422817', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001256849.1:c.3221G>A', 'VRS': 'ga4gh:VA.lBNO0Fr2jHTArc4UOeeKfjqG3bFyhZlS'}, {'HGVS': 'NM_001308632.1:c.3299G>A', 'VRS': 'ga4gh:VA.A1mWD9XUkELtTApMQoWrcPJrj8fB4dG7'}, {'HGVS': 'NM_002691.4:c.3221G>A', 'VRS': 'ga4gh:VA.OJuKUg1zfGDba-2d4K7Gv_bgmSemkt-h'}]}, 'NM_002691.3:c.2467C>T': {'ID': '21548', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '407966', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001256849.1:c.2467C>T', 'VRS': 'ga4gh:VA.3yDSs2e4_chGBd1PJP6wfUS7ClEy1rRz'}, {'HGVS': 'NM_001308632.1:c.2545C>T', 'VRS': 'ga4gh:VA.YU4IyetU0WMuVm3WoxLO_cejuzZX1WGi'}, {'HGVS': 'NM_002691.4:c.2467C>T', 'VRS': 'ga4gh:VA.B2AAS3bX3UU7CwwibkG3ir8WuBWwvnUk'}]}, 'NM_000535.5:c.106A>C': {'ID': '21547', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '141660', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_000535.6:c.106A>C', 'VRS': 'ga4gh:VA.LOBXltb0yK55c09YSjcRIEUI92JqIzgi'}, {'HGVS': 'NM_000535.7:c.106A>C', 'VRS': 'ga4gh:VA.lAY5rYqE-fj8uLSWMq8pePn2esanY5Y1'}, {'HGVS': 'NM_001322003.2:c.-300A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.Ei_5o4f895ctZkFnQNI9MYeqzw5SlXxX?start=-301&end=-300'}, {'HGVS': 'NM_001322005.2:c.-300A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.f36MGsuv6egZrqJQNgIyovHLZw367Wgj?start=-301&end=-300'}, {'HGVS': 'NM_001322006.2:c.106A>C', 'VRS': 'ga4gh:VA.opRL43acFWbEv0AVXLEe_HkGw92LckjW'}, {'HGVS': 'NM_001322007.1:c.-110A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.N4Exmoe1MxBMkiXwIKHddWNkXVqIE4Ko?start=-111&end=-110'}, {'HGVS': 'NM_001322009.2:c.-300A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.8DrcrZHxJnUi8yaPkQ1_GvVkhUr4iMNw?start=-301&end=-300'}, {'HGVS': 'NM_001322011.2:c.-779A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.rmCkU0Q5C9KaYq3Hd79bXeFrWI4plZ-p?start=-780&end=-779'}, {'HGVS': 'NM_001322012.2:c.-779A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.pHkNVBi7Op2AzrhstcMroPXMwDvwh3DZ?start=-780&end=-779'}, {'HGVS': 'NM_001322013.2:c.-300A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.r18aAsMjfCL83rrDKkar8RNXBDVXAFOk?start=-301&end=-300'}, {'HGVS': 'NM_001322014.2:c.106A>C', 'VRS': 'ga4gh:VA.-8d4GeFhbNKuXZ7ZesGNIcKBm1eOlytQ'}, {'HGVS': 'NM_001322015.2:c.-379A>C', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.TQ9-kCy4tvBVYGKeRE310RkQtjvbcNZY?start=-380&end=-379'}, {'HGVS': 'NM_001322008.2:c.-52-1891A>C', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_001322010.2:c.-242-1891A>C', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_001322004.2:c.-242-1891A>C', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}]}, 'NM_024675.3:c.3196G>A': {'ID': '21545', 'Interpretation': 'Indeterminant', 'Duplicates': []}, 'NM_024675.3:c.2736G>A': {'ID': '21544', 'Interpretation': 'Yes', 'Duplicates': [], 'ClinVar VariationID': '821738', 'ClinVar Interpretation': 'Pathogenic', 'ClinVar Synonyms': [{'HGVS': 'NM_024675.4:c.2736G>A', 'VRS': 'ga4gh:VA.frMf0c6Syz9yPy0canAEaD_ljvJnfvXT'}]}, 'NM_002485.4:c.1729G>T': {'ID': '21543', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '141617', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001024688.2:c.1483G>T', 'VRS': 'ga4gh:VA.yHIO7Spyo-9MKqXH5lcLDgzdnjGAQCyn'}]}, 'NM_001128425.1:c.936G>A': {'ID': '21542', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '216524', 'ClinVar Interpretation': 'Conflicting interpretations of pathogenicity', 'ClinVar Synonyms': [{'HGVS': 'NM_001048171.1:c.894G>A', 'VRS': 'ga4gh:VA.BuCCPg8v4AAnxQUh0EVW8L2xtO9xEj1q'}, {'HGVS': 'NM_001048172.1:c.855G>A', 'VRS': 'ga4gh:VA.BQzCtc1rwB4xQ8Hr6R_Knxon94PvBFbE'}, {'HGVS': 'NM_001048173.1:c.852G>A', 'VRS': 'ga4gh:VA.-cnvCk9K4SII4fuK-Sli6CxITxf-seD1'}, {'HGVS': 'NM_001048174.1:c.852G>A', 'VRS': 'ga4gh:VA.i8ilMwmMCvaY2pugM9JCNGBVGXv7ifJ-'}, {'HGVS': 'NM_001293190.1:c.897G>A', 'VRS': 'ga4gh:VA.FNFQqT_YNTqEmTbE4WcxdBGyqmH7ztgt'}, {'HGVS': 'NM_001293191.1:c.885G>A', 'VRS': 'ga4gh:VA.t7zSoPOrMZQqlMp2Fct-Q7q218shhF62'}, {'HGVS': 'NM_001293192.1:c.576G>A', 'VRS': 'ga4gh:VA.NKPK1feoy0sz03NMYf6s9BZG7hCbz1iG'}, {'HGVS': 'NM_001293195.1:c.852G>A', 'VRS': 'ga4gh:VA.q_pmlIi_--vkGYINGbg-gPSz9zXGNjtS'}, {'HGVS': 'NM_001293196.1:c.576G>A', 'VRS': 'ga4gh:VA.GIUVobGg60nM6vOXsDDpeLo4T8ZGp_KO'}, {'HGVS': 'NM_001350650.1:c.507G>A', 'VRS': 'ga4gh:VA.01iLrArbp8HGVK9slUtr-j_84d6Uq6Y9'}, {'HGVS': 'NM_001350651.1:c.507G>A', 'VRS': 'ga4gh:VA.4WDgJdCGpbfYp3-OXcuRLp0R0r0OvZxi'}, {'HGVS': 'NM_012222.2:c.927G>A', 'VRS': 'ga4gh:VA.gC7qnTt1gNC6DR5FO9WCHnC2yyDosIrj'}]}, 'NM_000179.2:c.2827G>T': {'ID': '21541', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '142495', 'ClinVar Interpretation': 'Conflicting interpretations of pathogenicity', 'ClinVar Synonyms': [{'HGVS': 'NM_001281492.1:c.2437G>T', 'VRS': 'ga4gh:VA.Q3yWwlfV_wKa0lW0l7SII0pyVGa0hGvO'}, {'HGVS': 'NM_001281493.1:c.1921G>T', 'VRS': 'ga4gh:VA.6fv3t16UTjAVoknLvM3My73ugGfJuESH'}, {'HGVS': 'NM_001281494.1:c.1921G>T', 'VRS': 'ga4gh:VA.QsoqfulHFIfTg2hNFWJ2OewGA5A6u7Pk'}]}, 'NM_000179.2:c.2027A>G': {'ID': '21540', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '142496', 'ClinVar Interpretation': 'Conflicting interpretations of pathogenicity', 'ClinVar Synonyms': [{'HGVS': 'NM_001281492.1:c.1637A>G', 'VRS': 'ga4gh:VA.WGIdsyns6gJhCJmMK2OU3Xqxz467hQ54'}, {'HGVS': 'NM_001281493.1:c.1121A>G', 'VRS': 'ga4gh:VA.YJcxR49mIOnigFtX-zLygRkt2U69B6G3'}, {'HGVS': 'NM_001281494.1:c.1121A>G', 'VRS': 'ga4gh:VA.Kln3PyV8nxLM1BvQeER1CPuqg8_NWm2l'}]}, 'NM_000251.2:c.1695A>C': {'ID': '21539', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '954776', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_000251.3:c.1695A>C', 'VRS': 'ga4gh:VA.Q2VQ7uZ9IMvKwn6DInOGab9uyBSBg_Rd'}, {'HGVS': 'NM_001258281.1:c.1497A>C', 'VRS': 'ga4gh:VA.2zznrQqfSdXtssDKdVPLA87F-oS0qFbX'}]}, 'NM_000251.2:c.1387G>A': {'ID': '21538', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '419371', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_000251.1:c.1387G>A', 'VRS': 'ga4gh:VA.gGEBcDiOX61YHXDnC86mW2e4t-om8bcV'}, {'HGVS': 'NM_001258281.1:c.1189G>A', 'VRS': 'ga4gh:VA.9m_T3_RYjmaakqt66aV83DBk_A40gli3'}]}, 'NM_005591.3:c.862C>T': {'ID': '21537', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '216615', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001330347.2:c.862C>T', 'VRS': 'ga4gh:VA.-BvZANq55FJoQe8AkAhllmNTbzJvyPjp'}, {'HGVS': 'NM_005590.4:c.862C>T', 'VRS': 'ga4gh:VA.XZv3b2otmIZxpvLkvvxRSVjotsHp9clA'}]}, 'NM_005591.3:c.482A>G': {'ID': '21536', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '142190', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_005591.4:c.482A>G', 'VRS': 'ga4gh:VA.9ZVxWteXrEUoBc3sADa1aXv69XeZoDvV'}, {'HGVS': 'NM_001330347.2:c.482A>G', 'VRS': 'ga4gh:VA.ux-QRa41kDaUZhxPmjBCVGJjP7NoF6eS'}, {'HGVS': 'NM_005590.4:c.482A>G', 'VRS': 'ga4gh:VA.aQHhB7AA_5Q7nJ35Nwk77mWWwSQIZ-p-'}]}, 'NM_005591.3:c.2042C>T': {'ID': '21535', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '141995', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001330347.2:c.2039C>T', 'VRS': 'ga4gh:VA.ujob7XSufS-R_HaW8bwdl58aJHIK9_lM'}, {'HGVS': 'NM_005590.4:c.1958C>T', 'VRS': 'ga4gh:VA.lFoMacgTGjVCN5EP82t6HSbePlDjGeBH'}]}, 'NM_000249.3:c.409G>A': {'ID': '21534', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '234444', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001167617.2:c.115G>A', 'VRS': 'ga4gh:VA.CdA25uWuVWJTQTJRlrXsl59yTeltgQHR'}, {'HGVS': 'NM_001167618.2:c.-315G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.A6BmF1j0zVDVhSziaV1tlMRbScjcf6uZ?start=-316&end=-315'}, {'HGVS': 'NM_001167619.2:c.-223G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.5T2la16bL4AfXYIVxjCtjeAoNZSyY_vo?start=-224&end=-223'}, {'HGVS': 'NM_001258271.1:c.409G>A', 'VRS': 'ga4gh:VA.1CVt0dlAJgY_wZ5-XUoDBNukDt5-tvUg'}, {'HGVS': 'NM_001258273.1:c.-315G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.GX8HX0vyfTagjLe8mWjOe2GraXRrhbzz?start=-316&end=-315'}, {'HGVS': 'NM_001258274.2:c.-315G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.AnBjzIWudJp_NhaXpCo9N3RhiaKod-8D?start=-316&end=-315'}, {'HGVS': 'NM_001354615.1:c.-223G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.rK-4zexp3XTknAjPlOMFAynr1VLp2TGi?start=-224&end=-223'}, {'HGVS': 'NM_001354616.1:c.-223G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.49Woo6Mh6GdnwXYz39e_wUEnt7qLsDvl?start=-224&end=-223'}, {'HGVS': 'NM_001354617.1:c.-315G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.eCljqTl33tMCyXXM8ETRxykxJU_y8_9G?start=-316&end=-315'}, {'HGVS': 'NM_001354618.1:c.-315G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.RmyLQ7zpECvG4Q3EXmmuTuRv_gwoqlt0?start=-316&end=-315'}, {'HGVS': 'NM_001354619.1:c.-315G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.aSn4eOX4NSK-cObOMVoCMPuguff27Pck?start=-316&end=-315'}, {'HGVS': 'NM_001354620.1:c.115G>A', 'VRS': 'ga4gh:VA.7E9PfGiq4upkSjJ6qdBu8_W_aYuyac3O'}, {'HGVS': 'NM_001354621.1:c.-408G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.JVmbMVnbNM12ryhjEYnWLygSwb7kN414?start=-409&end=-408'}, {'HGVS': 'NM_001354622.1:c.-521G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.ipU8v4n5zjYz-055xU_dBuE5kq49LP5C?start=-522&end=-521'}, {'HGVS': 'NM_001354623.1:c.-521G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.QsnFrK9VhCx9RiRrILBgAPBjuhV_pOwI?start=-522&end=-521'}, {'HGVS': 'NM_001354624.1:c.-418G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.G48eczeRgBYnB_ENyxSTXyfZ2zXbUdpm?start=-419&end=-418'}, {'HGVS': 'NM_001354625.1:c.-326G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.IJ5SHYUndgtk6UCDo1EC5uqfw2dwN8M-?start=-327&end=-326'}, {'HGVS': 'NM_001354626.1:c.-418G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.1qtoVL0kCZKx2k4dywKDvDGNPEsfMx-M?start=-419&end=-418'}, {'HGVS': 'NM_001354627.1:c.-418G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.WZM_LI-ACfCztlu-Yu4MF_U-pChiVAP3?start=-419&end=-418'}, {'HGVS': 'NM_001354628.1:c.409G>A', 'VRS': 'ga4gh:VA.wQxlwexcUoxjS50DDgaYzZc25g4EMHlM'}, {'HGVS': 'NM_001354629.1:c.310G>A', 'VRS': 'ga4gh:VA.GT3JE0SnOytPY0vlgcz2YGcsHz5ArONN'}, {'HGVS': 'NM_001354630.1:c.409G>A', 'VRS': 'ga4gh:VA.5e2NdkmWt6qTNoa217mIWFrIHEUhggSZ'}]}, 'NM_000249.3:c.1668-?_*193+?dup': {'ID': '21533', 'Interpretation': 'Indeterminant', 'Duplicates': []}, 'NM_000410.3:c.187C>G': {'ID': '21531', 'Interpretation': 'Yes-Low Penetran', 'Duplicates': [], 'ClinVar VariationID': '10', 'ClinVar Interpretation': 'Conflicting interpretations of pathogenicity, other', 'ClinVar Synonyms': [{'HGVS': 'NM_001300749.2:c.187C>G', 'VRS': 'ga4gh:VA.tM-ZSxM6hrUbPDzY4pEYfjlkvUzINbTF'}, {'HGVS': 'NM_139003.3:c.187C>G', 'VRS': 'ga4gh:VA.SgPGUq7HQqZLVEVx8KcSzUAm9XFZifW6'}, {'HGVS': 'NM_139004.3:c.187C>G', 'VRS': 'ga4gh:VA.lJD-le-B8u6lSoHhCxE730heY36ZNgMt'}, {'HGVS': 'NM_139006.3:c.187C>G', 'VRS': 'ga4gh:VA.gUAw8HZxnASIvfFDKItVi1HuRslJFOKA'}, {'HGVS': 'NM_139009.3:c.118C>G', 'VRS': 'ga4gh:VA.VK58LslslH88uJ8FAf0gPJ36e-U3Tx0M'}, {'HGVS': 'NM_139007.3:c.77-363C>G', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_139008.3:c.77-363C>G', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_139010.3:c.77-1734C>G', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_139011.3:c.77-2168C>G', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_139011.2:c.77-2168C>G', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}]}, 'NM_144997.5:c.1451A>G': {'ID': '21530', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '529994', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001353229.2:c.1505A>G', 'VRS': 'ga4gh:VA.xtMTros2Rimjk9XSvgQ69hoCen08jmux'}, {'HGVS': 'NM_001353230.2:c.1451A>G', 'VRS': 'ga4gh:VA.saIaJiflZtqoXOMwR8ONlnrTcpoQ-Xeq'}, {'HGVS': 'NM_001353231.2:c.1451A>G', 'VRS': 'ga4gh:VA.i70hA8KMIBgYLPFI6BlIxL7P5ot_nlQd'}, {'HGVS': 'NM_144997.7:c.1451A>G', 'VRS': 'ga4gh:VA.1eax2aMWUItBOT1ORw1axe0GFh43Jt8i'}]}, 'NM_144997.5:c.1337G>A': {'ID': '21529', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '653565', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001353229.2:c.1391G>A', 'VRS': 'ga4gh:VA.3F9WsRmj17ypG0Z8c2tl3NFNtZOLpeJ2'}, {'HGVS': 'NM_001353230.2:c.1337G>A', 'VRS': 'ga4gh:VA.7p72DK0Kf4FbsjK2DP1ac-NmfzKeQDWt'}, {'HGVS': 'NM_001353231.2:c.1337G>A', 'VRS': 'ga4gh:VA.2TJjK1QRNdOkSgg8AQzHoTyfL2ZcGV15'}, {'HGVS': 'NM_144997.7:c.1337G>A', 'VRS': 'ga4gh:VA.uWAin3a5HxVJh_GY61n0SIuIFND_SCB4'}]}, 'NM_005228.3:c.293G>A': {'ID': '21528', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '859594', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_001346897.2:c.293G>A', 'VRS': 'ga4gh:VA.C34-Qw0s8cyn6PJ9uE1xA3f3HvjKx4Q4'}, {'HGVS': 'NM_001346898.2:c.293G>A', 'VRS': 'ga4gh:VA.XLYDGeRhRliurZibN461z6KliCANznrR'}, {'HGVS': 'NM_001346899.1:c.293G>A', 'VRS': 'ga4gh:VA.e3c5uUT_UAJeFwzKzYZPNmToPWeVcBOo'}, {'HGVS': 'NM_001346900.2:c.134G>A', 'VRS': 'ga4gh:VA.I3YgbAIgs8u-zs9AbuLzJ79aIdJjN3Sf'}, {'HGVS': 'NM_005228.5:c.293G>A', 'VRS': 'ga4gh:VA.2Qix9RpAkaYe8fefQLa-5JTp1t_lvYAN'}, {'HGVS': 'NM_201282.2:c.293G>A', 'VRS': 'ga4gh:VA.dSUMEiiaQBbaj0KHuqbVMFSrlcZ_13YR'}, {'HGVS': 'NM_201283.1:c.293G>A', 'VRS': 'ga4gh:VA.brt7yqr0oR6ww9azyLRzw4mlOPUuHDN0'}, {'HGVS': 'NM_201284.2:c.293G>A', 'VRS': 'ga4gh:VA.msv9u9tim5AgIyHTEoeINrKRXtiKWm45'}, {'HGVS': 'NM_001346941.2:c.89-12473G>A', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}]}, 'NM_177438.2:c.5390A>G': {'ID': '21527', 'Interpretation': 'Indeterminant', 'Duplicates': []}, 'NM_020975.6:c.604G>A': {'ID': '21526', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '184536', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_020630.5:c.604G>A', 'VRS': 'ga4gh:VA.0ZoLoYyI5e0QMx752eTm9fjslUXbfFpi'}, {'HGVS': 'NM_020630.4:c.604G>A', 'VRS': 'ga4gh:VA.MRV3IPghdZIFWZZUnaM7uO-OBiWw3Cu0'}]}, 'NM_000492.3:c.178G>T': {'ID': '21525', 'Interpretation': 'Yes', 'Duplicates': [], 'ClinVar VariationID': '38730', 'ClinVar Interpretation': 'Pathogenic', 'ClinVar Synonyms': []}, 'NM_004360.3:c.1137G>A': {'ID': '21524', 'Interpretation': 'Yes', 'Duplicates': [], 'ClinVar VariationID': '156499', 'ClinVar Interpretation': 'Pathogenic', 'ClinVar Synonyms': [{'HGVS': 'NM_001317184.2:c.1137G>A', 'VRS': 'ga4gh:VA.BJ0HiHWxkN7xJeNH0Ak9WuG3HXbr2FPP'}, {'HGVS': 'NM_001317185.2:c.-479G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.iXui2y-RNTV_ccHalg2DdUfgQ0sius9r?start=-480&end=-479'}, {'HGVS': 'NM_001317186.2:c.-683G>A', 'VRS': '400 Client Error: BAD REQUEST for url: http://localhost:5000/seqrepo/1/sequence/ga4gh:SQ.RM84NrkfBpO_0_U7Dqr_LXf2gwILXRcp?start=-684&end=-683'}, {'HGVS': 'NM_004360.5:c.1137G>A', 'VRS': 'ga4gh:VA.Dbg6zeO5KsLM9SBYeIdHn89wYjXKoKg0'}, {'HGVS': 'NM_004360.4:c.1137G>A', 'VRS': 'ga4gh:VA.XEWw2KMcm5rt-7pQVHvSeArHUUhsXTcg'}]}, 'NM_031443.3:c.55C>T': {'ID': '21522', 'Interpretation': 'Yes', 'Duplicates': [], 'ClinVar VariationID': '447028', 'ClinVar Interpretation': 'Pathogenic', 'ClinVar Synonyms': [{'HGVS': 'NM_001029835.2:c.118C>T', 'VRS': 'ga4gh:VA.sQqyEJ5LuYi6ojGEUkBqXUmhizbvcK-6'}, {'HGVS': 'NM_001167935.1:c.55C>T', 'VRS': 'ga4gh:VA.LgwratoILneGemxGxuIot1ioSEuKVvNJ'}, {'HGVS': 'NM_001363458.2:c.55C>T', 'VRS': 'ga4gh:VA.pnxZbW6L-oVZuS-2WQkth6yJTNZB5OJc'}, {'HGVS': 'NM_001167934.1:c.31-25641C>T', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}, {'HGVS': 'NM_001363459.2:c.31-25641C>T', 'VRS': 'Intronic HGVS variants are not supported ({sv.posedit})'}]}, 'NM_000388.3:c.3055G>A': {'ID': '21521', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '410331', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_000388.4:c.3055G>A', 'VRS': 'ga4gh:VA.X5aanfgDn0JpxcGl58WasMlw4mTRImj-'}, {'HGVS': 'NM_001178065.2:c.3085G>A', 'VRS': 'ga4gh:VA.5-66lhxauJqfXYwIz3c3_069Nu6tlyKH'}]}, 'NM_000059.3:c.8243G>A': {'ID': '21520', 'Interpretation': 'Yes', 'Duplicates': [], 'ClinVar VariationID': '52535', 'ClinVar Interpretation': 'Pathogenic', 'ClinVar Synonyms': [{'HGVS': 'NM_000059.4:c.8243G>A', 'VRS': 'ga4gh:VA.yuF8ykQM0AanrZK2Ix9he0aHA5Ck107m'}]}, 'NM_000059.3:c.7759C>T': {'ID': '21519', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '141335', 'ClinVar Interpretation': 'Conflicting interpretations of pathogenicity', 'ClinVar Synonyms': []}, 'NM_000059.3:c.3245A>G': {'ID': '21518', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '51431', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': []}, 'NM_000059.3:c.2593G>C': {'ID': '21517', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '141791', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': []}, 'NM_007294.3:c.455T>C': {'ID': '21516', 'Interpretation': 'Indeterminant', 'Duplicates': [], 'ClinVar VariationID': '55227', 'ClinVar Interpretation': 'Uncertain significance', 'ClinVar Synonyms': [{'HGVS': 'NM_007294.4:c.455T>C', 'VRS': 'ga4gh:VA.IHJ0ysLop6FzSVzhacv90u9eYvtdBtix'}, {'HGVS': 'NM_007297.4:c.314T>C', 'VRS': 'ga4gh:VA.ZdONNasbYloYnlWxnsGzGnvBhiAVC6we'}, {'HGVS': 'NM_007298.3:c.455T>C', 'VRS': 'ga4gh:VA.dAjD2L_1LBC2qeKtFb8FFGEG7-UljHLe'}, {'HGVS': 'NM_007299.4:c.455T>C', 'VRS': 'ga4gh:VA.bE7TJ3uBp6VVet_aoSCffUkMOAwtEMn7'}, {'HGVS': 'NM_007300.4:c.455T>C', 'VRS': 'ga4gh:VA.7_Zgwob9H49_rcaE6I57oyPWFaSEpChn'}]}, 'NM_007294.3:c.1860del': {'ID': '21515', 'Interpretation': 'Yes', 'Duplicates': []}, 'NM_007294.3:c.1175_1214del': {'ID': '21514', 'Interpretation': 'Yes', 'Duplicates': [{'ID': '21513', 'Interpretation': 'Yes'}]}}

let history = {'21580': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>', '<b>04/27/2021, 23:19:08</b><br><i>manual edit</i><br>(Note) "New interesting note" to "NULL"', '<b>04/27/2021, 23:29:08</b><br><i>record moved to trash</i>', '<b>04/27/2021, 23:50:08</b><br><i>record restored from trash</i>'], '21565': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21563': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21562': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21561': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21560': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21559': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21558': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21557': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21556': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21555': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21554': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21553': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21552': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21551': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21550': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21549': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21548': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21547': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21545': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21544': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21543': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21542': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21541': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21540': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21539': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21538': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21537': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21536': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21535': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21534': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21533': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21531': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21530': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21529': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21528': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21527': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21526': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21525': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21524': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21522': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21521': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21520': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21519': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21518': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21517': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21516': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21515': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>'], '21514': ['<b>04/27/2021, 23:19:08</b><br><i>record added</i>']}

let history_file = { "file uploaded": "04/27/2021, 23:19:04", "entries": { "21580": { "record added": "04/27/2021, 23:19:08", "edits": [ { "record moved to trash": "04/27/2021, 23:22:44" } ] }, "21565": { "record added": "04/27/2021, 23:19:12", "edits": [] }, "21563": { "record added": "04/27/2021, 23:19:15", "edits": [] }, "21562": { "record added": "04/27/2021, 23:19:18", "edits": [] }, "21561": { "record added": "04/27/2021, 23:19:21", "edits": [] }, "21560": { "record added": "04/27/2021, 23:19:24", "edits": [] }, "21559": { "record added": "04/27/2021, 23:19:27", "edits": [] }, "21558": { "record added": "04/27/2021, 23:19:30", "edits": [] }, "21557": { "record added": "04/27/2021, 23:19:33", "edits": [] }, "21556": { "record added": "04/27/2021, 23:19:36", "edits": [] }, "21555": { "record added": "04/27/2021, 23:19:39", "edits": [] }, "21554": { "record added": "04/27/2021, 23:19:42", "edits": [] }, "21553": { "record added": "04/27/2021, 23:19:44", "edits": [] }, "21552": { "record added": "04/27/2021, 23:19:47", "edits": [] }, "21551": { "record added": "04/27/2021, 23:19:50", "edits": [] }, "21550": { "record added": "04/27/2021, 23:19:52", "edits": [] }, "21549": { "record added": "04/27/2021, 23:19:54", "edits": [] }, "21548": { "record added": "04/27/2021, 23:19:59", "edits": [] }, "21547": { "record added": "04/27/2021, 23:20:02", "edits": [] }, "21545": { "record added": "04/27/2021, 23:20:05", "edits": [] }, "21544": { "record added": "04/27/2021, 23:20:09", "edits": [] }, "21543": { "record added": "04/27/2021, 23:20:13", "edits": [] }, "21542": { "record added": "04/27/2021, 23:20:17", "edits": [] }, "21541": { "record added": "04/27/2021, 23:20:20", "edits": [] }, "21540": { "record added": "04/27/2021, 23:20:24", "edits": [] }, "21539": { "record added": "04/27/2021, 23:20:27", "edits": [] }, "21538": { "record added": "04/27/2021, 23:20:31", "edits": [] }, "21537": { "record added": "04/27/2021, 23:20:35", "edits": [] }, "21536": { "record added": "04/27/2021, 23:20:39", "edits": [] }, "21535": { "record added": "04/27/2021, 23:20:42", "edits": [] }, "21534": { "record added": "04/27/2021, 23:20:46", "edits": [] }, "21533": { "record added": "04/27/2021, 23:20:49", "edits": [] }, "21531": { "record added": "04/27/2021, 23:20:53", "edits": [] }, "21530": { "record added": "04/27/2021, 23:20:57", "edits": [] }, "21529": { "record added": "04/27/2021, 23:21:01", "edits": [] }, "21528": { "record added": "04/27/2021, 23:21:05", "edits": [] }, "21527": { "record added": "04/27/2021, 23:21:09", "edits": [] }, "21526": { "record added": "04/27/2021, 23:21:13", "edits": [] }, "21525": { "record added": "04/27/2021, 23:21:17", "edits": [] }, "21524": { "record added": "04/27/2021, 23:21:21", "edits": [] }, "21522": { "record added": "04/27/2021, 23:21:24", "edits": [] }, "21521": { "record added": "04/27/2021, 23:21:29", "edits": [] }, "21520": { "record added": "04/27/2021, 23:21:32", "edits": [] }, "21519": { "record added": "04/27/2021, 23:21:36", "edits": [] }, "21518": { "record added": "04/27/2021, 23:21:40", "edits": [] }, "21517": { "record added": "04/27/2021, 23:21:44", "edits": [] }, "21516": { "record added": "04/27/2021, 23:21:47", "edits": [] }, "21515": { "record added": "04/27/2021, 23:21:51", "edits": [] }, "21514": { "record added": "04/27/2021, 23:21:55", "edits": [] }, "21513": { "record added": "04/27/2021, 23:21:59", "edits": [] } } }
function historyFile(){
    document.getElementById('file').innerHTML = JSON.stringify(history_file, null, "\t");
}

function binsFile(){
    document.getElementById('file').innerHTML = JSON.stringify(bins, null, "\t");
}

async function snapshotFile(){
    r = await fetch('demo.csv');
    csv = await r.text();
    document.getElementById('file').innerHTML = csv;
}
