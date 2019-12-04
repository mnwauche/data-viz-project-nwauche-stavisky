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

    //construct scales for each attribute of each key2 of each key1,
    //reformat data, line for each csv attribute
    line_data = []
    nfl_season_game_team_averages.values.forEach(key1 => { // csv folder
        key1.values.forEach(key2 => { // csv file, line_keys, values => csv rows
            var csv_rows = key2.values
            line_values = csv_rows.map(value => {
                    return {'key': value.Year, 'value': value[line_key]}
                }).reverse() // chronological order
            key2.line_keys.forEach(line_key => { // for each csv attribute
                line_data.push({
                    'key0': nfl_season_game_team_averages.key0,
                    'key1': key1.key1,
                    'key2': key2.key2,
                    'attribute_key': line_key,
                    'values': line_values,
                    'scale_x': d3.scalePoint().domain(line_values.map(d => d.Year)).range([0, history_width]),
                    'scale_y': d3.scaleLinear().domain(d3.extent(line_values.map(d => ))).range([history_height, 0])
                })
            })
        })
    })

    time_scale_x = d3.scaleLinear().domain().range()
    var lineScales = {};
    
    var lines_select = hist_plot_select.selectAll('.lines').data(line_data).enter()
    // var lineScaleX = d3.scaleLinear().domain()

    var line = d3.line()
		.x(d => d.scale_x(d.key))
        .y(d => d.scale_y(d.state))
        
    lines_select.append('path')
		.attr('fill', 'None')
		.attr('stroke', 'gray')
		.attr('stroke-width', 1)
		.attr('stroke-opacity', .15)
		.attr('class', 'lines')
		.attr('d', line_datum => {
			return line(line_datum)
		})

    

}