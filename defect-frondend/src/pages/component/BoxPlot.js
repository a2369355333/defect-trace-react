import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import { Close, Visibility } from "@mui/icons-material";

const BoxPlot = (props) => {
  const { image, isSelected, onClick, onRemove, isSummary } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      className={`relative flex justify-center items-center 
            ${isSelected && !isSummary
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
      onClick={onClick}
    >
      <div
        className={`flex justify-center items-center ${
          isSummary ? "w-[400px] h-[420px]" : "w-[140px] h-[140px]"
        }`}
      >
        <img className="object-contain" src={image} alt="boxPlot" />
      </div>
      {!isSummary && (
        <div>
          <button
            className="absolute top-0 right-0 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={onRemove}
          >
            <Close className="text-gray-400" />
          </button>
          <button
            className="absolute bottom-0 right-0.5 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => setIsDialogOpen(true)}
          >
            <Visibility className="text-gray-400" />
          </button>
        </div>
      )}

      <Dialog open={isDialogOpen} onClose={isDialogOpen}>
        <DialogTitle className="flex justify-between items-center">
          <div className="text-2xl">Box Plot</div>
          <button
            className="rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => setIsDialogOpen(false)}
          >
            <Close className="text-gray-400" />
          </button>
        </DialogTitle>
        <DialogContent>
          <img className="object-contain max-w-full max-h-screen" src={image} alt="enlargedBoxPlot" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoxPlot;
