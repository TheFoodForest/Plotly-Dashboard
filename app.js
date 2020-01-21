// d3.json("../../samples.json").then(function(data){
//     console.log(data);
// });
//init function to build graphs
function buildPage() {
    d3.json("static\\data\\samples.json").then(function(data){
       var names = data.names;
       d3.select('#selected').text(names[56]);
       names.forEach(item => {
        d3.select("#selDataset").append("option").text(`${item}`).attr("value", item);
        });
        updateBar(names[56],data);
        updateDemo(names[56],data);
        updateBubble(names[56], data);
        updateGauge(names[56], data);
    });
}
// function to update bar graph 
function updateBar(name, data) {
    var bardata = unpackBar(name, data);
       var bar = [{
           x:bardata[1],
           y: bardata[0],
           text: bardata[2],
           orientation: 'h',
           type: 'bar'
       }];
       var barlayout = {
           title: {text: `<b>Top OTU's Found in Test Subject: ${name}</b><br>Each OTU is a differnt Microbial Specie`,
                    font :{size:18}
                },
           xaxis:{
            title:'Number of Samples Observed'
           }
       };
       Plotly.newPlot("bar", bar, barlayout);



}
// function to update bubble graph
function updateBubble(name, data) {
    var bubbledata = unpackBubble(name, data);
       var bubble = [{
           x: bubbledata[0],
           y: bubbledata[1],
           mode: 'markers',
           marker: {
               // add 10 so very small bubbles are visible
               size: bubbledata[1].map(item => item + 10),
               color: bubbledata[0].map(item => Math.sqrt(item))
           },
           colorscale: 'Portland',
           text: bubbledata[2]
       }];
    var bubblelayout = {
        title: {
            text: `<b>All OTU's Observed in Test Subject: ${name}</b><br>Size according to number of observations`,
            font:{size:18}
        },
        xaxis: {
            title: 'OTU Number'
        },
        yaxis:{
            title:'Number of Observations'
        }
    }
       Plotly.newPlot("bubble",bubble, bubblelayout);
}
// function tp update gauge graph
function updateGauge(name, data) {
    var demoDatas = unpackDemo(name, data);
       var data2 = [{
        domain: { x: [0, 1], y: [0, 1] },
		value: demoDatas[0].wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        gauge: {
            axis: {range: [null, 9]},
            steps: [
                {range: [0,3], color:"rgb(255, 26, 26)"},
                {range: [3,6], color:"rgb(0, 179, 0)"},
                {range: [6,9], color:"rgb(102, 153, 255)"}
            ],
            bar: {color : 'black'}
        },
		type: "indicator",
        mode: "gauge+number",
        

       }]

       Plotly.newPlot("gauge", data2);
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

    let otu_labels = filtered[0].otu_labels.slice(0,10).reverse().map(item => item.replace(/;/gi,"<br>"));

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
    let otu_ids = filtered[0].otu_ids;

    let sample_values = filtered[0].sample_values;

    let otu_labels = filtered[0].otu_labels;

    return [otu_ids, sample_values, otu_labels];
} 
// function to update page 
function updatePage(name) {
    d3.json("static\\data\\samples.json").then(function(data) {
        updateBar(name,data);
        updateDemo(name,data);
        updateBubble(name, data);
        updateGauge(name, data);
    });
}
// function attached to event listener in html 
function optionChanged(value) {
    updatePage(value);
}

// event listener for search box
var button = d3.select('#filter-btn');
button.on('click', function() {
    d3.json("static\\data\\samples.json").then(function(data){
        var names = data.names;
    var input_name = d3.select("#searchbox").property('value');
    if (names.includes(input_name)) {
    d3.select('#selected').text(input_name);
    updatePage(input_name);
    }
    else {
       alert(`ID No.: ${input_name} not in records`); 
    }
});
});
// Build the page 
buildPage();

