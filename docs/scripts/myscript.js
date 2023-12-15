
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


const originalData = [
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

function addBar() {
  const lastDataPoint = data[data.length - 1]; // Get the last data point in the array
  const lastYear = parseInt(lastDataPoint.Year); // Parse the year to an integer for comparison

  // Check if the last year is less than 2020. If so, add a new bar.
  if (lastYear < 2020) {
    const nextYear = String(lastYear + 1); // Calculate the next year as a string

    // Find the next year's data from the originalData array
    const nextYearData = originalData.find(d => d.Year === nextYear);

    if (nextYearData) {
      data.push(nextYearData); // Add the next year's data point to the data array
      updateChart(); // Call the updateChart function to update the chart with the new data
    } else {
      alert("Data for the next year is not available.");
    }
  } else {
    alert("No more data can be added after the year 2020.");
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
  // Update the scales
  x.domain(data.map(d => d.Year));
  y.domain([0, d3.max(originalData, d => d.AlcoholRelatedDeaths)]);

  // Update the x-axis
  svg.select(".x-axis")
    .transition()
    .duration(500)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Update the y-axis
  svg.select(".y-axis")
    .transition()
    .duration(500)
    .call(d3.axisLeft(y));

  // Bind the data to the bars
  const bars = svg.selectAll(".bar")
    .data(data, d => d.Year);

  // Enter new bars
  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.Year))
    .attr("width", x.bandwidth())
    .attr("y", height) // New bars start at the bottom of the chart
    .attr("height", 0) // New bars start with a height of 0
    .attr("fill", "#69b3a2")
  // Transition new and updating bars
  .merge(bars)
    .transition()
    .duration(500)
    .attr("x", d => x(d.Year))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.AlcoholRelatedDeaths))
    .attr("height", d => height - y(d.AlcoholRelatedDeaths));

  // Remove the exiting bars
  bars.exit()
    .transition()
    .duration(500)
    .attr("y", height) // Exiting bars transition to the bottom of the chart
    .attr("height", 0) // Exiting bars transition to a height of 0
    .remove();
}

// Call the updateChart function to draw the initial chart
updateChart();
