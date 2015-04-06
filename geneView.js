var condition1=2
	condition2=4
	condition1text='pH7 Low CO2'
	condition2text='pH7 High CO2';
//w and h are the height and width of the graph, NOT of the svg element, which is w(or h)+2*padding
var w = 500
	h = 500
	padding = 100;

//A giant array that contains all gene information
//dataset contains raw FPKM
//logDataset contains log(FPKM+0.1)  (log base 10)
var	rawDataset=[]
	logDataset=[]
	dataset=logDataset;


//Define genes of interest
var CO2Arr=['CA1','EMIHUDRAFT_469462','EMIHUDRAFT_436031','EMIHUDRAFT_200137','ATPVC3','EMIHUDRAFT_67081','EMIHUDRAFT_70025','CAX3','NHA2','EMIHUDRAFT_457739','GPA']
var nonCO2Arr=['EMIHUDRAFT_456048','Gamma_CA_1','HVCN1','EMIHUDRAFT_75635']

//This is where the dataset files are loaded.  There are now a total of 6 such files.
//2 made by cuffdiff_process.py: Processed_Cuffdiff.tsv and Log_Processed_Cuffdiff.tsv
//2 made by cuffdiff_process2.py: Processed_Cuffdiff2.tsv and Log_Processed_Cuffdiff2.tsv
//2 made by cuffdiff_process3.py: Processed_Cuffdiff3.tsv and Log_Processed_Cuffdiff3.tsv
//These last 4 process genes.fpkm_tracking instead of gene_exp.diff and filter out genes with
//illogical confidence thresholds, zero FPKM values, or FAILED statuses

//This excluded the following number of genes, sequentially:
//Total: 46097
//Non-failed: 45837
//Non-zero: 27127
//Logical confidence upper- and lower-bounds: 25643

window.onload = function() {
	d3.tsv("Processed_Cuffdiff3.tsv", function(data) {
		data.forEach(function(d) {
	        d.GO_Term=d.GO_Term;
	        d.Gene=d.Gene;
	        d.Locus=d.Locus;
	        d.Test_ID=d.Test_ID;
	        d.c0=+d.ConstantCO2_LowpH
	        d.c1=+d.ConstantCO2_HighpH
	        d.c2=+d.pH7_LowCO2_2
	        d.c3=+d.pH7_MidCO2
	        d.c4=+d.pH7_HighCO2
	        d.c5=+d.pH8_LowCO2
	        d.c6=+d.pH8_MidCO2

	        //Add to dataset only the values of the conditions selected
	        rawDataset[rawDataset.length]=[d.c0,d.c1,d.c2,d.c3,d.c4,d.c5,d.c6,d.GO_Term,d.Gene,d.Locus,d.Test_ID]
	    });
	});
	d3.tsv("Log_Processed_Cuffdiff3.tsv", function(data) {
		data.forEach(function(d) {
	        d.GO_Term=d.GO_Term;
	        d.Gene=d.Gene;
	        d.Locus=d.Locus;
	        d.Test_ID=d.Test_ID;
	        d.c0=+d.ConstantCO2_LowpH
	        d.c1=+d.ConstantCO2_HighpH
	        d.c2=+d.pH7_LowCO2_2
	        d.c3=+d.pH7_MidCO2
	        d.c4=+d.pH7_HighCO2
	        d.c5=+d.pH8_LowCO2
	        d.c6=+d.pH8_MidCO2

	        //Add to dataset only the values of the conditions selected
	        logDataset[logDataset.length]=[d.c0,d.c1,d.c2,d.c3,d.c4,d.c5,d.c6,d.GO_Term,d.Gene,d.Locus,d.Test_ID]
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
	// $(".rawDataset").click(function(){
	// 	dataset=rawDataset;
	// });
	// $(".logDataset").click(function(){
	// 	dataset=logDataset;
	// });
});

function drawGraph(){
	//Create scale functions
	 xScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[condition1]; })])
						 .range([padding, w + padding]);

	 yScale = d3.scale.linear()
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

		//Create x=y line
	svg.append('line')
		.attr("x1",xScale(1))
		.attr("y1",yScale(1))
		.attr("x2",(padding+w))
		.attr("y2",padding)
		.attr("stroke-width",1)
		.attr("stroke","grey");

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
	  				'fill-opacity':0.1,
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
					.style("left", xPosition +10+ "px")
					.style("top", yPosition + "px")						
					.select("#value")
					.html("<b>Test ID: </b>"+d[10]+
						"</br><b>Gene</b>: "+d[8]+" </br><b>GO_Term</b>: "+d[7]+
						"</br></br><b>Raw FPKM Values</b>"+
						"</br><b>ConstantCO2_LowpH: </b>"+(Math.pow(2,d[0])-2).toFixed(2)+
						"</br><b>ConstantCO2_HighpH: </b>"+(Math.pow(2,d[1])-2).toFixed(2)+
						"</br><b>pH7_LowCO2: </b>"+(Math.pow(2,d[2])-2).toFixed(2)+
	   					"</br><b>pH7_MidCO2: </b>"+(Math.pow(2,d[3])-2).toFixed(2)+
						"</br><b>pH7_HighCO2: </b>"+(Math.pow(2,d[4])-2).toFixed(2)+
						"</br><b>pH8_LowCO2: </b>"+(Math.pow(2,d[5])-2).toFixed(2)+
						"</br><b>pH8_MidCO2: </b>"+(Math.pow(2,d[6])-2).toFixed(2));

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
    	.attr('class','axisText')
        .attr("transform", "rotate(-90,"+(padding)+","+(padding + h/2)+")")
        .attr('x',(padding))
        .attr('y',(padding + h/2))
        .attr("dy", "-3em")
        .style("font-size", "20px")
        .style("text-anchor", "middle") 
        .text(condition2text);

    // Creates xAxis label
    svg.append("text")
    	.attr('class','axisText')
        .attr("transform", "translate(" + (padding +w/2) + " ," + (h + 1.5*padding) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(condition1text);

    // Create title
    svg.append("text")
    	.attr("transform", "translate(" + (padding +w/2) + " ," + (0.5*padding) + ")")
    	.style("font-size","20px")
    	.style("text-anchor", "middle")
    	.text("Log\u2082(2+FPKM)")

    // Create Legend
    svg.append("text")
    	.attr("transform", "translate(" + (1.1*padding +2*w/3) + " ," + (h+5) + ")")
        .style("font-size", "20px")
        .text("CO2-responsive genes*");
    svg.append("text")
    	.attr("transform", "translate(" + (1.1*padding +2*w/3) + " ," + (h + 0.25*padding+5) + ")")
        .style("font-size", "20px")
        .text("Non-CO2-responsive genes*");
    svg.append("text")
    	.attr("transform", "translate(" + (1.1*padding +2*w/3) + " ," + (h + 0.5*padding+5) + ")")
        .style("font-size", "15px")
        .text("*From Bach et. al. 2013"); 
    svg.append("circle")
    	.attr('fill','green')
	  	.attr('r',5)
	  	.attr('cx',(padding + 2*w/3))
	  	.attr('cy',(h));
    svg.append("circle")
    	.attr('fill','red')
	  	.attr('r',5)
	  	.attr('cx',(padding + 2*w/3))
	  	.attr('cy',(h + 0.25*padding));
}

function redrawGraph(){

	xScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[condition1]; })])
						 .range([padding, w + padding]);

	 yScale = d3.scale.linear()
						 .domain([0, d3.max(dataset, function(d) { return d[condition2]; })])
						 .range([h + padding, padding]);
	d3.selectAll('.axisText').remove();
	// Creates yAxis label
	d3.select('svg').append("text")
		.attr('class','axisText')
	    .attr("transform", "rotate(-90,"+(padding)+","+(padding + h/2)+")")
	    .attr('x',(padding))
	    .attr('y',(padding + h/2))
	    .attr("dy", "-3em")
	    .style("font-size", "20px")
	    .style("text-anchor", "middle") 
	    .text(condition2text);

    // Creates xAxis label
    d3.select('svg').append("text")
    	.attr('class','axisText')
        .attr("transform", "translate(" + (padding +w/2) + " ," + (h + 1.5*padding) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(condition1text);

	d3.select('svg')
		.selectAll('circle')
		.data(dataset)
		.transition()
		.duration(3000)
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
	  				'fill-opacity':0.1,
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


}
