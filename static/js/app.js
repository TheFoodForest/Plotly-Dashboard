d3.json("../../samples.json").then(function(data){
    console.log(data);
});
// function changing value
// onchange="optionChanged(this.value)" in html

//init function to build graphs
function buildPage() {
    d3.json("../../samples.json").then(function(data){
       var names = data.names;
       d3.select('#selected').text(names[56]);
       
       var bardata = unpackBar(names[56], data);
       var bar = [{
           x:bardata[1],
           y: bardata[0],
           text: bardata[2],
           orientation: 'h',
           type: 'bar'
       }]
       Plotly.newPlot("bar", bar);

       updateDemo(names[56],data);


       var bubbledata = unpackBubble(names[56], data);
       var bubble = [{
           x: bubbledata[0],
           y: bubbledata[1],
           mode: 'markers',
           marker: {
               // add 10 so very small bubbles are visible
               size: bubbledata[1].map(item => item + 10),
               color: bubbledata[0],
           },
           text: bubbledata[2]
       }];

       Plotly.newPlot("bubble",bubble);

       var demoDatas = unpackDemo(names[56], data)
       var data2 = [{
        domain: { x: [0, 1], y: [0, 1] },
		value: demoDatas[0].wfreq,
        title: { text: "Washes Per Week" },
        gauge: {
            axis: {range: [null, 10]}
        },
		type: "indicator",
		mode: "gauge+number"

       }]

       Plotly.newPlot("gauge", data2);
       

    });
    
}
// function to update demographic info 
function updateDemo(name, data) {
    var demodata = unpackDemo(name, data);
    var demo = d3.select("#table");
    demo.html("")
    Object.entries(demodata[0]).forEach(function(item) {
    demo.append('tr').text(`${item[0]}: ${item[1]}`);
    });
}


// function to unpack json for barchart
function unpackBar(name, data) {
    let filtered = data.samples.filter(function(item){
        return item.id === name;
    });
    let otu_ids = filtered[0].otu_ids.slice(0,10).map(item => ("OTU " + item)).reverse();

    let sample_values = filtered[0].sample_values.slice(0,10).reverse();

    let otu_labels = filtered[0].otu_labels.slice(0,10).reverse();

    return [otu_ids, sample_values, otu_labels];
} 
// function to unpack json for demogrpahics
function unpackDemo(name, data){
    let filtered2 = data.metadata.filter(function(item){
        return item.id === parseInt(name);
    });

    return filtered2;
}

// function to unpack json for bubble chart
function unpackBubble(name, data) {
    let filtered = data.samples.filter(function(item){
        return item.id === name;
    });
    console.log(filtered);
    let otu_ids = filtered[0].otu_ids;

    let sample_values = filtered[0].sample_values;

    let otu_labels = filtered[0].otu_labels;

    return [otu_ids, sample_values, otu_labels];
} 

// fuction to update graphs and demographic info
// will use unpack function 



// 
buildPage();