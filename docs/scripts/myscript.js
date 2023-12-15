
const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append the SVG object to the div with id "bar-chart"
const svg = d3.select("#plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Data
const data = [
  { Year: "2003", AlcoholRelatedDeaths: 3774 },
  { Year: "2004", AlcoholRelatedDeaths: 3632 },
  { Year: "2005", AlcoholRelatedDeaths: 3587 },
  { Year: "2006", AlcoholRelatedDeaths: 3547 },
  { Year: "2007", AlcoholRelatedDeaths: 3594 },
  { Year: "2008", AlcoholRelatedDeaths: 3807 },
  { Year: "2009", AlcoholRelatedDeaths: 3848 },
  { Year: "2010", AlcoholRelatedDeaths: 3872 },
  { Year: "2011", AlcoholRelatedDeaths: 4097 },
  { Year: "2012", AlcoholRelatedDeaths: 4307 },
  { Year: "2013", AlcoholRelatedDeaths: 4544 },
  { Year: "2014", AlcoholRelatedDeaths: 4597 },
  { Year: "2015", AlcoholRelatedDeaths: 4718 },
  { Year: "2016", AlcoholRelatedDeaths: 4984 },
  { Year: "2017", AlcoholRelatedDeaths: 5139 },
  { Year: "2018", AlcoholRelatedDeaths: 5103 },
  { Year: "2019", AlcoholRelatedDeaths: 5153 },
  { Year: "2020", AlcoholRelatedDeaths: 6345 }
];

// X axis
const x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(d => d.Year))
  .padding(0.2);
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .attr("class", "x-axis")
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.AlcoholRelatedDeaths)])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.Year))
    .attr("y", d => y(d.AlcoholRelatedDeaths))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.AlcoholRelatedDeaths))
    .attr("fill", "#69b3a2")
    .attr("class", "bar");


const originalData = data;


function addBar() {
  const lastYear = parseInt(data[data.length - 1].Year);
  if (lastYear < 2020) {
    // Define a new data point. Assuming you want to keep the number of AlcoholRelatedDeaths the same for simplicity
    const newDataPoint = { Year: String(lastYear + 1), AlcoholRelatedDeaths: data[data.length - 1].AlcoholRelatedDeaths };
    data.push(newDataPoint); // Add the new data point to the data array
    updateChart(); // Call a function to update the chart with the new data
  } else {
    console.log("Reached the year 2020 limit."); // Or handle this case as appropriate
  }
}

// Function to remove a bar from the left (shifts the first element off the data array)
function removeBarLeft() {
  if (data.length > 0) {
    data.shift(); // Remove the first data point
    updateChart(); // Call a function to update the chart with the new data
  }
}

// Function to remove a bar from the right (pops the last element off the data array)
function removeBarRight() {
  if (data.length > 0) {
    data.pop(); // Remove the last data point
    updateChart(); // Call a function to update the chart with the new data
  }
}

// Function to update the chart
function updateChart() {
  // Re-bind the data to the bars
  const bars = svg.selectAll(".bar")
    .data(data, d => d.Year);

  // Enter new bars and update existing ones
  bars.enter()
    .append("rect")
    .merge(bars) // This is necessary to apply attributes to the updated bars as well as the new ones
      .attr("class", "bar")
      .attr("x", d => x(d.Year))
      .attr("y", d => y(d.AlcoholRelatedDeaths))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.AlcoholRelatedDeaths))
      .attr("fill", "#69b3a2");

  // Remove the exiting bars
  bars.exit().remove();

  // Update the x-axis if the year scale has changed
  x.domain(data.map(d => d.Year));
  svg.select(".x-axis").transition().duration(500).call(d3.axisBottom(x)); // Add transitions for a smoother update
}


// Initial render of the chart
updateChart();
