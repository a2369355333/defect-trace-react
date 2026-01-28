import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Close, Visibility } from "@mui/icons-material";

interface BoxPlotProps {
  image: string;  // Base64 string or URL of the box plot image
  isSelected?: boolean;       
  onClick?: () => void;      
  onRemove?: () => void;   
  isSummary?: boolean;        
}

const BoxPlot: React.FC<BoxPlotProps> = ({
  image,
  isSelected = false,
  onClick,
  onRemove,
  isSummary = false,
}) => {
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
      {/* Container for the image */}
      <div
        className={`flex justify-center items-center ${
          isSummary ? "w-[400px] h-[420px]" : "w-[140px] h-[140px]"
        }`}
      >
        <img className="object-contain" src={image} alt="boxPlot" />
      </div>

      {/* Buttons for non-summary plots */}
      {!isSummary && (
        <div>
          {/* Remove button */}
          <button
            className="absolute top-0 right-0 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={(e) => {
              onRemove?.();
              e.currentTarget.blur(); // Remove focus after click
            }}
          >
            <Close className="text-gray-400" />
          </button>

          {/* Enlarge/Visibility button */}
          <button
            className="absolute bottom-0 right-0.5 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={(e) => {
              setIsDialogOpen(true);
              e.currentTarget.blur(); // Remove focus after click
            }}
          >
            <Visibility className="text-gray-400" />
          </button>
        </div>
      )}

      {/* Dialog for enlarged box plot */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle className="flex justify-between items-center">
          <div className="text-2xl">Box Plot</div>
          <button
            className="rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => setIsDialogOpen(false)}
          >
            <Close className="text-gray-400" />
          </button>
        </DialogTitle>

        {/* Dialog content with full-size image */}
        <DialogContent>
          <img
            className="object-contain max-w-full max-h-screen"
            src={image}
            alt="enlargedBoxPlot"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoxPlot;
