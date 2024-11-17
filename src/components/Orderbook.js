"use client";

import { useEffect, useState } from "react";
import { connectToOrderbookWebSocket } from "../../lib/binance";
import { motion } from "framer-motion";
// import { TourProvider, useTour } from '@reactour/tour';
import MarketDepthChart from "./MarketDepthChart";
import SpreadIndicator from "./SpreadIndicator";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import GuidedTour from "./GuidedTour";

export default function Orderbook() {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [spreadHistory, setSpreadHistory] = useState([]);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [tradingPairs, setTradingPairs] = useState("btc");
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(true);

  // const { setIsOpen } = useTour()

  // Popover states
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  // Popover handlers
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleNext = () => {
    handlePopoverClose();
    setCurrentStep((prev) => prev + 1);
  };

  // Determine if popover is open
  // const open = Boolean(anchorEl);
  // const id = open ? 'trading-pairs-popover' : undefined;

  // Example guide steps
  const guideSteps = [
    {
      target: ".btc-title",
      content: "Welcome to the BTC-USD Orderbook. This is the main title!",
    },
    {
      target: ".current-spread",
      content: "Here, you can see the current spread between bids and asks. \n Spread = Best Ask Price − Best Bid Price",
    },
    {
      target: ".orderbook-imbalance",
      content: "Here, you can see the current orderbook imbalance.",
    },
    {
      target: ".spread-history",
      content: "This chart displays the spread history over time.",
    },
    {
      target: ".orderbook-table",
      content: "This table shows the current orderbook bids and asks.",
    },
    {
      target: ".market-depth",
      content:
        "Finally, this chart gives you a visual representation of the market depth.",
    },
    // Add more steps as needed
  ];

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setVisited(false);
      startTour();
      localStorage.setItem("hasVisited", true);
    }
  },[])

  useEffect(() => {
    if (isTourActive) {
      // Only run if tour is active
      const targetElement = document.querySelector(
        guideSteps[currentStep]?.target
      );
      if (targetElement && currentStep < guideSteps.length) {
        handlePopoverOpen({ currentTarget: targetElement });
      }
    }
  }, [currentStep, isTourActive]);

  useEffect(() => {
    setLoading(true); // Reset loading to true when tradingPairs changes
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [tradingPairs]);

  useEffect(() => {
    const ws = connectToOrderbookWebSocket(setOrderbook, tradingPairs);
    return () => {
      if (ws && ws.close) ws.close();
    };
  }, []);

  const startTour = () => {
    setCurrentStep(0); // Reset to first step
    setIsTourActive(true);
    setVisited(false);
  };

  // Modify your close handler to reset the tour
  const handleTourClose = () => {
    setCurrentStep(guideSteps.length);
    handlePopoverClose();
    setIsTourActive(false);
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const calculateSpread = (bids, asks) => {
    if (bids.length === 0 || asks.length === 0) return 0;
    const bestBid = parseFloat(bids[0][0]);
    const bestAsk = parseFloat(asks[0][0]);
    return bestAsk - bestBid;
  };

  useEffect(() => {
    const spread = calculateSpread(orderbook.bids, orderbook.asks);
    setCurrentSpread(spread);

    setSpreadHistory((prev) => {
      const now = Date.now();
      const newPoint = { x: now, y: spread };

      const filtered = [...prev, newPoint].filter(
        (point) => now - point.x <= 60000
      );

      if (filtered.length > 60) {
        const step = Math.floor(filtered.length / 60);
        return filtered.filter((_, index) => index % step === 0);
      }

      return filtered;
    });
  }, [orderbook]);

  const calculateImbalance = (bids, asks) => {
    const bidVolume = bids.reduce(
      (sum, [_, amount]) => sum + parseFloat(amount),
      0
    );
    const askVolume = asks.reduce(
      (sum, [_, amount]) => sum + parseFloat(amount),
      0
    );
    return (bidVolume - askVolume) / (bidVolume + askVolume);
  };

  const imbalance = calculateImbalance(orderbook.bids, orderbook.asks);

  const handleSelect = (e) => {
    setTradingPairs(e.target.value);
  };

  const handleTitle = () => {
    if (tradingPairs === "btc") {
      return "BTC-USD Orderbook";
    } else if (tradingPairs === "eth") {
      return "ETH-USD Orderbook";
    }
    return "LTC-USD Orderbook";
  };

  return (
    <>
      {!visited && currentStep < guideSteps.length && (
        <GuidedTour
          steps={guideSteps}
          currentStep={currentStep}
          onNext={handleNext}
          onClose={handleTourClose}
          darkMode={darkMode}
        />
      )}
      <div className={`w-[100%] ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto p-4 space-y-6"
      >
        <div className="flex justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-2xl font-bold text-green-800 btc-title"
          >
            {handleTitle()}
          </motion.h1>
          <div className="w-[40%] flex justify-between">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              onClick={startTour}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600"
            >
              Start Tour
            </motion.button>
            <motion.select
              value={tradingPairs}
              onChange={handleSelect}
              className={`bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm`}
            >
              <option value="btc">BTC-USD</option>
              <option value="eth">ETH-USD</option>
              <option value="xrp">LTC-USD</option>
            </motion.select>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              onClick={handleDarkMode}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {loading ? (
            <SkeletonTheme baseColor={`${darkMode ? '#202020' : '#e5e5e5'}`} highlightColor={`${darkMode ? '#444' : '#f5f5f5'}`}>
              <Skeleton height={100} />
            </SkeletonTheme>
          ) : (
            <div
              className={`current-spread hover:scale-105 transition-all transition-duration-300 ease-in-out p-4 rounded-lg shadow-md ${
                darkMode
                  ? "bg-gradient-to-r from-gray-700 via-gray-900 to-black hover:bg-gradient-to-l hover:from-gray-700 hover:via-gray-900 hover:to-black"
                  : "bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:bg-gradient-to-l hover:from-gray-200 hover:via-gray-100 hover:to-white"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Current Spread
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                ${currentSpread.toFixed(2)}
              </p>
            </div>
          )}
          {loading ? (
            <SkeletonTheme baseColor={`${darkMode ? '#202020' : '#e5e5e5'}`} highlightColor={`${darkMode ? '#444' : '#f5f5f5'}`}>
              <Skeleton height={100} />
            </SkeletonTheme>
          ) : (
            <div
              className={`orderbook-imbalance transition-all transition-duration-300 ease-in-out p-4 rounded-lg shadow-md ${
                darkMode
                  ? "bg-gradient-to-r from-gray-700 via-gray-900 to-black"
                  : "bg-gradient-to-r from-white via-gray-100 to-gray-200"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Orderbook Imbalance
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {(imbalance * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </motion.div>

        {loading ? (
            <SkeletonTheme baseColor={`${darkMode ? '#202020' : '#e5e5e5'}`} highlightColor={`${darkMode ? '#444' : '#f5f5f5'}`}>
            <Skeleton height={400} className="mt-6" />
          </SkeletonTheme>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`spread-history transition-all transition-duration-300 ease-in-out p-4 rounded-lg shadow-md ${
              darkMode
                ? "bg-gradient-to-r from-gray-700 via-gray-900 to-black"
                : "bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:bg-gradient-to-l hover:from-gray-200 hover:via-gray-100 hover:to-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Spread History
            </h2>
            <div className="h-[400px]">
              <SpreadIndicator spreadHistory={spreadHistory} tradingPairs={tradingPairs} />
            </div>
          </motion.div>
        )}

        {loading ? (
            <SkeletonTheme baseColor={`${darkMode ? '#202020' : '#e5e5e5'}`} highlightColor={`${darkMode ? '#444' : '#f5f5f5'}`}>
            <Skeleton height={400} className="mt-6" />
          </SkeletonTheme>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className={`orderbook-table transition-all transition-duration-300 ease-in-out p-4 rounded-lg shadow-md overflow-x-auto ${
              darkMode
                ? "bg-gradient-to-r from-gray-700 via-gray-900 to-black"
                : "bg-gradient-to-r from-white via-gray-100 to-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Order Book
            </h2>
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Bids (Price)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Bids (Amount)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Asks (Price)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Asks (Amount)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    className="border-t border-gray-100"
                  >
                    <td className="px-4 py-2 text-green-600">
                      {orderbook.bids[index]?.[0] || "-"}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {orderbook.bids[index]?.[1] || "-"}
                    </td>
                    <td className="px-4 py-2 text-red-600">
                      {orderbook.asks[index]?.[0] || "-"}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {orderbook.asks[index]?.[1] || "-"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {loading ? (
            <SkeletonTheme baseColor={`${darkMode ? '#202020' : '#e5e5e5'}`} highlightColor={`${darkMode ? '#444' : '#f5f5f5'}`}>
            <Skeleton height={400} className="mt-6" />
          </SkeletonTheme>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className={`market-depth transition-all transition-duration-300 ease-in-out p-4 rounded-lg shadow-md ${
              darkMode
                ? "bg-gradient-to-r from-gray-700 via-gray-900 to-black"
                : "bg-gradient-to-r from-white via-gray-100 to-gray-200 hover:bg-gradient-to-l hover:from-gray-200 hover:via-gray-100 hover:to-white"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Market Depth
            </h2>
            <div className="h-[400px]">
              <MarketDepthChart bids={orderbook.bids} asks={orderbook.asks} />
            </div>
          </motion.div>
        )}
      </motion.div>
      </div>
    </>
  );
}
