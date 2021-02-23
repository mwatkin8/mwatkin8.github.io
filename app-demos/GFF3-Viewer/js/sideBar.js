class SideBar{
    constructor(){}

    /**
     * Renders the SideBar
     *
     * @param {GFF3_File}   gff3    The global instance of the GFF3_File object.
     */
    render(gff3){
        d3.select('.chr_select').style('visibility','visible');
        d3.select('.side_bar').selectAll('table').remove()
        d3.selectAll('.return').remove()
        let table = d3.select('.side_bar').append('table');
        let types = gff3.calculate_type_totals();

        if (types.length === 0){
            side.append('text').text('No features for ' + gff3.chr);
        }
        else {
            //Put the types in descending order
            types = filterByNum(types, 'descend');
            let tr = table.selectAll('tr')
                .data(types);
            tr = tr.enter()
                .append('tr')
                .attr('class', d => {
                    let c = d[0] + '_row'
                    return c
                });
            let td = tr.append('td');
            td.text(d => {
                let display = d[0] + ' (' + d[1] + ')';
                return display;
            })
                .classed('side_content', true)
                .on('click', d => {
                    gff3.display_featureList(d,'LocationAscend');
                })
                .on('mouseover', d => {
                    let c = '.' + d[0] + '_rect';
                    let rect = d3.select(c);
                    c = '.' + d[0] + '_row';
                    let row = d3.select(c);
                    c = '.' + d[0] + '_label';
                    let label = d3.select(c);
                    rect.classed('highlight', true);
                    row.classed('row_highlight', true);
                    label.classed('highlight', true);
                })
                .on('mouseout', d => {
                    let c = '.' + d[0] + '_rect';
                    let rect = d3.select(c);
                    c = '.' + d[0] + '_row';
                    let row = d3.select(c);
                     c = '.' + d[0] + '_label';
                    let label = d3.select(c);
                    rect.classed('highlight', false);
                    row.classed('row_highlight', false);
                    label.classed('highlight', false);
                });
        }
    }

    removeBar(){
        d3.select('.chr_select').style('visibility','hidden');
        d3.select('.side_bar').selectAll('table').remove()
        d3.selectAll('.return').remove()
    }
}
