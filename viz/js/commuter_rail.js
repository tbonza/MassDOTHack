function loadCommuterRailViz() {
	var g = svg.append("g").attr("id", "commuter-rail-map");
	
	d3.csv("data/StationOrder.csv", function(d) {
			return {
				route : d.route_long_name,
				id : d.stop_id,
				dir : d.direction_id,
				stop : d.stop_sequence,
				branch : d.Branch,
				lat : d.stop_lat,
				lon : d.stop_lon
			};
		}, function(error, stops) {
			var circle_radius, color, lines, routes, unique_stations;
			
			circle_radius = 4;
			color = d3.scale.category20();
			lines = [];
			
			routes = _.pluck(_.uniq(stops, "route"), "route");
			routes.forEach(function(route) {
				var line = {};
				var raw_line = _.filter(stops, { "route": route });
				line.outbound = _.filter(raw_line, { "dir": "0" });
				line.inbound = _.filter(raw_line, { "dir": "1" });
				lines.push(line);
			});
			
			var rails = (function() {
				var direction, rail, rails = [];
				
				//Primary Branch Only
				lines.forEach(function(line) {
					var inbound = line.inbound;
					for(i in inbound) {
						rail = {};
						i = parseInt(i);
						direction = inbound[i].dir;
						branch = inbound[i].branch;
						
						if(inbound[i+1]) {
							if(inbound[i+1].dir === direction) {
								rail.start = inbound[i];
								rail.end = inbound[i+1];
								
								rail.start.projection = projection([rail.start.lon, rail.start.lat]);
								rail.end.projection = projection([rail.end.lon, rail.end.lat]);
								
								rail.theta = calculateTheta(rail);
								rails.push(rail);
							}
						}
					}
					
					var outbound = line.outbound;
					for(i in outbound) {
						rail = {};
						i = parseInt(i);
						direction = outbound[i].dir;
						branch = outbound[i].branch;
						
						if(outbound[i+1]) {
							if(outbound[i+1].dir === direction) {
								rail.start = outbound[i];
								rail.end = outbound[i+1];
								
								rail.start.projection = projection([rail.start.lon, rail.start.lat]);
								rail.end.projection = projection([rail.end.lon, rail.end.lat]);
								
								rail.theta = calculateTheta(rail);
								rails.push(rail);
							}
						}
					}
				});
				
				function calculateTheta(rail) {
					var delta_x = rail.start.projection[0] - rail.end.projection[0];
					var delta_y = rail.start.projection[1] - rail.end.projection[1];
					return Math.atan2(delta_x, delta_y) * 180 / Math.PI;
				}
				
				return rails; 
			})();
			
			g.selectAll("line.rails")
				.data(rails)
				.enter()
				.append("line")
				.style("stroke-dasharray", function(d) {
					 if(d.start.branch !== d.end.branch) {
						return ("3, 3")
					 }
				})
				.style("stroke-width", 1.25)
				.attr("x1", function(d) {
					var offset = Math.sin(d.theta) * (0.8*circle_radius);
					return d.start.projection[0] + offset; 
					})
				.attr("y1", function(d) {
					var offset = Math.cos(d.theta) * (0.8*circle_radius);
					return d.start.projection[1] + offset;
					})
				.attr("x2", function(d) {
					var offset = Math.sin(d.theta) * (0.8*circle_radius);
					return d.end.projection[0] + offset;
					})
				.attr("y2", function(d) {
					var offset = Math.cos(d.theta) * (0.8*circle_radius);
					return d.end.projection[1] + offset
					})
				.style("stroke", function(d) {
					return color(routes.indexOf(d.start.route));
				}).on("mouseover", function(d) {
						console.log(d);
					});
				
				unique_stations = _.uniq(stops, "id");
				g.selectAll("circles.stations")
					.data(unique_stations)
					.enter()
					.append("circle")
					.attr("r", circle_radius)
					.attr("transform", function(d) {
						return "translate(" + projection([ d.lon, d.lat ]) + ")";
					}).on("mouseover", function(d) {
						console.log(d);
					});
		});;
}
