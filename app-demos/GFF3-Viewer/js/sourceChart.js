// TODO how to make the tooltip appear to the right of the bar.
// Axis are not updating appropriately.
// Want to select specific source for detailed list. Currently sending all features of a specific type.

/**
 * Chart that displays the source make up for each type in the GFF3 file as a stacked bar chart.
 */
class SourceChart {
    constructor () {
        this.margin = {top: 50, right: 20, bottom: 200, left: 160};
    }

    tooltip_render (tooltip_data, colorArray) {
        let sourceArray = Object.entries(tooltip_data.data);

        let text = "<h3 class = tooltip-tile>Sources</h3> ";
        text += "<ul>";
        sourceArray.forEach((source, i) => {
            let sourcePercentage = (source[1] * 100).toFixed(0);
            //text += "<li class = " + this.chooseClass(row.party)+ ">"
            text += "<li style=color:" + colorArray[i] + ">"
                + source[0] + ":\t\t" + sourcePercentage + "%"
                + "</li>";
        })

        return text;
    }

    render (sourceCountsByType, sourceList) {

        function colorSelector(domain, colorPalette) {
            return domain.length < colorPalette.length ? colorPalette.slice(0, domain.length) : colorPalette;
        }

        // Add div to DOM
        this.divSourceChart = d3.select('.main_content')
            .append('div')
            .classed('source_chart', true);

        // Store svg bounds
        this.svgBounds = this.divSourceChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 1000 - this.margin.top - this.margin.bottom;

        // Add svg to div
        this.svg = this.divSourceChart.append('svg')
            .attr('width', this.svgWidth + this.margin.left + this.margin.right)
            .attr('height', this.svgHeight + this.margin.top + this.margin.bottom)
            .classed('sourceChart', true);

        let that = this;


        // Data prep
        let typeList = [];
        let sourceCounts = [];
        for (let typeObject of sourceCountsByType) {
            typeList.push(typeObject[0]);
            sourceCounts.push(typeObject[1]);
        }

        // Set up scales and axis
        let xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([this.margin.left, this.margin.left + this.svgWidth]);

        let widthScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.svgWidth]);

        let typeScale = d3.scaleBand()
            .domain(typeList)
            .range([this.margin.top, this.svgHeight])
            .padding(.1);

        let colorScale = d3.scaleOrdinal()
            .domain(sourceList)
            .range(colorSelector(sourceList, d3.schemeCategory10));

        // Setup tooltip
        this.tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction('s')
            .html(function () {
                return [0, 0];
            });

        this.tip.html(d => this.tooltip_render(d, colorSelector(sourceList, d3.schemeCategory10)));

        // Stack layout
        let stack = d3.stack()
            .keys(sourceList);

        let series = stack(sourceCounts);

        // Add title to Source Chart
        this.svg.append('text')
            .attr('transform', 'translate(' + ((this.margin.left + this.margin.right + this.svgWidth) / 2) + ',25)')
            .text('Sources by Type')
            .classed('chart_title', true);

        // Add bars to svg
        let groups = this.svg.selectAll('g.type')
            .data(series);

        groups.exit().remove();

        groups = groups.enter().append('g').merge(groups);

        groups
            .style('fill', d => colorScale(d))
            .attr('class', (d, i) => sourceList[i]);


        // Source Stacked Bar Chart
        let rects = groups.selectAll('rect.source')
            .data(d => d);

        rects.exit().remove();

        rects = rects.enter().append('rect').merge(rects);

        rects
            .attr('x', this.margin.left)
            .attr('y', (d, i) => typeScale(typeList[i]))
            .style('opacity', 0)
            .attr('class', (d, i) => {
                return typeList[i] + '' +  ' sourceRect';
            });

        rects
            .transition()
            .duration(1500)
            .attr('x', d => xScale(d[0]))
            .attr('height', typeScale.bandwidth())
            .attr('width', d => {
                return widthScale(d[1] - d[0]);
            })
            .style('opacity', 1);

        // Rect Mouseover
        //let that = this;
        rects.call(this.tip);

        rects
            .on('mouseover', this.tip.show)
        /*
            .on('mouseover', (d, i) => {
                let type = typeList[i];
                let rects = d3.select('.' + type);
                rects.classed('highlight', true);
                console.log(type);
                console.log(rects);
            })
            */
            .on('mouseout', this.tip.hide)
        /*
            .on('mouseout', (d, i) => {
                let type = typeList[i];
                let rects = d3.select('.' + type);
                rects.classed('highlight', false);
                console.log(type);
            });
                */
            .on('click.tip', this.tip.hide)
            .on('click.detail', (d, i) => {
                let type = typeList[i];
                global_gff3.display_featureList([type, global_gff3.features_type[type].length], 'LocationAscend');
            });

        // Type Axis
        let typeAxis = d3.axisLeft()
            .scale(typeScale);


        this.svg.append('g')
            .call(typeAxis)
            .attr('transform', 'translate(' + this.margin.left + ',0)')
            .classed('axis', true);


        // Legend
        let rectWidth = 20;
        let rectHeight = 20;
        let rectPadding = 4;
        let rectTopOffset = 40;
        let rectCount = 0;
        let textSize = 14;

        let legendGroups = this.svg.selectAll('g.legend')
            .data(sourceList);

        legendGroups.exit().remove();

        legendGroups = legendGroups.enter().append('g').merge(legendGroups)

        legendGroups
            .style('fill', d => colorScale(d))
            .classed('legend', true);

        let legendRects = legendGroups.selectAll('rect')
            .data(d => [d]);

        legendRects.exit().remove();

        legendRects = legendRects.enter().append('rect').merge(legendRects);

        legendRects
            .attr('x', d => {
                rectCount++;
                return this.margin.left + (rectWidth + rectPadding) * (rectCount - 1);
            })
            .attr('y', this.svgHeight + 20)
            .attr('width', rectWidth)
            .attr('height', rectHeight);

        rectCount = 0;

        let legendText = legendGroups.selectAll('text')
            .data(d => [d]);

        legendText.exit().remove();

        legendText = legendText.enter().append('text').merge(legendText);

        legendText
            .style('text-anchor', 'start')
            .attr('transform', (d, i) => {
                rectCount++;
                let x = this.margin.left + (rectWidth + rectPadding + 2) * (rectCount - 1);
                let y = this.svgHeight + rectHeight + 20 + textSize / 2;
                return 'translate(' + x + ',' + y + ') rotate(45)';
            })
            .text(d => d);

    }

    removeChart(){
        d3.select('.source_chart').remove();
    }

}
