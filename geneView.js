var condition1=2
	condition2=4
	condition1text='pH7 Low CO2'
	condition2text='pH7 High CO2';
//w and h are the height and width of the graph, NOT of the svg element, which is w(or h)+2*padding
var w = 500
	h = 500
	padding = 100;

//A giant array that contains all gene information
var dataset=[];


window.onload = function() {
	d3.tsv("Processed_Cuffdiff.tsv", function(data) {
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
	        dataset[dataset.length]=[d.c1,d.c2,d.c3,d.c4,d.c5,d.c6,d.c7,d.GO_Term,d.Gene,d.Locus]
	    });
	    drawGraph();
	});
}

$(document).ready(function() {
	$(".condition1").click(function() {
        condition1=0;
        condition1text=this.value;
	});
	$(".condition2").click(function() {
        condition1=1;
        condition1text=this.value;
	});
	$(".condition3").click(function() {
        condition1=2;
        condition1text=this.value;
	});
	$(".condition4").click(function() {
        condition1=3;
        condition1text=this.value;
	});
	$(".condition5").click(function() {
        condition1=4;
        condition1text=this.value;
	});
	$(".condition6").click(function() {
        condition1=5;
        condition1text=this.value;
	});
	$(".condition7").click(function() {
        condition1=6;
        condition1text=this.value;
	});
	$(".condition8").click(function() {
        condition2=0;
        condition2text=this.value;
	});
	$(".condition9").click(function() {
        condition2=1;
        condition2text=this.value;
	});
	$(".condition10").click(function() {
        condition2=2;
        condition2text=this.value;
	});
	$(".condition11").click(function() {
        condition2=3;
        condition2text=this.value;
	});
	$(".condition12").click(function() {
        condition2=4;
        condition2text=this.value;
	});
	$(".condition13").click(function() {
        condition2=5;
        condition2text=this.value;
	});
	$(".condition14").click(function() {
        condition2=6;
        condition2text=this.value;
	});
});

function drawGraph(){
	//Create scale functions
	var xScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[condition1]; })])
						 .range([padding, w + padding]);

	var yScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[condition2]; })])
						 .range([h + padding, padding]);



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
				.attr("width", w+padding*2)
				.attr("height", h+padding*2);

	//Define genes of interest
	var CO2Arr=['CA1','EMIHUDRAFT_469462','EMIHUDRAFT_436031','EMIHUDRAFT_200137','ATPVC3','EMIHUDRAFT_67081','EMIHUDRAFT_70025','CAX3','NHA2','EMIHUDRAFT_457739','GPA']
	var nonCO2Arr=['EMIHUDRAFT_456048','Gamma_CA_1','HVCN1','EMIHUDRAFT_75635']
	//Create circles
	svg.selectAll("circle")
	   .data(dataset)
	   .enter()
	   .append("circle")
	   .each(function(d){
	  		if($.inArray(d[8],CO2Arr)!=-1){
	  			d3.select(this).attr({
	  				fill:'green',
	  				r:3
	  			});
	  		}else if($.inArray(d[8],nonCO2Arr)!=-1){
	  			d3.select(this).attr({
	  				fill:'red',
	  				r:3
	  			});
	  		}else{
	  			d3.select(this).attr({
	  				fill:'black',
	  				'fill-opacity':0.3,
	  				r:2
	  			});
	  		}
	   })
	   .attr("cx", function(d) {
	   		return xScale(d[condition1]);
	   })
	   .attr("cy", function(d) {
	   		return yScale(d[condition2]);
	   })
	   .on("mouseover", function(d) {

				//Get this bar's x/y values, then augment for the tooltip
				var xPosition = parseFloat(d3.select(this).attr("cx"));
				var yPosition = parseFloat(d3.select(this).attr("cy"));

				//Update the tooltip position and value
				d3.select("#tooltip")
					.style("left", xPosition + "px")
					.style("top", yPosition + "px")						
					.select("#value")
					.html("<b>Gene</b>: "+d[8]+" </br><b>GO_Term</b>: "+d[7]);
		   
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
		.attr("transform", "translate(0," + (h + padding) + ")")
		.call(xAxis);

	//Create Y axis
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

	//Create yAxis label
    svg.append("text")
        .attr("transform", "rotate(-90,"+(padding)+","+(padding + h/2)+")")
        .attr('x',(padding))
        .attr('y',(padding + h/2))
        .attr("dy", "-3em")
        .style("font-size", "20px")
        .style("text-anchor", "middle") 
        .text(condition2text+" (FPKM)");


    // Creates xAxis label
    svg.append("text")
        .attr("transform", "translate(" + (padding +w/2) + " ," + (h + 1.5*padding) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(condition1text+" (FPKM)");
}
