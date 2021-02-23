class TypeChart{
    constructor(){
        this.margin = {top: 50, right: 80, bottom: 200, left: 30};
    }

    /**
     * Renders the TypeChart
     *
     * @param {Array[Array]}  ordered  A list of the types and their totals.
     * @param {GFF3_File}     gff3     The global instance of the GFF3_File object.
     */
    render(ordered, gff3) {
        // Add div to DOM
        let divTypeChart = d3.select('.main_content')
            .append('div')
            .classed('type_chart', true);

        // Store svg bounds
        this.svgBounds = divTypeChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 1000 - this.margin.top - this.margin.bottom;

        // Add svg to div
        this.svg = divTypeChart.append('svg')
            .attr('width', this.svgWidth + this.margin.left + this.margin.right)
            .attr('height', this.svgHeight + this.margin.top + this.margin.bottom)
            .classed('typeChart', true);

        if (ordered.length !== 0) {
            // Set up scales and axis
            let max = d3.max(ordered, d => d[1]);

            let typeList = ordered.map(type => type[0]);

            let yScale = d3.scaleBand()
                .domain(typeList)
                .range([this.margin.top, this.svgHeight])
                .padding(.1);

            let xScale = d3.scaleLinear()
                .domain([0, max])
                .range([0, this.svgWidth]);

            // Create Chart Title
            this.svg.append('text')
                .attr('transform', 'translate('  + ((this.margin.left + this.svgWidth) / 2) + ',25)')
                .text('Totals by Type')
                .classed('chart_title', true);

            // Create y axis
            let yAxis = d3.axisLeft()
                .scale(yScale);

            this.svg.selectAll('g').remove();
            let yAxisElements = this.svg.append('g')
                .call(yAxis)
                .attr('transform', 'translate(' + this.margin.left + ',0)')
                .classed('y-axis', true);

            yAxisElements.selectAll('text').remove();
            yAxisElements.selectAll('.tick').remove();

            // Add bars to svg
            let rects = this.svg.selectAll('rect')
                .data(ordered);

            rects.exit().remove();

            rects = rects.enter().append('rect').merge(rects);

            rects
                .attr('x', this.margin.left + 1) // +1 so the bars don't occlude the y-axis.
                .attr('y', d => yScale(d[0]))
                .attr('height', yScale.bandwidth())
                .attr('class', d => d[0] + '_rect')
                .style('fill', '#82A5CE')
                .style('opacity', 0);

            // Mouse over
            rects
                .on('mouseover', d => {
                    let rect = d3.select('.' + d[0] + '_rect');
                    let row = d3.select('.' + d[0] + '_row');
                    rect.classed('highlight', true);
                    row.classed('row_highlight', true);
                })
                .on('mouseout', d => {
                    let rect = d3.select('.' + d[0] + '_rect');
                    let row = d3.select('.' + d[0] + '_row');
                    rect.classed('highlight', false);
                    row.classed('row_highlight', false);
                })
                .on("click", d => {
                    gff3.display_featureList(d,'LocationAscend');
                });

            // Transition
            rects.transition()
                .duration(1500)
                .attr("width", d => {
                    return xScale(d[1])
                })
                .style("opacity", 1);

            //Create labels
            let g = this.svg.append('g').classed('type_g', true);
            let labels = g.selectAll('text')
                .data(ordered);

            labels.exit().remove();

            let new_labels = labels.enter().append('text');
            labels = new_labels.merge(labels);
            labels.attr('x', 35)
                .attr('y', (d, i) => {
                    return i * 20 + 35;
                })

            labels.attr('y', d => yScale(d[0]) + (yScale.bandwidth() + yScale.bandwidth() * 0.1) / 2 + 2)
                .style('stroke', 'black')
                //.attr('text-anchor', 'middle')
                .style('opacity',0)
                .attr('class', d => {
                    return d[0] + '_label';
                })
                .text(d => d[1]);

            labels.transition()
                .duration(1500)
                .attr('x', d => xScale(d[1]) + 35)
                .style('opacity',1)
        }
        else {
            divTypeChart.append('text').text('No features in file for that chromosome.')
        }
    }

    removeChart(){
        d3.select('.type_chart').remove();
    }
}
