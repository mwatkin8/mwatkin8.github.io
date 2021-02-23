class TreeChart {
    constructor() {
        this.margin = {top: 10, right: 10, bottom: 10, left: 10};

    }

    /*
     * Create node/edge structure and render tree layout.
     */
    createTree (treeData) {

    }

    render (treeData) {
        // Add div to DOM
        let divTreeChart = d3.select('.main_content')
            .append('div')
            .classed('tree_chart', true);

        // Store svg bounds
        this.svgBounds = divTreeChart.node().getBoundingClientRect();
        this.svgWidth = 700 - this.margin.left - this.margin.right;
        this.svgHeight = 300 - this.margin.top - this.margin.bottom;

        // Add svg to div
        this.svg = divTreeChart.append('svg')
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight);

        // Add border for tree
        this.svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.margin.left + this.margin.right + this.svgWidth)
            .attr('height', this.margin.top + this.margin.bottom + this.svgWidth)
            .style('stroke', 'gray')
            .style('fill', 'none')
            .style('stroke-width', 1)
    }

    removeChart() {
        d3.select('.tree_chart').remove();
    }
}
