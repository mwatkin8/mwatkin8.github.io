class FeatureList{
    constructor(){}

    /**
     * Renders the FeatureList
     *
     * @param {GFF3_File}               gff3    The glpbal instance of the GFF3_File object.
     * @param {String || Array[String]}  data   The type or source used to generate FeatureList. A string from the
     *                                          classic view, or list of string from the summary charts.
     * @param {String}                  sort    User entered string indicating desired sort direction.
     */
    render(gff3,data,sort){

            //Classic parameter is boolean telling whether the launch is from the classic view or summary view
            let that = this;
            let f_list = [];
            let cols = ['Chr', 'Type', 'Source', 'Location'];
            let type = data[0];
            gff3.features_type[type].forEach( f => {
                if (gff3.chr === 'all') {
                    f_list.push(f)
                }
                else{
                    if (f.seqID === gff3.chr){
                        f_list.push(f)
                    }
                }
            });

            //Sorting
            let ordered = Sort(f_list,sort);

            let cluster_div = d3.select('.main_content').append('div')
                .classed('clusterize', true)
                .classed('featureList', true);

            let search_div = cluster_div.append('div').classed('nav_search',true);
            search_div.append('input')
                .attr('type','text')
                .attr('id','searchBar')
                .attr('onkeyup','searchBar(this)')
                .attr('placeholder','Search features..');

            let head_table = cluster_div.append('table')
                .style('border-collapse','collapse')
                .attr('max-height', '50%');
            head_table.append("thead").append("tr").selectAll("th").data(cols)
                .enter().append("th")
                .text(function(d) {
                    return d;
                })
                .attr('width', '25%')
                .attr('class', d => {
                    return d + '_th';
                })
                .style('padding','3px')
                .style('background-color', 'whitesmoke')
                .style('border', '1px solid black')
                .on('click', d => {
                    that.removeList();
                    if (d === 'Chr'){
                        if (gff3.chrAsc){
                            that.render(global_gff3,data,'ChrDescend');
                            gff3.chrAsc = false;
                        }
                        else{
                            that.render(global_gff3,data,'ChrAscend');
                            gff3.chrAsc = true;
                        }
                    }
                    if (d === 'Type'){
                        if (gff3.typeAsc){
                            that.render(global_gff3,data,'TypeDescend');
                            gff3.typeAsc = false;
                        }
                        else{
                            that.render(global_gff3,data,'TypeAscend');
                            gff3.typeAsc = true;
                        }
                    }
                    if (d === 'Source'){
                        if (gff3.sourceAsc){
                            that.render(global_gff3,data,'SourceDescend');
                            gff3.sourceAsc = false;
                        }
                        else{
                            that.render(global_gff3,data,'SourceAscend');
                            gff3.sourceAsc = true;
                        }
                    }
                    if (d === 'Location'){
                        if (gff3.locAsc){
                            that.render(global_gff3,data,'LocationDescend');
                            gff3.locAsc = false;
                        }
                        else{
                            that.render(global_gff3,data,'LocationAscend');
                            gff3.locAsc = true;
                        }
                    }
               });

            //Initialize sorting icons
            let th = d3.selectAll('.Location_th');
            let span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-arrows-v').style('color','#7D7D7D');
            th = d3.selectAll('.Source_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-arrows-v').style('color','#7D7D7D');
            th = d3.selectAll('.Type_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-arrows-v').style('color','#7D7D7D');
            th = d3.selectAll('.Chr_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-arrows-v').style('color','#7D7D7D');

            Icons(sort);

            let scrollArea = cluster_div.append('div')
                .attr('id', 'scrollArea')
                .classed('list_clusterize-scroll', true);
            let cluster_table = scrollArea.append('table')
                .style('border-collapse','collapse');
            let cluster_tbody = cluster_table.append('tbody')
                .attr('id', 'contentArea')
                .classed('clusterize-content', true);

            let tr = cluster_tbody.selectAll('tr').data(ordered);
            tr = tr.enter()
                .append('tr')
                .attr('class', d => {
                    return 'featureList_tr ' + d.source + d.type + d.start + d.end;
                })
                .on('click', d => {
                    gff3.display_details(d);
                });
            let td = tr.selectAll('td').data( d => {
                return cols.map( col => {
                    if (col === 'Chr'){
                        return d.seqID;
                    }
                    if (col === 'Type'){
                        return d.type;
                    }
                    if (col === 'Source'){
                        return d.source;
                    }
                    if (col === 'Location'){
                        return d.start + '-' + d.end;
                    }
                })
            });

            td = td.enter().append('td').merge(td);
            td.exit().remove();

            td.classed('featureList_td', true)
                .attr('align', 'center');

            d3.selectAll('.featureList_td').text(d => {return d})
                .attr('width', '25%')
                .style('padding','3px');
    }

    /**
     * Removes the FeatureList view
     */
    removeList(){
        global_gff3.extra_showing = false;
        global_gff3.extra_details = null;
        d3.selectAll('.extra_tr').remove();
        d3.selectAll('.featureList').remove()
    }
}

/**
     * Changes the sorting icons in the feature list headers depending on what direction the list is sorted already.
     *
     * @param sort  The direction the user wishes to sort the list by
     */
function Icons(sort){
    let th,span;
    switch(sort){
        case 'LocationAscend':
            d3.selectAll('.Location_th > span').remove();
            th = d3.selectAll('.Location_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-numeric-asc').style('color','#7D7D7D');
            return;
        case 'LocationDescend':
            d3.selectAll('.Location_th > span').remove();
            th = d3.selectAll('.Location_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-numeric-desc').style('color','#7D7D7D');
            return;
        case 'SourceAscend':
            d3.selectAll('.Source_th > span').remove();
            th = d3.selectAll('.Source_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-alpha-asc').style('color','#7D7D7D');
            return;
        case 'SourceDescend':
            d3.selectAll('.Source_th > span').remove();
            th = d3.selectAll('.Source_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-alpha-desc').style('color','#7D7D7D');
            return;
        case 'TypeAscend':
            d3.selectAll('.Type_th > span').remove();
            th = d3.selectAll('.Type_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-alpha-asc').style('color','#7D7D7D');
            return;
        case 'TypeDescend':
            d3.selectAll('.Type_th > span').remove();
            th = d3.selectAll('.Type_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-alpha-desc').style('color','#7D7D7D');
            return;
        case 'ChrAscend':
            d3.selectAll('.Chr_th > span').remove();
            th = d3.selectAll('.Chr_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-numeric-desc').style('color','#7D7D7D');
            return;
        case 'ChrDescend':
            d3.selectAll('.Chr_th > span').remove();
            th = d3.selectAll('.Chr_th');
            span = th.append('span').style('float','right');
            span.append('i').attr('class','fa fa-sort-numeric-asc').style('color','#7D7D7D');
            return;
        default:
            return;
    }
}

/**
     * Filters the contents of the feature list by the input of the search bar
     *
     * @param e     the user-entered text to filter by
     */
function searchBar(e) {
    let filter, tr, li, a, i, txtValue;
    filter = e.value.toUpperCase();
    console.log(filter)
    tr = d3.selectAll('.featureList_tr');
    let arr = tr._groups[0];
    arr.forEach( d => {
        txtValue = d.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            d.style.display = "";
        } else {
            d.style.display = "none";
        }
    });
}

/**
     * Calls the sorting functions based on the user request
     *
     * @param f_list    list of features to be sorted
     * @param sort      the type of sort requested by the user
     */
function Sort(f_list,sort){
    switch(sort){
        case 'LocationAscend':
            return f_list.sort(locationAscend);
        case 'LocationDescend':
            return f_list.sort(locationDescend);
        case 'SourceAscend':
            return f_list.sort(sourceAscend);
        case 'SourceDescend':
            return f_list.sort(sourceDescend);
        case 'TypeAscend':
            return f_list.sort(typeAscend);
        case 'TypeDescend':
            return f_list.sort(typeDescend);
        case 'ChrAscend':
            return f_list.sort(chrAscend);
        case 'ChrDescend':
            return f_list.sort(chrDescend);
        default:
            return;
    }
}


/**
 * These functions each sort the list of features depending on the user request
 *
 * @param a
 * @param b
 * @returns {number}
 */
function locationAscend(a,b){
    if (+a.start < +b.start)
        return -1;
    if (+a.start > +b.start)
        return 1;
    return 0;
}

function locationDescend(a,b){
    if (+a.start > +b.start)
        return -1;
    if (+a.start < +b.start)
        return 1;
    return 0;
}

function sourceAscend(a,b){
    if (a.source < b.source)
        return -1;
    if (a.source > b.source)
        return 1;
    return 0;
}

function sourceDescend(a,b){
    if (a.source > b.source)
        return -1;
    if (a.source < b.source)
        return 1;
    return 0;
}

function typeAscend(a,b){
    if (a.type < b.type)
        return -1;
    if (a.type > b.type)
        return 1;
    return 0;
}

function typeDescend(a,b){
    if (a.type > b.type)
        return -1;
    if (a.type < b.type)
        return 1;
    return 0;
}

function chr_to_num(x){
    if (x === 'MT'){
        return 25;
    }
    if(x === 'X'){
       return 50;
    }
    if (x === 'Y'){
        return 100;
    }
    if (isNaN(x)){
        return 150;
    }
    return x;
}
function chrAscend(a,b){
    let x = chr_to_num(a.seqID);
    let y = chr_to_num(b.seqID);
    if (+x < +y)
        return 1;
    if (+x > +y)
        return -1;
    return 0;
}

function chrDescend(a,b){
     let x = chr_to_num(a.seqID);
    let y = chr_to_num(b.seqID);
    if (+x > +y)
        return 1;
    if (+x < +y)
        return -1;
    return 0;
}
