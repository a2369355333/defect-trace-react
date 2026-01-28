import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close, Visibility } from "@mui/icons-material";

interface WaferMapProps {
  image: string;              // Base64 string or URL of the wafer map image
  isSelected?: boolean;       // Whether this wafer map is currently selected
  onClick?: () => void;       // Callback when wafer map container is clicked
  onRemove?: () => void;      // Callback when the remove button is clicked
}

const WaferMap: React.FC<WaferMapProps> = ({
  image,
  isSelected = false,
  onClick,
  onRemove,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      className={`relative w-[140px] h-[140px] p-3 ${isSelected ? "border-2 border-red-500" : "border border-gray-300"
        }`}
      onClick={onClick}
    >
      {/* Wafer map image */}
      <img src={image} alt="waferMap" />

      {/* Action buttons */}
      <div>
        {/* Remove button */}
        <button
          className="absolute top-0 right-0 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
          onClick={(e) => {
            onRemove?.();
            e.currentTarget.blur(); // Remove focus
          }}
        >
          <Close className="text-gray-400" />
        </button>

        {/* View/enlarge button */}
        <button
          className="absolute bottom-0 right-0.5 rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
          onClick={(e) => {
            setIsDialogOpen(true);
            e.currentTarget.blur();
          }}
        >
          <Visibility className="text-gray-400" />
        </button>
      </div>

      {/* Dialog for enlarged wafer map */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle className="flex justify-between items-center">
          <div className="text-2xl">Wafer Map</div>
          <IconButton
            className="rounded-full hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => setIsDialogOpen(false)}
          >
            <Close className="text-gray-400" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            className="object-contain max-w-full max-h-screen"
            src={image}
            alt="enlargedWaferMap"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaferMap;
