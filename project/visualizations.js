function plot_it() {
    var pad = 40, svgWidth = 1000, svgHeight = 1000
    d3.select('body').append('svg').attr('width', svgWidth).attr('height', svgHeight).attr('id', 'svg0')

    // history
    
    d3.select('#svg0').append('g').attr('transform', 'translate('+(pad)+','+(pad)+')').attr('id', 'history')

    var lineScaleX = d3.scaleLinear().domain()

    var line = d3.line()

}