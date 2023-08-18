const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());

// In-memory storage for the sales data
let salesData = [];

// Function to prepare the data for rendering
function prepareGraphData(salesData) {
  const maxSales = Math.max(...salesData.map(data => data.amount));
  const graphWidth = 800;
  const graphHeight = 600;
  const barWidth = graphWidth / salesData.length;

  return salesData.map(({ month, amount }, index) => {
    const normalizedHeight = (amount / maxSales) * graphHeight;
    return {
      x: index * barWidth,
      y: graphHeight - normalizedHeight,
      width: barWidth,
      height: normalizedHeight,
      label: month,
    };
  });
}

// Placeholder function for rendering the bar graph using WebGPU
function renderBarGraph(salesData) {
  const graphData = prepareGraphData(salesData);
  // TODO: Implement WebGPU rendering for the bar graph using graphData
  // Return the rendered image or data URL
}

app.post('/submit-sales-report', (req, res) => {
  const { month, amount } = req.body;

  // Validate the input
  if (typeof month !== 'string' || typeof amount !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }

  // Store the sales data
  salesData.push({ month, amount });

  res.json({ success: true, message: 'Sales report submitted successfully!' });
});

// New endpoint to render the bar graph
app.post('/render-bar-graph', (req, res) => {
  const salesDataRequest = req.body.salesData;

  // Call the rendering function
  const renderedImage = renderBarGraph(salesDataRequest);

  // Send the rendered image back to the client
  res.json({ success: true, image: renderedImage });
});

// New endpoint to retrieve the sales data
app.get('/get-sales-data', (req, res) => {
  res.json(salesData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
