function plot_it() {
    
    var pad = 40, svgWidth = 1000, svgHeight = 2000
    d3.select('body').append('svg').attr('width', svgWidth).attr('height', svgHeight).attr('id', 'svg0')

    // history line plot

    history_width = 1000, history_height = 400;
    var hist_plot_select = d3.select('#svg0').append('g').attr('transform', 'translate('+(pad)+','+(pad)+')').attr('id', 'history');
    
    hist_plot_select.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', history_width).attr('height', history_height)
        .attr('fill', d3.hcl(218, 17, 92)) // background fill for history plot

    
    var lines_select = hist_plot_select.selectAll('.lines').data(nfl_season_game_team_averages);
    // var lineScaleX = d3.scaleLinear().domain()

    var line = d3.line()
		.x(d => line_scale_x(d.key))
		.y(d => line_scale_y(d.state))

}