import React, { useState } from "react";
import npwData from "../data/data.json";
import { FormControlLabel, Checkbox, Typography, Paper } from "@mui/material";
import DefectChart from "./component/DefectChart";

const Npw = () => {
  const [data, setData] = useState(npwData);
  const [checkedItems, setCheckedItems] = useState(
    Array(data.length).fill(false)
  );
  const selectedData = data.filter((_, i) => checkedItems[i]);

  return (
    <div className="flex flex-col gap-y-10 p-5">
      <div className="w-full flex flex-col items-center justify-center">
        <Paper elevation={3} className="p-4 w-full max-w-sm text-center">
          <span className="inline-block w-full font-bold text-xl mb-4">
            Select Defect Charts
          </span>
          {data.map((v, i) => (
            <div key={v.CHART_ID} className="mb-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedItems[i]}
                    onChange={(e) => {
                      const newCheckedItems = [...checkedItems];
                      newCheckedItems[i] = e.target.checked;
                      setCheckedItems(newCheckedItems);
                    }}
                    color="primary"
                  />
                }
                label={<Typography variant="body1">{v.CHART_NAME}</Typography>}
              />
            </div>
          ))}
        </Paper>
      </div>
      <div>
        {selectedData.length === 0 && (
          <div className="w-[90vw] h-[50vh] flex justify-center items-center mx-auto border-2 border-dashed border-gray-500 bg-gray-100">
            <span className="text-2xl font-bold">No Selected Chart</span>
          </div>
        )}
        {selectedData.length > 0 && (
          <div className="flex flex-col gap-y-10">
            {selectedData.map((v, i) => (
              <DefectChart key={v.CHART_ID} data={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Npw;