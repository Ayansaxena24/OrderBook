// lib/binance.js
export function connectToOrderbookWebSocket(onData, tradingPairs) {
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${tradingPairs}usdt@depth10@100ms`);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onData(data);
    };
  
    socket.onerror = (error) => console.error('WebSocket error:', error);
  
    return () => socket.close();
  }
  