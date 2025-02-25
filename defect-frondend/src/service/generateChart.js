import Plotly from "plotly.js-dist";

export const generateBoxPlotBase64 = async (numPoints) => {
  try {
    const values = Array.from({ length: numPoints }, () => Math.random() * 50);

    const data = [
      {
        y: values,
        type: "box",
        boxpoints: "all",
        jitter: 0.3,
        pointpos: 0,
        fillcolor: "rgba(0, 0, 255, 0.1)", // 設定箱型圖為半透明藍色
        marker: { color: "red", size: 6 }, // 設定散布點顏色為紅色
        line: { color: "blue" },
      },
    ];

    const layout = {
      title: "Box Chart",
      yaxis: { range: [0, 50] },
    };

     // use Plotly.newPlot to generate chart
    const chartDiv = document.createElement("div");
    await Plotly.newPlot(chartDiv, data, layout);

    // use Plotly.toImage to generate Base64 image data
    const imgData = await Plotly.toImage(chartDiv, {
      format: "png",
      width: 600,
      height: 600,
    });

    return imgData;
  } catch (e) {
    throw new Error("Error generating box plot: " + e.message);
  }
};

export const generatePieChartBase64 = async (numPoints) => {
  try {
    const angles = Array.from(
      { length: numPoints },
      () => Math.random() * 2 * Math.PI
    );
    //on purpose to let red points not to be out of circle (max r = 9)
    const radii = Array.from({ length: numPoints }, () => Math.min(Math.random() * 10, 9));

    const x = radii.map((r, i) => 10 + r * Math.cos(angles[i]));
    const y = radii.map((r, i) => 10 + r * Math.sin(angles[i]));

    const data = [
      {
        x,
        y,
        mode: "markers",
        marker: { color: "red", size: 8 },
        type: "scatter",
      },
    ];

    const layout = {
      title: "Pie Chart (Scatter Points in Circle)",
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

    // use Plotly.newPlot to generate chart
    await Plotly.newPlot(chartDiv, data, layout);

    // use Plotly.toImage to generate Base64 image data
    const imgData = await Plotly.toImage(chartDiv, {
      format: "png",
      width: 600,
      height: 600,
    });

    return imgData;
  } catch (e) {
    throw new Error("Error generating pie chart: " + e.message);
  }
};
