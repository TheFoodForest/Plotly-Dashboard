// d3.json("../../samples.json").then(function(data){
//     console.log(data);
// });
//init function to build graphs
function buildPage() {
    d3.json("static\\data\\samples.json").then(function(data){
       var names = data.names;
       var randomStart = Math.floor(Math.random()*names.length);
       d3.select('#selected').text(names[randomStart]);
       d3.select("#searchbox").attr("placeholder", names[randomStart]);
       names.forEach(item => {
        d3.select("#selDataset").append("option").text(`${item}`).attr("value", item);
        });
        updateBar(names[randomStart],data);
        updateDemo(names[randomStart],data);
        updateBubble(names[randomStart], data);
        updateGauge(names[randomStart], data);
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
           height:500,
           width:400,
           margin: {
               l:110
           },
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
    // value for speed gauge 
    var level = demoDatas[0].wfreq;

// Trig to calc meter point
    var degrees = (10 - level) * 180/10,
	 radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    var data = [{ type: 'scatter',
    x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Washes',
        text: level,
        hoverinfo: 'text+name'},
    { values: [50/5, 50/5, 50/5, 50/5,50/5, 50],
    rotation: 90,
    text: ['Very Often', 'Quite Often', 'Often', 'Not Often','Never', ''],
    textinfo: 'text',
    textposition:'inside',	  
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)','rgba(187, 187, 119,.5)',
                            
                            'rgba(255, 255, 255, 0)']},
    labels: ['9-10', '7-8', '5-6', '3-4','0-2', ''],
    hoverinfo: 'label',
    hole: .8,
    type: 'pie',
    showlegend: false
    }, { values: [50/5, 50/5, 50/5, 50/5,50/5, 50],
        rotation: 90,
        text: ['9-10     ', '7-8  ', '5-6', '3-4','   0-2', ''],
        textinfo: 'text',
        textfont: {
            size: 10
        },
        textposition:'auto',	  
        marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)','rgba(187, 187, 119,.5)',
        
        'rgba(255, 255, 255, 0)']},
        labels: ['9-10', '7-8', '5-6', '3-4','0-2', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];
    var layout = {
        height:600,
        width:600,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
          xaxis: {zeroline:false, showticklabels:false,
            showgrid: false, range: [-1, 1]},
 yaxis: {zeroline:false, showticklabels:false,
            showgrid: false, range: [-1, 1]}      
    };
       Plotly.newPlot("gauge", data, layout);
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
        d3.select("#searchbox").attr("placeholder", name);
        d3.select('#selected').text(name);
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



