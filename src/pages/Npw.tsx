import React, { useState, ChangeEvent } from "react";
import npwData from "../data/data.json";
import { FormControlLabel, Checkbox, Typography, Paper } from "@mui/material";
import DefectChart from "./component/DefectChart";
import { NpwItem } from "../types/npw";

/** Main page component for selecting and displaying defect charts */
const Npw: React.FC = () => {
  const [data] = useState<NpwItem[]>(npwData as NpwItem[]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    Array(data.length).fill(false)
  );
  const selectedData = data.filter((_, i) => checkedItems[i]);

  /** Handle checkbox change for each chart */
  const handleCheckboxChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const newCheckedItems = [...checkedItems];
      newCheckedItems[index] = e.target.checked;
      setCheckedItems(newCheckedItems);
    };

  return (
    <div className="flex flex-col gap-y-10 p-5">
      {/* Chart selection panel */}
      <div className="w-full flex flex-col items-center">
        <Paper className="p-6 w-full max-w-4xl bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Select Defect Charts
          </h2>

          {/* Grid of checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.map((v, i) => (
              <div
                key={v.basicInfo.CHART_NAME}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
              ${checkedItems[i] ? "bg-blue-50 border-blue-400 shadow-md" : "bg-white border-gray-200 hover:shadow-md"}
            `}
                onClick={() => {
                  const newChecked = [...checkedItems];
                  newChecked[i] = !newChecked[i];
                  setCheckedItems(newChecked);
                }}
              >
                <span className="font-medium text-gray-700">{v.basicInfo.CHART_NAME}</span>
                <Checkbox checked={checkedItems[i]} color="primary" />
              </div>
            ))}
          </div>
        </Paper>
      </div>

      {/* Display selected charts */}
      <div>
        {/* Show message if no chart is selected */}
        {selectedData.length === 0 && (
          <div className="w-[90vw] h-[50vh] flex justify-center items-center mx-auto border-2 border-dashed border-gray-500 bg-gray-100">
            <span className="text-2xl font-bold">No Selected Chart</span>
          </div>
        )}

        {/* Render selected charts */}
        {selectedData.length > 0 && (
          <div className="flex flex-col gap-y-10">
            {selectedData.map((v) => (
              <DefectChart key={v.basicInfo.CHART_NAME} data={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Npw;
