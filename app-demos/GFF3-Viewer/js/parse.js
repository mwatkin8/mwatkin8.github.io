
/**
 * Represents each feature in the file
 *
 * @param {String} id           The ID of the feature as indicated in its attributes field.
 * @param {String} parent       The parent of the feature as indicated in its attributes field.
 * @param {Array[Features]}     seqID   The children of that feature.
 * @param {String} seqID        The ID of the landmark used to establish the coordinate system for the current feature.
 * @param {String} source       The source is a free text qualifier intended to describe the algorithm or operating
 *                              procedure that generated this feature.
 * @param {String} type         The type of the feature (previously called the "method"). This is constrained to be
 *                              either a term from the Sequence Ontology or an SO accession number.
 * @param {String} start        The genomic start location given in positive 1-based integer coordinates, relative to
 *                              the landmark given in column one. Start is always less than or equal to end.
 * @param {String} end          The genomic end location given in positive 1-based integer coordinates, relative to
 *                              the landmark given in column one.
 * @param {String} score        The confidence of the source program in designating the feature
 * @param {String} strand       The strand of the feature. + for positive strand (relative to the landmark), - for
 *                              minus strand, and . for features that are not stranded.
 * @param {String} phase        For features of type "CDS", the phase indicates where the feature begins with
 *                              reference to the reading frame.
 * @param {String} attributes   A list of feature attributes in the format tag=value. Multiple tag=value pairs are
 *                              separated by semicolons.
 */
class Feature {
    constructor(line) {
        this.id = null;
        this.parent = null;
        this.children = [];
        this.seqID = checkNS(line[0]);
        this.source = checkNS(line[1]);
        this.type = checkNS(line[2]);
        this.start = checkNS(line[3]);
        this.end = checkNS(line[4]);
        this.score = checkNS(line[5]);
        this.strand = checkNS(line[6]);
        this.phase = checkNS(line[7]);
        this.attributes = checkNS(line[8]);
    }
}

/**
 * Represents the GFF3 file
 *
 * @param {Dictionary}  features_type      A dictionary of features by type.
 *  * @param {Array[Feature]}  features       A list of feature objects representing each feature in the file
 * @param {Dictionary}  treeData            A dictionary of parent child relationships.
 * @param {Set}         sourceSet           A set of all sources in the file.
 * @param {String}          chr             Designates the chromosome whose features are being displayed. By default is
 *                                         set to display features for 'all' chromosomes.
 * @param {Array[String]}   extra_details  A list of strings representing the attributes of each feature available to
 *                                          view in the detail view.
 * @param {Boolean}         extra_showing   Switch used to toggle the display of extra_details. Default is False.
 * @param {SideBar}         sideBar         An instance of the SideBar class.
 * @param {TypeChart}       typeChart       An instance of the TypeChart class.
 * @param {SourceChart}     sourceChart     An instance of the SourceChart class.
 * @param {FeatureList}     featureList     An instance of the FeatureList class.
 * @param {DetailView}      detailView      An instance of the DetailView class.
 * @param {ClassicView}     classicView     An instance of the ClassicView class.
 * @param {Boolean}         chrAsc          A boolean indicating sort direction for feature list
 * @param {Boolean}         typeAsc          A boolean indicating sort direction for feature list
 * @param {Boolean}         sourceAsc          A boolean indicating sort direction for feature list
 * @param {Boolean}         locAsc          A boolean indicating sort direction for feature list

 */
class GFF3_File {
    constructor() {
        this.features_type = null;
        this.features = [];
        this.treeData = {};
        this.sourceSet = new Set();
        this.chr = 'all';
        this.extra_details = null;
        this.extra_showing = false;
        this.classic = null;
        this.sideBar = new SideBar();
        this.sourceChart = new SourceChart();
        this.typeChart = new TypeChart();
        this.treeChart = new TreeChart();
        this.featureList = new FeatureList();
        this.detailView = new DetailView();
        this.classicView = new ClassicView();
        this.chrAsc = false;
        this.typeAsc = false;
        this.sourceAsc = false;
        this.locAsc = true;
    }

    setFeatures(type) {
        this.features_type = type;
    }

    /**
     * Calculates the total number of features for a given field in the file.
     *
     * @param   {String}  field   A String referring to the field in the file to calculate totals for.
     * @returns {Dict}    dict    A dictionary of instances of the designated field as the key and their totals as
     *                            the value.
     */
    calculate_type_totals() {
        let dict = {};
        Object.keys(global_gff3.features_type).forEach(d => {
            if (global_gff3.chr === 'all') {
                dict[d] = global_gff3.features_type[d].length;
            }
            else {
                global_gff3.features_type[d].forEach(f => {
                    if (f.seqID === global_gff3.chr) {
                        if (d in dict) {
                            dict[d] = dict[d] + 1;
                        }
                        else {
                            dict[d] = 1;
                        }
                    }
                })
            }
        });
        return dict;
    }

    /**
     * Calculates the number of features from each souce for each feature in the features_type dictionary
     */
    calculateSourceTotalsByType() {
        let dict = {};
        for (let type of Object.keys(global_gff3.features_type)) {
            if (global_gff3.chr === 'all') {
                let sourceList = [...global_gff3.sourceSet];

                // Create source dictionary
                let sourceDict = {}
                for (let source of [...global_gff3.sourceSet])
                    sourceDict[source] = 0;

                // Increment counts for each source and calculate ratio
                for (let feature of global_gff3.features_type[type]) {
                    sourceDict[feature.source.toLowerCase()] += 1;
                }
                for (let source of sourceList)
                    sourceDict[source] = +(sourceDict[source] / global_gff3.features_type[type].length).toFixed(2);

                sourceDict['total'] = global_gff3.features_type[type].length;
                dict[type] = sourceDict;
            } else {
                let featureCount = 0;
                let sourceList = [...global_gff3.sourceSet];

                // Create source dictionary
                let sourceDict = {}
                for (let source of [...global_gff3.sourceSet])
                    sourceDict[source] = 0;

                for (let feature of global_gff3.features_type[type]) {
                    // increment counts for each source for the correct seqID.
                    if (feature.seqID === global_gff3.chr) {
                        featureCount += 1;
                        sourceDict[feature.source.toLowerCase()] += 1;
                    }
                }

                for (let source of sourceList)
                    sourceDict[source] = +(sourceDict[source] / featureCount).toFixed(2);
                sourceDict['total'] = featureCount;
                dict[type] = sourceDict;
            }
        }
        return dict;
    }

    /**
     * Renders the SideBar
     */
    display_sideBar(){
        d3.selectAll('.return').remove();
        this.sideBar.render(global_gff3);
    }


    /**
     * Renders the SourceChart which contains the relative source abundances.
     */
    display_sourceChart(){
        this.sourceChart.removeChart();
        let typeSourceDict = this.calculateSourceTotalsByType();

        let typeSourceArray = Object.entries(typeSourceDict);

        // Sort array in descending order, similar to the type bar chart.
        typeSourceArray.sort(function(a, b) {
            return b[1].total - a[1].total;
        });

        // Remove the total attribute to make displaying the stacked bar chart easier.
        for (let type of typeSourceArray) {
            delete type[1].total;
        }

        // Get source list for scales in sourceChart.
        let sourceList = [...global_gff3.sourceSet];
        sourceList.sort(function(a, b) {
            return a < b ? -1 : 1;
        })

        this.sourceChart.removeChart();
        this.sourceChart.render(typeSourceArray, sourceList);
    }

    /**
     * Renders the TypeChart with filtered types and totals.
     */
    display_typeChart(){
        let ordered = filterByNum(this.calculate_type_totals(), 'descend');
        this.typeChart.removeChart();
        this.typeChart.render(ordered, this);
    }

    /**
     * Renders the FeatureList
     *
     * @param {Boolean}                 classic A boolean value indicating whether the FeatureList is accepting input
     *                                          from the classic view or from the summary charts.
     * @param {String || Array[String]}  data   The type or source used to generate FeatureList. A string from the
     *                                          classic view, or list of string from the summary charts.
     */
    display_featureList(data,sort){
        //Classic parameter is boolean telling whether the launch is from the classic view or summary view
        addSummaryReturn();
        this.sourceChart.removeChart();
        this.typeChart.removeChart();
        this.detailView.removeView();
        this.featureList.removeList();
        this.detailView.render(global_gff3.treeData);
        d3.select('.loading').style('visibility','visible');
        this.featureList.render(global_gff3,data,sort);
        d3.select('.loading').style('visibility','hidden');
    }

    /**
     * Renders the DetailView
     *
     * @param {Boolean}             classic A boolean value indicating whether the FeatureList is accepting input
     *                                      from the classic view or from the summary charts.
     * @param {Feature || String}   d       A feature if from FeatureList or String if from classic view.
     */
    display_details(data){
        addSummaryReturn();
        this.detailView.update(global_gff3,data)
    }
}

let global_gff3 = null;

/**
 * Checks whether a field has a '.' which indicates it is an unspecified value in the file.
 *
 * @param {String}      val The String from the file being checked.
 * @returns {String}    val Either the original String or a new String designating the field as 'Not Specified'.
 */
function checkNS(val){
    if (val === '.'){
        val = 'Not Specified'
    }
    return val
}

/**
 * Reads the file from the HTML page
 *
 * @param e
 */
function readSingleFile(e) {
    let file = e[0];
    if (!file) {
       initialize();
        return;
    }
    let reader = new FileReader();
    reader.onload = function(e) {
        let contents = e.target.result;
        parseContent(contents);
        global_gff3.display_sideBar();
        global_gff3.display_sourceChart();
        global_gff3.display_typeChart();
    };
    reader.onloadstart = function(){
        d3.select('.initial').remove();
        d3.select('.loading').style('visibility','visible');
    };
    reader.onloadend = function() {
        d3.select('.loading').style('visibility','hidden');
    };
    reader.readAsText(file);
}

/**
 * Filters a dictionary numerically
 *
 * @param {Dict}            dict        A dictionary of types or sources as the keys and totals as the values.
 * @param {String}          direction   Direction to sort 'ascending' or 'descending'.
 * @returns {Array[String]} a           A list of the sorted values.
 */
function filterByNum(dict, direction){
    let a = [];
    for (let key in dict) {
        a.push([key, dict[key]]);
    }
    if (direction === 'ascend'){
        a.sort(function(a, b) {
            return a[1] - b[1];
        });
    }
    else if (direction === 'descend'){
        a.sort(function(a, b) {
            return b[1] - a[1];
        });
    }
    else{
        a = 'error in filtering by number'
    }
    return a
}


/**
 * Adds a link to the side bar to return to the summary chart view.
 */
function addSummaryReturn(){
    d3.selectAll('.return').remove();
    let side = d3.select('.side_bar');
    side.append('hr').classed('return',true);
    let div = side.append('div').classed('side_content',true).classed('return',true)
        .on('click', d => {
            backToSumnmary();
        });
    div.append('b').text('Return to Summaries');
}

/**
 * Expands the attributes for a feature which are hidden by default in the DetailView. Called by a button in the HTML.
 */
function showExtra(){
    let table = d3.select('.extra_table');

        if (global_gff3.extra_showing === false) {
            global_gff3.extra_showing = true;
            table.style('visibility', 'visible');
            d3.select('.extra_button').text('Hide Additional Details');
            let tr = table.selectAll('tr').data(global_gff3.extra_details);
            tr = tr.enter()
                .append('tr')
                .attr('class', d => {
                    return 'extra_tr ';
                });
            let td = tr.append('td');
            td.classed('extra_td', true)
                .text(d => {
                    return d
                }).style('padding', '3px');
        }
        else {
            global_gff3.extra_showing = false;
            table.style('visibility', 'hidden');
            d3.select('.extra_button').text('View Additional Details')
        }

}

/**
 * Changes the chr field of the global GFF3_File object and updates the views.
 *
 * @param e
 */
function changeChr(e){
    global_gff3.sourceChart.removeChart();
    global_gff3.typeChart.removeChart();
    global_gff3.featureList.removeList();
    global_gff3.detailView.removeView();
    global_gff3.chr = e.value.split('chr')[1];
    global_gff3.display_sideBar();
    global_gff3.display_sourceChart();
    global_gff3.display_typeChart();
}

/**
 * Updates the views in response to a click on the link added by addSummaryReturn()
 */
function backToSumnmary(){
    if (global_gff3) {
        d3.selectAll('.return').remove();
        global_gff3.featureList.removeList();
        global_gff3.detailView.removeView();
        global_gff3.display_sideBar();
        global_gff3.display_sourceChart();
        global_gff3.display_typeChart();
    }
}

/**
 * Parses the file contents into features and lists used in the views.
 *
 * @param {String}  contents    The String to be parsed from the file.
 */
function parseContent(contents) {
    let list = contents.split('\n');
    global_gff3.classic = new Blob([contents], {type: 'text/plain'});

    let features_type = {};
    let sourceSet = new Set();

    list.forEach( d => {
        d = d.split('\t');
        if (d[0][0]) {
            if (d[0][0] !== '#') {
                let type = d[2];
                let src = checkNS(d[1]);

                type = d[2];

                // Update set of sources.
                sourceSet.add(checkNS(d[1]).toLowerCase());

                // Update feature list.
                let f = new Feature(d);
                if (type in features_type){
                    features_type[type].push(f);
                }
                else{
                    features_type[type] = [f]
                }
                
                try {
                    buildTreeData(d, f);
                }
                catch{}
                global_gff3.features.push(f);
            }
        }
    });
    global_gff3.setFeatures(features_type);

    // Order source set.
    let sourceList = [...sourceSet];
    sourceList.sort(function(a, b) {
        return a < b ? -1 : 1;
    })

    for (let source of sourceList)
        global_gff3.sourceSet.add(source);
}

/**
 * Identifies parent-child relationships
 *
 * @param d     the attributes field of a feature
 * @param f     a feature
 */
function buildTreeData(d, f){
    let re = new RegExp('ID=\\w+:\\w+');
    f.id = re.exec(d[8])[0].split('=')[1];
    re = new RegExp('Parent=\\w+:\\w+');
    f.parent = re.exec(d[8])[0].split('=')[1];
    if (f.parent in global_gff3.treeData){
        global_gff3.treeData[f.parent].push(f);
    }
    else{
        global_gff3.treeData[f.parent] = [f];
    }
}


/**
 * Renders the ClassicView
 *
 * @param e
 */
function classicView(e){
    if(global_gff3) {
        global_gff3.classicView.render(global_gff3,e);
    }
}

/**
 * Handles the file change event by initializing objects and views and calling readSingleFile()
 * @param file
 */
function handleFile(file){
    if(global_gff3 !== null || file.length === '0'){
        global_gff3.sideBar.removeBar();
        global_gff3.detailView.removeView();
        global_gff3.sourceChart.removeChart();
        global_gff3.typeChart.removeChart();
        global_gff3.featureList.removeList();
        readSingleFile(file);
    } else {
        global_gff3 = new GFF3_File();
        readSingleFile(file);
    }
}

/**
 * Provides landing content for page including video and explanation of the tool.
 *
 */
function initialize(){
    let initial = d3.select('.main_content').append('div').classed('initial',true).style('padding','10px');

    initial.append('p').text('This viewer is designed to provide users with a high-level overview of valid GFF3 files. ' +
        'The specification for GFF3 files can be found ')
        .append('a').attr('href','https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md')
        .text('here');

    initial.append('p').text('Upload a file to begin analysis.');

    initial.append('p').text('A detailed video tutorial can be found below');
    initial.append('iframe')
        .attr('width','420')
        .attr('height','315')
        .attr('src','https://www.youtube.com/embed/IZTRyp9nVXI');


    initial.append('p').text('A design process document can be found ')
        .append('a').attr('href','../Process_Book.pdf').text('here');
}
