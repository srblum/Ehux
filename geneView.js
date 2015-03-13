var condition1='c1'
	condition2='c2'
	condition1text='Constant CO2 LowpH'
	condition2text='Constant CO2 HighpH';

var w = 1000;
	var h = 600;
	var padding = 100;

window.onload = function() {
    drawGraph();
};

$(document).ready(function() {
	$(".condition1").click(function() {
        condition1='c1';
        condition1text=this.value;
	});
	$(".condition2").click(function() {
        condition1='c2';
        condition1text=this.value;
	});
	$(".condition3").click(function() {
        condition1='c3';
        condition1text=this.value;
	});
	$(".condition4").click(function() {
        condition1='c4';
        condition1text=this.value;
	});
	$(".condition5").click(function() {
        condition1='c5';
        condition1text=this.value;
	});
	$(".condition6").click(function() {
        condition1='c6';
        condition1text=this.value;
	});
	$(".condition7").click(function() {
        condition1='c7';
        condition1text=this.value;
	});
	$(".condition8").click(function() {
        condition2='c1';
        condition2text=this.value;
	});
	$(".condition9").click(function() {
        condition2='c2'
        condition2text=this.value;
	});
	$(".condition10").click(function() {
        condition2='c3'
        condition2text=this.value;
	});
	$(".condition11").click(function() {
        condition2='c4'
        condition2text=this.value;
	});
	$(".condition12").click(function() {
        condition2='c5'
        condition2text=this.value;
	});
	$(".condition13").click(function() {
        condition2='c6'
        condition2text=this.value;
	});
	$(".condition14").click(function() {
        condition2='c7'
        condition2text=this.value;
	});
});

function drawGraph(){
	d3.tsv("Processed_Cuffdiff.tsv", function(data) {
		dataset=[]

		data.forEach(function(d) {
	        d.GO_Term=d.GO_Term;
	        d.Gene=d.Gene;
	        d.Locus=d.Locus;
	        d.Test_ID=d.Test_ID;
	        d.c1=d.ConstantCO2_LowpH
	        d.c2=d.ConstantCO2_HighpH
	        d.c3=d.pH7_LowCO2_2
	        d.c4=d.pH7_MidCO2
	        d.c5=d.pH7_HighCO2
	        d.c6=d.pH8_LowCO2
	        d.c7=d.pH8_MidCO2

	        //Add to dataset only the values of the conditions selected
	        dataset[dataset.length]=[eval("d."+condition1),eval("d."+condition2),d.GO_Term,d.Gene,d.Locus]
	    });


		//Create scale functions
		var xScale = d3.scale.linear()
							 .domain([0, d3.max(dataset, function(d) { return d[0]; })])
							 .range([padding, w - padding * 2]);

		var yScale = d3.scale.linear()
							 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
							 .range([h - padding, padding]);



		//Define X axis
		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .orient("bottom")
						  .ticks(5);

		//Define Y axis
		var yAxis = d3.svg.axis()
						  .scale(yScale)
						  .orient("left")
						  .ticks(5);

		//Create SVG element
		d3.selectAll('svg').remove();
		var svg = d3.select("body")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

		//Create circles
		svg.selectAll("circle")
		   .data(dataset)
		   .enter()
		   .append("circle")
		   .attr("cx", function(d) {
		   		return xScale(d[0]);
		   })
		   .attr("cy", function(d) {
		   		return yScale(d[1]);
		   })
		   .attr("r", 2)
		   .on("mouseover", function(d) {

					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = parseFloat(d3.select(this).attr("cx"));
					var yPosition = parseFloat(d3.select(this).attr("cy"));

					//Update the tooltip position and value
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")						
						.select("#value")
						.text("Gene: "+d[3]+"</br>GO_Term: "+d[2]+"\nLocus: "+d[4]);
			   
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);

			   })
		   .on("mouseout", function() {
		   
				//Hide the tooltip
				d3.select("#tooltip").classed("hidden", true);
				
		   });

		//Create X axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h - padding) + ")")
			.call(xAxis);

		//Create Y axis
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis);

		//Create yAxis label
        svg.append("text")
	        // .attr("transform", "rotate(-90)")
	        .attr('x',100)
	        .attr('y',100)
	        .attr("dy", "-3em")
	        .style("font-size", "20px")
	        .style("text-anchor", "middle") 
	        .text(condition2text);


	    // Creates xAxis label
	    svg.append("text")
	        .attr("transform", "translate(" + w/2 + " ," + (h - 50) + ")")
	        .style("text-anchor", "middle")
	        .style("font-size", "20px")
	        .text(condition1text);
	});

}

