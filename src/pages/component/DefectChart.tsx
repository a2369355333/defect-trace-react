import React, { useState, useEffect, useContext, useRef } from "react";
import moment from "moment";
import Plot from "react-plotly.js";
import WaferMap from "./WaferMap";
import BoxPlot from "./BoxPlot";
import { SystemContext } from "../../context/SystemContext";
import { Tabs, Tab } from "@mui/material";
import { generateBoxPlotBase64, generatePieChartBase64 } from "../../service/generateChart";
import { NpwItem } from "../../types/npw";

interface DefectChartProps {
  data: NpwItem;
}

interface Coords {
  x: number;
  y: number;
  text?: string;
  chartSeq?: number;
}

const DefectChart: React.FC<DefectChartProps> = ({ data }) => {
  const { basicInfo, chartDefectData } = data;

  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLayout, setChartLayout] = useState<any>({
    title: {
      text: basicInfo.CHART_NAME,
      font: { size: 18 },
      x: 0.5,
      xanchor: "center",
      y: 1.5,
      yanchor: "top",
    },
    margin: { t: 50, r: 10, b: 200 },
    hovermode: "closest",
    hoverlabel: { bgcolor: "#FFF" },
    showlegend: true,
    useResizeHandler: true,
    autosize: false,
    width: 850,
    height: 500,
  });

  const [shapeTimeLine, setShapeTimeLine] = useState<any>({
    visible: true,
    type: "line",
    line: { color: "purple", width: 2 },
    layer: "above",
  });

  const [shapeTimeLineYValues, setShapeTimeLineYValues] = useState<{ y0: number; y1: number }>({ y0: 0, y1: 0 });
  const [waferMapImages, setWaferMapImages] = useState<string[]>([]);
  const [boxPlotImages, setBoxPlotImages] = useState<string[]>([]);
  const [boxPlotSummaryImage, setBoxPlotSummaryImage] = useState<string>("");
  const [selectedMapIdx, setSelectedMapIdx] = useState<number>(-1);
  const [selectedBoxPlotIdx, setSelectedBoxPlotIdx] = useState<number>(-1);
  const [requestedMapCoords, setRequestedMapCoords] = useState<Map<number, number>>(new Map());
  const [requestedBoxCoords, setRequestedBoxCoords] = useState<Map<number, number>>(new Map());
  const [tabValue, setTabValue] = useState<number>(0);

  const chartRef = useRef<Plot>(null);
  const { state, dispatch } = useContext(SystemContext);

  const getDefectMapImage = async (coords: Coords) => {
    try {
      const newImage = await generatePieChartBase64(coords.y!);
      setWaferMapImages((prev) => [...prev, newImage]);
    } catch (e) {
      console.error("Error fetching wafer map image:", e);
    }
  };

  const getDefectBoxPlotImage = async (coords: Coords) => {
    try {
      const newImage = await generateBoxPlotBase64(coords.y!);
      setBoxPlotImages((prev) => [...prev, newImage]);
    } catch (e) {
      console.error("Error fetching box plot image:", e);
    }
  };

  const getDefectBoxPlotSummaryImage = async (count: number) => {
    try {
      const newImage = await generateBoxPlotBase64(count);
      setBoxPlotSummaryImage(newImage);
    } catch (e) {
      console.error("Error fetching box plot summary image:", e);
    }
  };

  useEffect(() => {
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
      BATCH: "",
      MarkerColor: "white",
    });

    newChartDefectData.sort((a, b) => moment(a.UPDATE_TIME).diff(moment(b.UPDATE_TIME)));

    const xVals = newChartDefectData.map((v) => v.UPDATE_TIME);
    const yVals = newChartDefectData.map((v) => v.MEAN_VALUE || 0);

    const totalYVal = yVals.reduce((acc, v) => acc + v, 0);
    getDefectBoxPlotSummaryImage(totalYVal);

    const statisticsLine = Array.from({ length: 3 }, (_, i) => i + 1).map((v) => ({
      name: `${v} * sigma`,
      x: Array.from({ length: newChartDefectData.length + 3 }, (_, i) => i - 2),
      y: Array.from({ length: newChartDefectData.length + 3 }, (_, i) => latest50DefectData[0]?.[`AVG${v}STD`] ?? 0),
      type: "scatter",
      mode: "lines",
      textposition: "top",
      line: { color: v === 1 ? "#ff4800" : v === 2 ? "#913500" : "red", width: 2, dash: v > 1 ? "solid" : "dot" },
      hoverinfo: "none",
    }));

    statisticsLine.push({
      name: "X Bar",
      x: Array.from({ length: newChartDefectData.length + 3 }, (_, i) => i - 2),
      y: Array.from({ length: newChartDefectData.length + 3 }, (_, i) => latest50DefectData[0]?.["XBAR"] ?? 0),
      type: "scatter",
      mode: "lines",
      textposition: "top",
      line: { color: "green", width: 1, dash: "solid" },
      hoverinfo: "none",
    });

    const scatterMarkerColors = newChartDefectData.map((v) => v.MarkerColor);
    const textList = xVals.map((v, i) => `<b>Defect Count</b>: ${yVals[i]}<br /><b>${v}</b>`);

    const defectTrace = {
      name: "defect_trace",
      x: xVals.map((_, i) => i),
      y: yVals,
      text: textList,
      xVals: xVals,
      chartSeqs: newChartDefectData.map((v) => v.CHART_SEQ),
      hoverinfo: "text",
      type: "scatter",
      mode: "lines+markers",
      connectgaps: true,
      line: { color: "#196be6", width: 2 },
      marker: { color: scatterMarkerColors, size: 6 },
    };

    setChartData([...statisticsLine, defectTrace]);

    const threeSigmaYVal = statisticsLine.find((v) => v.name === "3 * sigma")?.y[0] ?? 0;
    const maxY = Math.max(...yVals);
    setShapeTimeLineYValues({ y0: 0, y1: maxY });

    const shape = {
      ...shapeTimeLine,
      x0: newChartDefectData.findIndex((v) => moment(v.UPDATE_TIME).isSame(moment(basicInfo.MOVE_IN_TIME))),
      x1: newChartDefectData.findIndex((v) => moment(v.UPDATE_TIME).isSame(moment(basicInfo.MOVE_IN_TIME))),
      y0: 0,
      y1: threeSigmaYVal > maxY ? threeSigmaYVal : maxY,
    };

    setChartLayout({
      ...chartLayout,
      xaxis: {
        ticklabelposition: "outside bottom",
        showgrid: false,
        showline: false,
        automargin: true,
        tickmode: "array",
        tickvals: xVals.map((_, i) => i),
        ticktext: xVals,
        tickangle: -90,
      },
      yaxis: {
        tickvals: yVals,
        ticktext: yVals,
        showgrid: false,
        showline: false,
        title: { text: "Defect Count", standoff: 40 },
      },
      shapes: [shape],
    });
  }, [data]);

  const showPlotInfo = async (e: any) => {
    if (e.points[0].y === 0 || e.points[0].data.name !== "defect_trace") return;
    const currIdx = e.points[0].pointIndex;
    const coords: Coords = {
      x: e.points[0].x,
      y: e.points[0].y,
      text: e.points[0].data.xVals?.[currIdx],
      chartSeq: e.points[0].data.chartSeqs?.[currIdx],
    };

    if (!requestedMapCoords.has(coords.x)) await getDefectMapImage(coords);
    if (!requestedBoxCoords.has(coords.x)) await getDefectBoxPlotImage(coords);

    const setNewCoords = (setCoords: React.Dispatch<React.SetStateAction<Map<number, number>>>) => {
      setCoords((prev) => (prev.has(coords.x) ? prev : new Map(prev).set(coords.x, coords.y!)));
    };

    setNewCoords(setRequestedMapCoords);
    setNewCoords(setRequestedBoxCoords);

    updateAnnotation(coords);
  };

  const updateAnnotation = (coords: Coords) => {
    setChartLayout({
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
    });
  };

  const handleWaferMapClick = (idx: number) => {
    setSelectedMapIdx(idx);
    const x = Array.from(requestedMapCoords.keys())[idx];
    const y = requestedMapCoords.get(x)!;
    updateAnnotation({ x, y });
  };

  const removeWaferMap = (idx: number) => {
    setWaferMapImages((prev) => prev.filter((_, i) => i !== idx));
    setRequestedMapCoords((prev) => {
      const newMap = new Map(prev);
      const key = Array.from(newMap.keys())[idx];
      newMap.delete(key);
      if (newMap.size === 0) {
        setChartLayout((p: any) => ({ ...p, annotations: [] }));
        setSelectedMapIdx(-1);
      }
      return newMap;
    });
  };

  const handleBoxPlotClick = (idx: number) => {
    setSelectedBoxPlotIdx(idx);
    const x = Array.from(requestedBoxCoords.keys())[idx];
    const y = requestedBoxCoords.get(x)!;
    updateAnnotation({ x, y });
  };

  const removeBoxPLot = (idx: number) => {
    setBoxPlotImages((prev) => prev.filter((_, i) => i !== idx));
    setRequestedBoxCoords((prev) => {
      const newMap = new Map(prev);
      const key = Array.from(newMap.keys())[idx];
      newMap.delete(key);
      if (newMap.size === 0) {
        setChartLayout((p: any) => ({ ...p, annotations: [] }));
        setSelectedBoxPlotIdx(-1);
      }
      return newMap;
    });
  };

  return (
    <div className="p-10 flex gap-x-5 w-full bg-gray-200 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-5 shadow">
        <Plot
          ref={chartRef}
          data={chartData}
          layout={chartLayout}
          config={{ responsive: true, edits: { shapePosition: true } }}
          onClick={showPlotInfo}
        />
      </div>

      <div className="w-full bg-white rounded-lg p-5 shadow">
        <div className="flex justify-center">
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              "& .MuiTabs-indicator": { display: "none" }, 
            }}
          >
            <Tab
              label="Box Plot Summary"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1,
                mx: 1,
                px: 3,
                py: 1,
                color: "#1976d2",
                backgroundColor: "#e3f2fd", 
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#1976d2",
                },
                "&:hover": {
                  backgroundColor: "#cfe3fc",
                },
              }}
            />
            <Tab label="Box_Plot_Date" sx={{ display: "none" }} />
            <Tab
              label="Wafer Map Date"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1,
                mx: 1,
                px: 3,
                py: 1,
                color: "#1976d2",
                backgroundColor: "#e3f2fd",
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#1976d2",
                },
                "&:hover": {
                  backgroundColor: "#cfe3fc",
                },
              }}
            />
          </Tabs>

        </div>

        <div className="mt-5">
          {tabValue === 0 && <BoxPlot image={boxPlotSummaryImage} isSummary={true} />}
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
