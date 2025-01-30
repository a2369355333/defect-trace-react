import React, { useState, useEffect, useContext, useRef } from "react";
import moment from "moment";
import Plot from "react-plotly.js";
import WaferMap from "./WaferMap";
import BoxPlot from "./BoxPlot";
import { SystemContext } from "../../context/SystemContext";
import { Tabs, Tab } from "@mui/material";
import { generateBoxPlotBase64, generatePieChartBase64 } from "../../service/generateChart";

const DefectChart = (props) => {
  const { data } = props;
  const { basicInfo, chartDefectData } = data;
  const [chartData, setChartData] = useState([]);
  const [chartLayout, setChartLayout] = useState({
    title: {
      text: basicInfo.CHART_NAME,
      font: {
        size: 18,
      },
      x: 0.5,
      xanchor: "center",
      y: 1.5,
      yanchor: "top",
    },
    margin: {
      t: 50,
      r: 10,
      b: 200,
    },
    hovermode: "closest",
    hoverlabel: { bgcolor: "#FFF" },
    showlegend: true,
    useResizeHandler: true,
    autosize: false,
    width: 850,
    height: 500,
  });
  const [shapeTimeLine, setShapeTimeLine] = useState({
    visible: true,
    type: "line",
    line: {
      color: "purple",
      width: 2,
    },
    layer: "above",
  });
  const [shapeTimeLineYValues, setShapeTimeLineYValues] = useState({
    y0: 0,
    y1: 0,
  });
  const [waferMapImages, setWaferMapImages] = useState([]);
  const [boxPlotImages, setBoxPlotImages] = useState([]);
  const [boxPlotSummaryImage, setBoxPlotSummaryImage] = useState("");
  const [selectedMapIdx, setSelectedMapIdx] = useState(-1);
  const [selectedBoxPlotIdx, setSelectedBoxPlotIdx] = useState(-1);
  const [requestedMapCoords, setRequestedMapCoords] = useState(new Map());
  const [requestedBoxCoords, setRequestedBoxCoords] = useState(new Map());
  const [tabValue, setTabValue] = useState(0);
  const chartRef = useRef(null);
  const { state, dispatch } = useContext(SystemContext);

  //generate images
  const getDefectMapImage = async (coords) => {
    try {
      const newImage = await generatePieChartBase64(coords.y);
      console.log('pie', newImage)
      setWaferMapImages((preImages) => [...preImages, newImage]);
    } catch (e) {
      console.error("Error fetching wafer map image:", e);
    }
  };
  const getDefectBoxPlotImage = async (coords) => {
    try {
      const newImage = await generateBoxPlotBase64(coords.y);
      console.log('box',newImage)
      setBoxPlotImages((preImages) => [...preImages, newImage]);
    } catch (e) {
      console.error("Error fetching box plot image:", e);
    }
  };
  const getDefectBoxPlotSummaryImage = async (count) => {
    try {
      const newImage = await generateBoxPlotBase64(count);
      setBoxPlotSummaryImage(newImage);
    } catch (e) {
      console.error("Error fetching box plot image:", e);
    }
  };

  useEffect(() => {
    //filter data to new array
    const latest50DefectData = chartDefectData
      .sort((a, b) => moment(b.UPDATE_TIME).diff(moment(a.UPDATE_TIME)))
      .slice(0, 50);
    const newChartDefectData = latest50DefectData.map((v) => ({
      UPDATE_TIME: v.UPDATE_TIME,
      MEAN_VALUE: v.MEAN_VALUE,
      CHART_SEQ: v.CHART_SEQ,
      BATCH: v.BATCH,
      MarkerColor: "#196be6",
    }));
    newChartDefectData.push({
      UPDATE_TIME: basicInfo.MOVE_IN_TIME,
      MEAN_VALUE: null,
      CHART_SEQ: null,
      MarkerColor: "white",
    });
    newChartDefectData.sort((a, b) =>
      moment(a.UPDATE_TIME).diff(moment(b.UPDATE_TIME))
    );

    const xVals = newChartDefectData.map((v) => v.UPDATE_TIME);
    const yVals = newChartDefectData.map((v) => v.MEAN_VALUE);
    const totalYVal = yVals.reduce((acc, v) => acc + v, 0);
    getDefectBoxPlotSummaryImage(totalYVal);
    //statisticsLine includes 1/2/3 STD & X_BAR
    const statisticsLine = Array.from({ length: 3 }, (_, i) => i + 1).map(
      (v) => ({
        name: `${v} * sigma`,
        x: Array.from(
          { length: newChartDefectData.length + 3 },
          (_, i) => i - 2
        ),
        y: Array.from(
          { length: newChartDefectData.length + 3 },
          (_, i) => i - 2
        ).map((_, i) => latest50DefectData[0]?.[`AVG${v}STD`] ?? 0),
        type: "scatter",
        mode: "lines",
        textposition: "top",
        line: {
          color: v === 1 ? "#ff4800" : v == 2 ? "#913500" : "red",
          width: 2,
          dash: v > 1 ? "solid" : "dot",
        },
        hoverinfo: "none",
      })
    );
    statisticsLine.push({
      name: "X Bar",
      x: Array.from({ length: newChartDefectData.length + 3 }, (_, i) => i - 2),
      y: Array.from(
        { length: newChartDefectData.length + 3 },
        (_, i) => i - 2
      ).map((_, i) => latest50DefectData[0]?.["XBAR"] ?? 0),
      type: "scatter",
      mode: "lines",
      textposition: "top",
      line: {
        color: "green",
        width: 1,
        dash: "solid",
      },
      hoverinfo: "none",
    });

    const scatterMarkerColors = newChartDefectData.map((v) => v.MarkerColor);
    const textList = xVals.map(
      (v, i) => `<b>Defect Count</b>: ${yVals[i]}<br /><b>${v}</b>`
    );
    //real data scatter line
    const defectTrace = {
      name: "defect_trace",
      x: xVals.map((v, i) => i),
      y: yVals,
      text: textList,
      xVals: xVals,
      hoverinfo: "text",
      type: "scatter",
      mode: "lines+markers",
      connectgaps: true,
      line: {
        color: "#196be6",
        width: 2,
      },
      marker: {
        color: scatterMarkerColors,
        size: 6,
      },
      chartSeqs: newChartDefectData.map((v) => v.CHART_SEQ),
    };
    const updatedChartData = [...statisticsLine, defectTrace];
    setChartData(updatedChartData);

    //purple vertical line
    const threeSigmaYVal = statisticsLine.find((v) => v.name === "3 * sigma")
      .y[0];
    const maxY = Math.max(...yVals);

    setShapeTimeLineYValues((p) => ({ ...p, y1: maxY }));
    const shape = {
      ...shapeTimeLine,
      x0: newChartDefectData.findIndex((v) =>
        moment(v.UPDATE_TIME).isSame(moment(basicInfo.MOVE_IN_TIME))
      ),
      x1: newChartDefectData.findIndex((v) =>
        moment(v.UPDATE_TIME).isSame(moment(basicInfo.MOVE_IN_TIME))
      ),
      y0: 0,
      y1: threeSigmaYVal > maxY ? threeSigmaYVal : maxY,
    };

    const newLayout = {
      ...chartLayout,
      xaxis: {
        ticklabelposition: "outside bottom",
        showgrid: false,
        showline: false,
        automargin: true,
        tickmode: "array",
        tickvals: xVals.map((v, i) => i),
        ticktext: xVals.map((v, i) => v),
        tickangle: -90,
        tickformat: "%Y-%m-%d %H:%M",
      },
      yaxis: {
        tickvals: yVals,
        ticktext: yVals,
        showgrid: false,
        showline: false,
        title: {
          text: "Defect Count",
          standoff: 40,
        },
      },
      shapes: [shape],
    };

    setChartLayout(newLayout);
  }, [data]);

  const showPlotInfo = async (e) => {
    if (e.points[0].y === 0 || e.points[0].data.name != "defect_trace") return;

    const currIdx = e.points[0].pointIndex;
    const coords = {
      x: e.points[0].x,
      y: e.points[0].y,
      text: e.points[0].data.xVals?.[currIdx],
      chartSeq: e.points[0].data.chartSeqs?.[currIdx],
    };

    if (!requestedMapCoords.has(coords.x)) await getDefectMapImage(coords);
    if (!requestedBoxCoords.has(coords.x)) await getDefectBoxPlotImage(coords);

    const setNewCoords = (setCoords) => {
      setCoords((p) => {
        //**bug:map刪除後，第一次click會拿到舊的值，第二次才拿到新的值rquestedMapXValues => 所以要用preValues拿到最新的值(不能直接拿requestedMapCoords)
        if (p.has(coords.x)) {
          return p;
        }
        return new Map(p).set(coords.x, coords.y);
      });
    };
    setNewCoords(setRequestedMapCoords);
    setNewCoords(setRequestedBoxCoords);

    updateAnnotation(coords);
  };

  const updateAnnotation = (coords) => {
    const newLayout = {
      ...chartLayout,
      annotations: [
        {
          x: coords.x,
          y: coords.y,
          xref: "x",
          yref: "y",
          showarrow: true,
          arrowhead: 2,
          arrowsize: 1,
          arrowwidth: 2,
          arrowcolor: "red",
          ax: -30,
          ay: -30,
        },
      ],
    };
    setChartLayout(newLayout);
  };

  const onShapeTimeLineMove = async (e) => {
    if (e["shapes[0].x1"]) {
      setShapeTimeLine((p) => {
        const newShape = {
          ...p,
          x0: e["shapes[0].x0"],
          x1: e["shapes[0].x1"],
          y0: shapeTimeLineYValues.y0,
          y1: shapeTimeLineYValues.y1,
        };
        const newLayout = { ...chartLayout, shapes: [newShape] };
        setChartLayout(newLayout);
        return newShape;
      });
      const defectData = chartRef.current.props.data.find(
        (v) => v.name === "defect_trace"
      );
      const xValues = defectData.x;
      const yValues = defectData.y;
      const targetX = e["shapes[0].x1"];
      const targetIdx = xValues.indexOf(targetX);

      if (targetIdx !== -1) {
        if (
          requestedMapCoords.has(xValues[targetIdx]) &&
          requestedBoxCoords.has(xValues[targetIdx])
        )
          return;

        const coords = { x: xValues[targetIdx], y: yValues[targetIdx] };
        if (!requestedMapCoords.has(xValues[targetIdx])) {
          setRequestedMapCoords((p) => new Map(p).set(coords.x, coords.y));
          await getDefectMapImage(coords);
        }
        if (!requestedBoxCoords.has(xValues[targetIdx])) {
          setRequestedBoxCoords((p) => new Map(p).set(coords.x, coords.y));
          await getDefectBoxPlotImage(coords);
        }
      } else {
        //find two points are close to shape line x value
        for (let i = 0; i < xValues.length - 1; i++) {
          const v = xValues[i];
          const targetNextX = xValues[i + 1];

          if (targetX > v && targetX < targetNextX) {
            const point1 = { x: v, y: yValues[i] };
            const point2 = { x: targetNextX, y: yValues[i + 1] };
            const isMapExistsPoint1 = requestedMapCoords.has(point1.x);
            const isMapExistsPoint2 = requestedMapCoords.has(point2.x);
            const isBoxExistsPoint1 = requestedBoxCoords.has(point1.x);
            const isBoxExistsPoint2 = requestedBoxCoords.has(point2.x);

            if (
              isMapExistsPoint1 &&
              isMapExistsPoint2 &&
              isBoxExistsPoint1 &&
              isBoxExistsPoint2
            ) {
              continue;
            }
            if (!isMapExistsPoint1 && point1.y !== 0) {
              setRequestedMapCoords((p) => new Map(p).set(v, yValues[i]));
              await getDefectMapImage(point1);
            }
            if (!isMapExistsPoint2 && point2.y !== 0) {
              setRequestedMapCoords((p) =>
                new Map(p).set(targetNextX, yValues[i + 1])
              );
              await getDefectMapImage(point2);
            }
            if (!isBoxExistsPoint1 && point1.y !== 0) {
              setRequestedBoxCoords((p) => new Map(p).set(v, yValues[i]));
              await getDefectBoxPlotImage(point1);
            }
            if (!isBoxExistsPoint2 && point2.y !== 0) {
              setRequestedBoxCoords((p) =>
                new Map(p).set(targetNextX, yValues[i + 1])
              );
              await getDefectBoxPlotImage(point2);
            }
          }
        }
      }
    }
  };
  //***************process Wafer Map function here*****************
  const handleWaferMapClick = (idx) => {
    setSelectedMapIdx(idx);
    const x = Array.from(requestedMapCoords.keys())[idx];
    const y = requestedMapCoords.get(x);
    const coords = { x: x, y: y };
    updateAnnotation(coords);
  };

  const removeWaferMap = (idx) => {
    setWaferMapImages((preImages) => preImages.filter((_, i) => i !== idx));
    //delete requested map from record
    setRequestedMapCoords((p) => {
      const newMapCoords = new Map(p);
      const arr = Array.from(p.keys());
      const x = arr[idx];
      newMapCoords.delete(x);

      //if no any map, clear arrow & wafer map red border
      if (newMapCoords.size === 0) {
        const newLayout = { ...chartLayout, annotations: [] };
        setChartLayout(newLayout);
        setSelectedMapIdx(-1);
      }
      return newMapCoords;
    });
  };

  //**************process Box Plot function here****************
  const handleBoxPlotClick = (idx) => {
    setSelectedBoxPlotIdx(idx);
    const x = Array.from(requestedBoxCoords.keys())[idx];
    const y = requestedBoxCoords.get(x);
    const coords = { x: x, y: y };
    updateAnnotation(coords);
  };

  const removeBoxPLot = (idx) => {
    setBoxPlotImages((preImages) => preImages.filter((_, i) => i !== idx));
    setRequestedBoxCoords((p) => {
      const newBoxCoords = new Map(p);
      const arr = Array.from(newBoxCoords.keys());
      const x = arr[idx];
      newBoxCoords.delete(x);

      if (newBoxCoords.size === 0) {
        const newLayout = { ...chartLayout, annotations: [] };
        setChartLayout(newLayout);
        setSelectedBoxPlotIdx(-1);
      }
      return newBoxCoords;
    });
  };

  return (
    <div className="p-10 flex gap-x-5 w-full bg-gray-200 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-5 shadow">
        <Plot
          ref={chartRef}
          data={chartData}
          layout={chartLayout}
          config={{
            responsive: true,
            edits: { shapePosition: true },
          }}
          onClick={showPlotInfo}
          onRelayout={onShapeTimeLineMove}
        />
      </div>
      <div className="w-full bg-white rounded-lg p-5 shadow">
        <div className="flex justify-center">
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab
              label="Box_Plot_Summary"
              style={{
                color: "#1976d2",
              }}
            />
            <Tab
              label="Box_Plot_Date"
              style={{
                color: "#1976d2",
              }}
            />
            <Tab
              label="Wafer_Map"
              style={{
                color: "#1976d2",
              }}
            />
          </Tabs>
        </div>
        <div className="mt-5">
          {tabValue === 0 && (
            <div>
              <BoxPlot image={boxPlotSummaryImage} isSummary={true} />
            </div>
          )}
          {tabValue === 1 && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 mx-auto">
              {boxPlotImages.map((v, i) => (
                <BoxPlot
                  key={`boxplot-date-${i}`}
                  image={v}
                  onClick={() => handleBoxPlotClick(i)}
                  onRemove={() => removeBoxPLot(i)}
                  isSelected={selectedBoxPlotIdx === i}
                />
              ))}
            </div>
          )}
          {tabValue === 2 && (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {waferMapImages.map((v, i) => (
                <WaferMap
                  key={`wafermap-${i}`}
                  image={v}
                  onClick={() => handleWaferMapClick(i)}
                  onRemove={() => removeWaferMap(i)}
                  isSelected={selectedMapIdx === i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefectChart;
