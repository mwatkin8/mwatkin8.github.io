class ClassicView{
    constructor(){}

    /**
     * Renders the ClassicView
     *
     * @param {GFF3_File}   gff3    The global instance of the GFF3_File object.
     * @param e
     */
    render(gff3, e){
        let content = global_gff3.classic;
        if (gff3) {
                let newWindow = window.open('/');
                newWindow.onload = () => {
                    newWindow.location = URL.createObjectURL(content);
                };
        }
        else {
            main.selectAll('text').remove();
            main.append('text')
                .attr('stroke', 'black')
                .text('No file uploaded');
        }
    }
}