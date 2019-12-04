function plot_it() {
    
    var pad = 40, svgWidth = 1500, svgHeight = 2000
    d3.select('body').append('svg').attr('width', svgWidth).attr('height', svgHeight).attr('id', 'svg0')

    // history line plot

    history_width = 1000, history_height = 400;
    var hist_plot_select = d3.select('#svg0').append('g').attr('transform', 'translate('+(pad)+','+(pad)+')').attr('id', 'history');
    
    hist_plot_select.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', history_width).attr('height', history_height)
        .attr('fill', d3.hcl(218, 17, 92)) // background fill for history plot


    // reformat data, line for each csv attribute
    // add scales and d3.line()
    line_data = []
    nfl_season_game_team_averages.values.forEach(key1 => { // csv folder
        key1.values.forEach(key2 => { // csv file, line_keys, values => csv rows
            var csv_rows = key2.values
            // get one scale_x for axis
            key2.line_keys.forEach(line_key => { // for each csv attribute
                line_values = csv_rows.map(value => {
                    return {'keyYr': parseInt(value.Year), 'value': value[line_key] == '' ? -1 : parseInt(value[line_key])}
                }).reverse() // chronological order
                line_data.push({
                    'key0': nfl_season_game_team_averages.key0,
                    'key1': key1.key1,
                    'key2': key2.key2,
                    'attribute_key': line_key,
                    'values': line_values,
                    'scale_y': d3.scaleLinear().domain(d3.extent(line_values.map(lin_val => lin_val.value))).range([history_height, 0])
                        .range([history_height, 0])
                })
            })
        })
    })

    var line_scale_x = d3.scalePoint().domain(line_data[1].values.map(d => d.keyYr)).range([0, history_width])

    // categorical color scale based on key 1
    key1_map = {}
    key1_list = Array.from(new Set(line_data.map(datum => datum.key1)))
    key1_list.forEach((key1, i) => { key1_map[key1] = i})
    h_scale = d3.scaleLinear().domain([0, key1_list.length - 1]).range([0, 360])
    var chroma = 60, lum = 50 // c => 0 - 120; l => 0 - 100
    var lines_select = hist_plot_select.selectAll('.lines').data(line_data).enter()

    // d3.line() closure
    function line0(scale_x, scale_y, line_values) {
        var line = d3.line()
            .x(line_value => scale_x(line_value.keyYr))
            .y(line_value => scale_y(line_value.value))
            .defined(line_value => line_value.value != -1) // omit null values,
        return line(line_values) 
    }

    lines_select.append('path')
		.attr('fill', 'None') // TO DO: fill based on keys
		.attr('stroke', datum => {
            //console.log()
            //console.log([h_scale(key1_map[datum.key1]), chroma, lum])
            return d3.hcl(h_scale(key1_map[datum.key1]), chroma, lum)
        })
		.attr('stroke-width', 2)
		.attr('stroke-opacity', .12)
		.attr('class', 'line')
		.attr('d', line_datum => {
			return line0(line_scale_x, line_datum.scale_y, line_datum.values)
        })
        
    hist_plot_select.append('g').attr('id', 'xaxis').attr('transform', 'translate(0,'+(history_height)+')')
    .attr('class', 'axis_bottom')
    .call(d3.axisBottom(line_scale_x))

    hist_plot_select.select("#xaxis").selectAll("text")
        .attr("transform"," translate(-15,15) rotate(-65)") // To rotate the texts on x axis. Translate y position a little bit to prevent overlapping on axis line.
        .style("font-size","10px") //To change the font size of texts

}