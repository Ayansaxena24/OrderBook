import React, { useEffect, useState } from "react";
import { Popover } from "@mui/material";

const GuidedTour = ({
  steps,
  currentStep,
  onNext,
  onClose,
  darkMode,
  onPrev,
}) => {
  const [targetElement, setTargetElement] = useState(null);
  const [targetRect, setTargetRect] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (currentStep < steps.length) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        // Scroll the element into view with smooth behavior
        element.scrollIntoView({
          behavior: "smooth",
          block: "center", // Centers the element in the viewport
        });

        // Wait for scroll to complete before showing popover
        setTimeout(() => {
          setTargetElement(element);
          setAnchorEl(element);
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
        }, 0); 
      }
    }
  }, [currentStep, steps]);

  useEffect(() => {
    // Update target rect when window is scrolled
    const handleScroll = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetElement]);

  if (!targetElement || !targetRect) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0" />

      {/* Spotlight cutout */}
      <div
        className="absolute bg-transparent"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)",
          borderRadius: "8px",
        }}
      >
        {/* Highlight border */}
        <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse" />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            className: "mt-2",
          },
        }}
      >
        <div className={`p-4 max-w-xs ${darkMode ? "bg-black" : "bg-white"}`}>
          <p
            className={`text-sm mb-4 ${darkMode ? "text-white" : "text-black"}`}
          >
            {steps[currentStep]?.content}
          </p>
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip
            </button>
            { currentStep > 0 &&
            <button
              onClick={onPrev}
              className={`px-4 py-2 text-white rounded-md text-sm ${
                currentStep === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={currentStep === 0}
            >
              Back
            </button>
            }

            <button
              onClick={onNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default GuidedTour;
