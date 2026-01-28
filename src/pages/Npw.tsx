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
      <div className="w-full flex flex-col items-center justify-center">
        <Paper elevation={3} className="p-4 w-full max-w-sm text-center">
          <span className="inline-block w-full font-bold text-xl mb-4">
            Select Defect Charts
          </span>

          {/* Render checkboxes for all charts */}
          {data.map((v, i) => (
            <div key={v.basicInfo.CHART_NAME} className="mb-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedItems[i]}
                    onChange={handleCheckboxChange(i)}
                    color="primary"
                  />
                }
                label={<Typography variant="body1">{v.basicInfo.CHART_NAME}</Typography>}
              />
            </div>
          ))}
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
