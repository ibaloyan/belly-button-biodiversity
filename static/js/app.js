// Interactive Dashboard to explore the Belly Button Biodiversity Dataset
// Author: Inna Baloyan

var plotData = [];

function buildMetadata(sample) {

  // Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`
    d3.json(url).then(function(response){
      console.log(response)

      // Use `.html("") to clear any existing metadata
      var table = d3.select("#sample-metadata").html("")

      // Use `Object.entries` to add each key and value pair to the panel
      var cell = table.append("td");
      Object.entries(response).forEach(([key, value]) => {
        var row = cell.append("tr");
        row.text(`${key}: ${value}`);
      });
    
    });
    console.log("In the End of buildMetadata(sample) function");
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var plotDataset = `/samples/${sample}`
  console.log("plotDataset=", plotDataset);
  d3.json(plotDataset).then(function(plotData){
    console.log("plotData=", plotData);

    // Build a Bubble Chart using the sample data
    var bubbleChart ={
      x: plotData.otu_ids,
      y: plotData.sample_values,
      mode: 'markers',
      marker: {
        color: plotData.otu_ids,
        size: plotData.sample_values
      },
      text: plotData.otu_labels
    };
    var bubbleLayout = {
      height: 600,
      width: 1200,
  };
    var bubbleData = [bubbleChart]
    Plotly.newPlot("bubble", bubbleData,bubbleLayout );

    // Build a Pie Chart
    var pieChart = {
        values: plotData.sample_values.slice(0,10), 
        labels: plotData.otu_ids.slice(0,10), 
        hoverinfo: plotData.otu_labels.slice(0,10), 
        // hoverinfo: "labels",
        text: plotData.otu_labels.slice(0,10), 
        type: "pie"
    };
      
    var pieData = [pieChart];
    var pieLayout = {
        height: 500,
        width: 600,
        // radius = 200,
    };
    Plotly.newPlot("pie", pieData, pieLayout);

 });
    console.log("In the End of buildCharts(sample) function");
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    console.log("In the End of of init() function");
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  console.log("In the End of of optionChanged(newSample) function");
}

// Initialize the dashboard
init();
