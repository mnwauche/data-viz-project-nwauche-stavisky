function show_hover(line_data, line_scale_x, key1_legend_rects, height, mouse_per_lines, key1_map, hue_scale, chroma, lum){
    d3.selectAll('.hoverrect').on('mousemove', function(d, i) {
        var mouse_pos = d3.mouse(this)
        var floor_yr = Math.floor(line_scale_x.invert(mouse_pos[0]))
        var quantized_year_pos = line_scale_x(floor_yr)
        //remove and update linetick
        d3.select('#svg0').selectAll('.linetick').remove()
        d3.select('#history').append('line').attr('class', 'linetick')
            .attr('fill', 'None').attr('stroke', d3.hcl(40, 80, 20)) //reddish hue
            .attr('stroke-width', 1.5).attr('x1', quantized_year_pos)
            .attr('x2', quantized_year_pos).attr('y1', 0).attr('y2', height)
        // remove and update line markers for selected lines with valid values for the year
        mouse_per_lines.selectAll('.hovermark').remove()
        var mpl_filtered = mouse_per_lines.filter(function (d, i) { //groups for circles marks,  data is line_data
                //console.log(d3.select('#legend').selectAll('rect').filter('.selected').data().length)
                //console.log([d3.select('#legend').selectAll('rect').filter('.selected').data().includes(d.key1), d.values.find(d => d.keyYr == floor_yr).value != -1])
                found = d.values.find(d => d.keyYr == floor_yr)
                return d3.select('#legend').selectAll('rect').filter('.selected').data().includes(d.key1) && found && found.value != -1
            })

        mpl_filtered.attr('transform',line => 'translate('+quantized_year_pos+', '+line.scale_y(line.values.find(elem => elem.keyYr == floor_yr).value)+')')
        console.log(mpl_filtered.size())

        
        mpl_filtered.append('circle').attr('class', 'hovermark').attr('r', 7)
            .style('stroke', d => d3.hcl(hue_scale(key1_map[d.key1]), chroma, lum))
            .style('stroke-width', '2px').attr('cx', 0).attr('cy', 0)
            .attr('fill', '#F1F3F3')
            .attr('opacity', 1)

        mpl_filtered.append('text').attr('class', 'hovermark').text(line => { 
            return line.attribute_key+' '+line.scale_y(line.values.find(elem => elem.keyYr == floor_yr).value) 
        }).attr('x', 20).attr('font-size', '10px')
    })
//     d3.select('#history').append('rect').attr('class', 'hoverrect')
//     .attr('fill', 'None').attr('pointer-events', 'all').attr('width', width)
//     .attr('height', height)

//     d3.selectAll('.hoverrect').on('mousemove', function(d, i) {
//         var mouse_pos = d3.mouse(this)
//         var x_pos  = line_scale_x.invert(mouse_pos[0])
//     })
//     all_lines.on('mouseover', function(d){
//         d3.select(this).attr
//     }
}

function key1_legend_click(key1_rects, all_lines, hue_scale, key_map, chroma, lum)  {
	key1_rects.on('click', function(key1)  {
		var is_selected = d3.select(this).classed('selected');
		// var fill_color = is_classed ? d3.hcl(0,0,30) : d3.hcl(hue_scale(species_type),40,65)
        // update clicked rect class and stroke
        d3.select(this).attr('stroke', is_selected ? 'none' : 'black').classed('selected', !is_selected); 

        // show only selected lines 
        // unless none are selected (show all)
        var selected_rects = d3.select('#legend').selectAll('rect').filter('.selected')
        selected_key1 = selected_rects.data()
        //console.log(selected_rects.data())//.size())
        //console.log(key1)
        // on select, highlight lines of selected key
        var all_select = all_lines.filter(line => selected_key1.includes(line.key1))
            .attr('stroke-width', 2).attr('stroke-opacity', .12) // highlight => stroke-width 2 stroke-opacity .3
            .attr('stroke', datum => d3.hcl(hue_scale(key_map[datum.key1]), chroma, lum))
        // on select, all non_selected lines => stroke = 'none', unless none are selected??
        //console.log(selected_key1)
        //console.log(d3.select('#legend').selectAll('rect').data().filter(data => !selected_key1.includes(data)))
        var non_select = all_lines.filter(line => !selected_key1.includes(line.key1)).attr('stroke', d => {selected_key1.length == 0 ? d3.hcl(hue_scale(key_map[d.key1]), chroma, lum) : 'None'})
        //console.log(selected_key1.length == 0)
        //console.log(non_select.data().map(data => data.key1))
        //console.log(all_select.data().map(data => data.key1))
		d3.select(this).attr('stroke', is_selected ? 'none' : 'black').classed('selected', !is_selected); // update rect
	});
}


function plot_it() {
    
    var pad = 40, svgWidth = 1800, svgHeight = 2000
    var left_bar_width = 150
    d3.select('body').append('svg').attr('width', svgWidth).attr('height', svgHeight).attr('id', 'svg0')

    // history line plot

    history_width = 1000, history_height = 400;
    var hist_plot_select = d3.select('#svg0').append('g').attr('transform', 'translate('+(pad + left_bar_width + pad)+','+(pad)+')').attr('id', 'history');
    
    hist_plot_select.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', history_width).attr('height', history_height)
        .attr('fill', '#F1F3F3')//d3.hcl(218, 17, 92)) // background fill for history plot (greyish)


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
                if(line_key != '')
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
    //98 ticks for 1922-2019
    var line_scale_x = d3.scaleLinear().domain(d3.extent(line_data[1].values.map(d => d.keyYr))).range([0, history_width])
    line_data = line_data.filter(datum => {
        return datum.attribute_key != 'Year' && datum.attribute_key != 'Rk'
    })

    // categorical color scale based on key 1
    key1_map = {}
    key1_list = Array.from(new Set(line_data.map(datum => datum.key1)))
    key1_list.forEach((key1, i) => { key1_map[key1] = i})
    h_scale = d3.scaleLinear().domain([0, key1_list.length]).range([0, 360])
    var chroma = 60, lum = 50 // chroma => 0 - 120; lum => 0 - 100
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
    .call(d3.axisBottom(line_scale_x).ticks(98).tickFormat(d3.format("d")))

    hist_plot_select.select("#xaxis").selectAll("text")
        .attr("transform"," translate(-15,15) rotate(-65)") // To rotate the texts on x axis. Translate y position a little bit to prevent overlapping on axis line.
        .style("font-size","10px") //To change the font size of texts

    // legend, legend interaction, legend starts out as ALL SELECTED
    var legend_scale = d3.scaleBand().domain(key1_list).range([160,0]).paddingInner(0.1);
    var key1_legend_group = d3.select('#svg0').append('g').attr('transform', 'translate('+(pad+left_bar_width-150)+','+pad+')').attr('id', 'legend')
    var key1_enter = key1_legend_group.selectAll('empty').data(key1_list).enter();
    key1_enter.append('rect')
        .attr('y', d => legend_scale(d)).attr('width', legend_scale.bandwidth()).attr('height', legend_scale.bandwidth())
        .attr('fill', d => d3.hcl(h_scale(key1_map[d]),chroma,lum))
        .attr('stroke', 'black').attr('class', 'selected')
    key1_enter.append('text')
        .attr('x', (4+legend_scale.bandwidth())).attr('y', d => legend_scale(d) + legend_scale.bandwidth()/2)
        .text(d => d).attr('alignment-baseline', 'middle')

    key1_legend_click(key1_enter.selectAll('rect'), lines_select.selectAll('.line'), h_scale, key1_map, chroma, lum)

    // mouse over effects
    hist_plot_select.append('rect').attr('width', history_width).attr('height', history_height)
        .attr('class', 'hoverrect')
        .attr('fill', 'None').attr('pointer-events', 'all')
    
    mouse_per_lines = d3.select('#history').selectAll('.mouse-per-line').data(line_data).enter().append('g')
        .attr('class', 'mouse-per-line')

    show_hover(line_data, line_scale_x, key1_enter.selectAll('rect'), history_height, mouse_per_lines, key1_map, h_scale, chroma, lum)
//    show_hover(history_width, history_height)

//    // circles
//    hist_plot_select.append('rect').attr('width', history_width).attr('height', history_height)
//    .attr('id', 'hoverrect')
//    .attr('fill', 'None').attr('pointer-events', 'all')

//    //data is line dara
//    circle_select = lines_select.selectAll('.mouse-move').data(d => d).enter().append('circle')
//    circle_select.attr('cx', d => {

//    })
//    d3.selectAll('#hoverrect').on("mousemove", function() {
//     var x = d3.event.pageX - offsetLeft; 
//     var beginning = x, end = pathLength, target;
//     while (true) {
//       target = Math.floor((beginning + end) / 2);
//       pos = pathEl.getPointAtLength(target);
//       if ((target === end || target === beginning) && pos.x !== x) {
//           break;
//       }
//       if (pos.x > x)      end = target;
//       else if (pos.x < x) beginning = target;
//       else                break; //position found
//     }
//     circle
//       .attr("opacity", 1)
//       .attr("cx", x)
//       .attr("cy", pos.y);
//   })

}