# Real-Time Cryptocurrency Orderbook and Market Indicators

This Next.js application displays a real-time **orderbook** with associated **market indicators** for cryptocurrency trading, specifically for the **BTC-USD** pair. The application fetches real-time data from an open API and visualizes it using a charting library.

## Features

### 1. **Orderbook Display**
- Displays the real-time orderbook for the **BTC-USD** trading pair.
- Shows the **top 10 levels** of the best bids and asks.
- The orderbook is updated **every 1/10th of a second**.

### Screenshot: Orderbook Display
![Orderbook Display](https://github.com/user-attachments/assets/b732fc44-8d20-40b9-95f4-e8a6e82812f7)


### 2. **Spread Indicator**
- A live graph of the **spread indicator** is displayed, showing the difference between the best bid and best ask prices.
- The graph updates in real-time with every orderbook update.
- The graph is placed **above** the Orderbook Imbalance indicator.

### Screenshot: Spread Indicator
![Spread Indicator](https://github.com/user-attachments/assets/9552d81f-7fad-491c-82e5-1f1bd629ba05)


### 3. **Orderbook Imbalance Indicator**
- The **orderbook imbalance** is calculated based on the current orderbook data.
- The indicator is placed **below** the Spread Indicator and above the Market Depth Chart.

### Screenshot: Orderbook Imbalance Indicator
![Spread and Orderbook imbalance](https://github.com/user-attachments/assets/08458571-0ddc-4990-b131-7acd742fbc44)


### 4. **Market Depth Chart**
- A live **market depth chart** is displayed, representing the current buy and sell orders in the market.
- The chart updates with each orderbook update.
- It provides a current snapshot of market depth, not a historical plot.
- Positioned below the Orderbook Imbalance indicator.

### Screenshot: Market Depth Chart
![Market Depth Chart](https://github.com/user-attachments/assets/fd737bb7-b7c4-4251-8542-90e3d40c0f9a)


### 5. **Responsive Design**
- The application is **fully responsive**, ensuring a great user experience across a variety of screen sizes, from mobile devices to desktops.


## Bonus Features

- **Color-coding and Visual Cues**: 
    - Significant changes in the orderbook or indicators are highlighted using color-coding or visual cues to improve usability.
    - For example, price movements might be highlighted in green (up) or red (down).

- **Switch Between Trading Pairs**: 
    - Users can switch between different trading pairs (e.g., **ETH-USD**, **XRP-USD**) using a dropdown or similar component.

### Preview: Switching Trading Pairs And Skeleton Loading
![Switching Trading Pairs](https://github.com/user-attachments/assets/f2cd6d88-8b84-4659-b1e1-fc9086d95d5e)

### Preview: Light and Dark Mode
![LightDarkMode](https://github.com/user-attachments/assets/ea8495c7-406b-4f4b-bc22-36254808136e)


---

## Technologies Used

- **Frontend**: 
  - [Next.js](https://nextjs.org/) (React framework)
  - [Tailwind CSS](https://tailwindcss.com/) (for responsive design and styling)
  - [Chart.js](https://www.chartjs.org/) (for data visualization)
  - [Material UI](https://mui.com/) (for UI components like Popover, Buttons, etc.)
  
- **API**: 
  - Real-time market data fetched from **Binance API**.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ayansaxena24/OrderBook.git
```

### 2. Install Dependencies
Navigate to the project folder and install the required dependencies:
```bash
cd crypto-orderbook
npm install
```

### 3. Run the Application
Start the development server:
```bash
npm run dev
```

Open your browser and go to http://localhost:3000 to view the application.

## Acknowledgments
Thanks to the developers of Binance for providing open APIs for real-time market data.
The charting functionality is powered by Chart.js, which make it easy to visualize market data.
