import Plotly from 'plotly.js-dist-min';

// -----------------------------
// Generate a box plot and return as Base64 string
// -----------------------------
export const generateBoxPlotBase64 = async (numPoints: number): Promise<string> => {
  try {
    const values: number[] = Array.from({ length: numPoints }, () => Math.random() * 50);

    const data: any[] = [
      {
        y: values,
        type: "box",
        boxpoints: "all",
        jitter: 0.3,
        pointpos: 0,
        fillcolor: "rgba(0, 0, 255, 0.1)", // semi-transparent blue box
        marker: { color: "red", size: 6 },  // red scatter points
        line: { color: "blue" },
      },
    ];

    const layout: any = {
      title: { text: "Box Chart" },
      yaxis: { range: [0, 50] },
    };


    // create a temporary div to render chart
    const chartDiv = document.createElement("div");
    await Plotly.newPlot(chartDiv, data, layout);

    // generate Base64 image
    const imgData: string = await Plotly.toImage(chartDiv, {
      format: "png",
      width: 600,
      height: 600,
    });

    return imgData;
  } catch (e: any) {
    throw new Error("Error generating box plot: " + e.message);
  }
};

// -----------------------------
// Generate a pie chart (scatter points inside a circle) and return as Base64
// -----------------------------
export const generatePieChartBase64 = async (numPoints: number): Promise<string> => {
  try {
    const angles: number[] = Array.from({ length: numPoints }, () => Math.random() * 2 * Math.PI);
    const radii: number[] = Array.from({ length: numPoints }, () => Math.min(Math.random() * 10, 9));

    const x: number[] = radii.map((r, i) => 10 + r * Math.cos(angles[i]));
    const y: number[] = radii.map((r, i) => 10 + r * Math.sin(angles[i]));

    const data: any[] = [
      {
        x,
        y,
        mode: "markers",
        marker: { color: "red", size: 8 },
        type: "scatter",
      },
    ];

    const layout: any = {
      title: { text: "Pie Chart (Scatter Points in Circle)" },
      xaxis: { visible: false },
      yaxis: { visible: false },
      shapes: [
        {
          type: "circle",
          xref: "x",
          yref: "y",
          x0: 0,
          y0: 0,
          x1: 20,
          y1: 20,
          fillcolor: "rgba(200, 200, 200, 0.5)",
          line: { width: 0 },
        },
      ],
    };

    const chartDiv = document.createElement("div");
    await Plotly.newPlot(chartDiv, data, layout);

    const imgData: string = await Plotly.toImage(chartDiv, {
      format: "png",
      width: 600,
      height: 600,
    });

    return imgData;
  } catch (e: any) {
    throw new Error("Error generating pie chart: " + e.message);
  }
};
