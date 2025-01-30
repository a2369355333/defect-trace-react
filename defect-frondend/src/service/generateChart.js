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
        pointpos: -1.8,
        marker: { color: "red", size: 6 },
      },
    ];

    const layout = {
      title: "Box Chart",
      yaxis: { range: [0, 50] },
    };

    // 使用 Plotly.newPlot 方法生成圖表
    const chartDiv = document.createElement("div");
    await Plotly.newPlot(chartDiv, data, layout);

    // 使用 Plotly.toImage 生成 Base64 圖片資料
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
    const radii = Array.from({ length: numPoints }, () => Math.random() * 10);

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
          line: { color: "rgba(200, 200, 200, 0.4)", width: 10 },
        },
      ],
    };

    const chartDiv = document.createElement("div");

    // 使用 Plotly.newPlot 方法生成圖表
    await Plotly.newPlot(chartDiv, data, layout);

    // 使用 Plotly.toImage 生成 Base64 圖片資料
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
