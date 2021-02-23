class DetailView{
    constructor(){}
    
    /**
     * This function takes as input an array of id's and their corresponding children and
     * creates a tree map.
     *
     * @typeRelations   -   An array of id's and their children.
     */
    updateTree(typeRelations, d) {
        // Check if an entry is selected.
        this.svg.selectAll('g').remove();
        if (d) {

            // Transform tree data
            let featureSet = new Set();
            let data = [];
            //let rootID = Object.keys(typeRelations)[0];
            let rootID = d.type;
            data.push({
                name: rootID,
                parent: '',
            });

            // Check that the item has a parent
            /*
            if (!(d.id in typeRelations))
                return;
                */

            try {
                for (let feature of typeRelations[d.id]) {
                    if (!(featureSet.has(feature.id.split(':')[0])))
                        data.push({
                            name: feature.id.split(':')[0],
                            parent: rootID
                        });
                    featureSet.add(feature.id.split(':')[0]);
                }
            } catch {
                let name = 'Name: ' + d.name;
                let chr = 'chr:' + d.seqID;
                let type = 'Type: ' + d.type;
                let location = 'Location: ' + d.start + ' - ' + d.end;
                let errorMessage = 'No tree available for this feature!';
                let info = [name, chr, type, location, errorMessage];

                let textGroup = this.svg.selectAll('g')
                    .data(info)
                    .enter().append('g');

                textGroup.append('text')
                    .attr('x', 10)
                    .attr('y', (d, i) => i * 20)
                    .text(d => d)
                    .classed('tree_no_display', true)
                    .attr('font-size', '20px')
                    .attr('fill', 'black');

                return;
            }

            // Convert to hierchical data
            let root = d3.stratify()
                .id(d => d.name)
                .parentId(d => d.parent)
                (data);/*.sort(function(a, b) {
                return a.id < b.id ? -1 : 1;
            );
            */

            // Build and dispaly tree
            let treeMap = d3.tree().size([this.svgHeight, this.svgWidth]);
            let treeData = treeMap(root);

            root.x0 = this.svgHeight / 2;
            root.y0 = 0;

            let nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            nodes.forEach(d => {d.y = d.depth * 180});

            let node = this.svg.append('g').attr('id', 'tree')
                .selectAll('.node')
                .data(nodes);

            let nodeEnter = node.enter().append('g')
                .attr('transform', d => {
                    return 'translate(' + (d.y + this.adjust)  + ',' + d.x + ')';
                });

            /*
            nodeEnter.append('ellipse')
                .attr('cx', d => margin.left + d.y)
                .attr('cy', d => margin.top + d.x)
                .attr('rx', 80)
                .attr('ry', 40)
                .style('fill', 'gray')
                .style('opacity', 0.25)
                .classed('node', true);
                */

            nodeEnter.append('circle')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .attr('r', 40)
                .style('fill', '#7ABAFA')
                .style('opacity', 1)
                .classed('node', true);
                
            nodeEnter.append('text')
                //.attr('x', d => d.children ? -13 : 13)
                .attr('x', 0)
                .attr('dy', '.35em')
                //.attr('text-anchor', d => d.children ? 'end' : 'start')
                .attr('text-anchor', 'middle')
                .style('font-weight', 'bold')
                .text(d => d.id);

            // Links
            let link = d3.select('#tree').selectAll('path.link')
                .data(links);

            let linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', d => diagonal(d, d.parent))
                .attr('transform', d => { 
                    return 'translate('+ this.adjust + ',0)';
                });
        }
        // Function for drawing link paths.
            function diagonal(s, d) {

            let path = `M ${s.y} ${s.x}
                        C ${(s.y + d.y) / 2} ${s.x},
                          ${(s.y + d.y) / 2} ${d.x},
                          ${d.y} ${d.x}`

            return path;
            }
    }


    /**
     * Renders the DetailView
     *
     * @param {Feature || String}   d       A feature if from FeatureList or String if from classic view.
     */
    render(typeRelations){
        let main = d3.select('.main_content');
        this.detail_div = d3.select('.detail_div');
        if (this.detail_div.empty())
            this.detail_div = main.append('div')
                .attr('height', '500px')
                .attr('width', '1000px')
                .classed('detail_div', true);
        else
            this.detail_div = d3.select('.detail_div');
        
        // Add div to DOM
        let divTreeChart = this.detail_div
            .append('div')
            .classed('tree_chart', true);

        // Store svg bounds
        let margin = {top: 40, right: 160, bottom: 40, left: 160};
        let svgBounds = divTreeChart.node().getBoundingClientRect();
        this.svgWidth = 600;// - margin.left - margin.right;
        this.svgHeight = 800;// - margin.top - margin.bottom;
        this.adjust = 200;//100

        // Add svg to div
        this.svg = divTreeChart.append('svg')
            .attr('width', this.svgWidth)// + margin.left + margin.right)
            .attr('height', this.svgHeight)// + margin.top + margin.bottom);

        // Add border for tree
        this.svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.svgWidth)// + margin.left + margin.right)
            .attr('height', this.svgHeight)// + margin.top + margin.bottom)
            .style('stroke', 'gray')
            .style('fill', 'none')
            .style('stroke-width', 1)


        this.detail_div.append('i').append('h4').classed('source_score', true).text('\n');
        let extra_div = this.detail_div.append('div')
            .attr('height', '300px')
            .attr('width', '200px')
            .style('display','inline-block')
            .classed('extra_div', true).text('\n');
        extra_div.append('button')
            .attr('onclick', 'showExtra()')
            .classed('extra_button', true)
            .text('View Additional Details');
        extra_div.append('table')
            .attr('width', '100%')
            .attr('height', '300%')
            .classed('extra_table', true)
            .style('visibility', 'hidden')
            .style('display','inline-block');

    }

    update(gff3,d){
        let name = '';
        let content = d.attributes.split(';');

        content.forEach( l => {
            if (l.split('=')[0] === 'Name'){
                name = l.split('=')[1]
            }
        });
        if (name === ''){
            name = d.type;
        }
        let chr_loc = 'Location: chr' + d.seqID + ' [' + d.start + '-' + d.end + ']'
        let source_score = 'Source: ' + d.source + '\nScore: ' + d.score;
        d3.select('.name').text(name);
        d3.select('.chr_loc').text(chr_loc);
        d3.select('.source_score').text(source_score);
        gff3.extra_details = content;

        this.updateTree(global_gff3.treeData, d);

    }

    /**
     * Removes the DetailView
     */
    removeView(){
        d3.selectAll('.detail_div').remove()
    }

}


