import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Chart from "react-google-charts";
import Navbar_loggedin from "../Elements/Navbars/navbar_loggedin";
import marketData from "../data/MoversData.json";
function ApiTest() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [graphData, setGraphData] = useState([
    ["Day", "Low", "Open", "Close", "High"],
  ]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [mostActive, setMostActive] = useState([]);
  const [loading, setLoading] = useState(false);

  const options = {
    legend: { position: "top" },
    backgroundColor: "#1e1e2f",
    hAxis: { title: "Time" },
    vAxis: { title: "Stock Price" },
    candlestick: {
      fallingColor: { fill: "#f6465d" },
      risingColor: { fill: "#0ccb80" },
    },
    explorer: {
      maxZoomOut: 2,
      keepInBounds: true,
    },
  };

  const fetchStockData = async () => {
    if (!symbol) {
      alert("Please enter a valid stock symbol.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&apikey=YOUR_API_KEY`
      );
      const result = await response.json();
      if (result.values) {
        setData(result.values);
        prepareGraphData(result.values);
      } else {
        alert(result.message || "Invalid Symbol or API Limit Reached.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    setLoading(false);
  };

  const prepareGraphData = (stockData) => {
    const formattedData = stockData.map((entry) => [
      entry.datetime,
      parseFloat(entry.low),
      parseFloat(entry.open),
      parseFloat(entry.close),
      parseFloat(entry.high),
    ]);
    setGraphData([graphData[0], ...formattedData]);
    setStatus(stockData[0]);
  };

  const fetchMarketMovers = async () => {
    setLoading(true);
    const apiKey = "YOUR_API_KEY";
    try {
      // const response = await fetch(
      //   `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`
      // );
      const result = marketData;
      if (result && result.metadata) {
        setTopGainers(result.top_gainers || []);
        setTopLosers(result.top_losers || []);
        setMostActive(result.most_actively_traded || []);
      } else {
        console.error("Error fetching market movers.");
      }
    } catch (error) {
      console.error("Error fetching market movers:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMarketMovers();
  }, []);

  return (
    <>
      <Navbar_loggedin />
      <main className="container" style={{ color: "white", marginTop: "30px" }}>
        {/* Search Section */}
        <Box
      sx={{
        textAlign: 'center',
        padding: '1rem', // Reduced vertical padding for more compact height
        background: 'linear-gradient(135deg, #0f172a, #2a3650)', // Dark blue gradient background
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        maxWidth: 600, // Increased width to make it more spacious
        margin: '0 auto',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: '1rem', // Reduced margin to balance the height
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.8rem',
        }}
      >
        Stock Search
      </Typography>

      {/* Input field */}
      <TextField
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="e.g., AAPL, TSLA"
        fullWidth
        variant="outlined"
        sx={{
          mb: 2,
          backgroundColor: 'white',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#c1c1c1', // Subtle light gray border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#c1c1c1',
            },
          },
        }}
        InputProps={{
          style: {
            fontSize: '1.2rem',
            color: '#333', // Dark text for better contrast
          },
        }}
      />

      {/* Search Button */}
      <Button
        onClick={fetchStockData}
        variant="contained"
        fullWidth
        sx={{
          padding: '0.8rem',
          backgroundColor: '#4e5b6e', // Subtle, muted blue color for button
          color: 'white',
          fontSize: '1.2rem',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#65778d', // Slightly lighter blue on hover
            transform: 'scale(1.05)',
          },
          transition: 'transform 0.3s ease, background-color 0.3s',
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
      </Button>

      {/* Loading message */}
      {loading && (
        <Typography variant="body2" sx={{ mt: 1, color: 'white' }}>
          Loading...
        </Typography>
      )}
    </Box>

        {/* Candlestick Chart */}
        {graphData.length > 1 && (
          <section className="graph-section" style={{ marginTop: "2rem" }}>
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "1.8rem",
                color: "#0ccb80",
              }}
            >
              Candlestick Chart
            </h3>
            <div
              style={{
                background: "#0f172a",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Chart
                width={"100%"}
                height={450}
                chartType="CandlestickChart"
                loader={<div>Loading Chart...</div>}
                data={graphData}
                options={options}
              />
            </div>
          </section>
        )}

        {/* Stock Status Section */}
        {status && (
          <section className="status-section" style={{ marginTop: "2rem" }}>
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "1.8rem",
                color: "#0ccb80",
              }}
            >
              Stock Status
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                backgroundColor: "#1e293b",
                padding: "2rem",
                borderRadius: "10px",
              }}
            >
              {Object.keys(status).map((key) => (
                <div
                  key={key}
                  style={{
                    background: key.includes("change") ? "#f6465d" : "#0ccb80",
                    color: "white",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong>{key}:</strong> {status[key]}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Gainers, Losers, and Active Stocks */}
        <section style={{ marginTop: "3rem" }}>
          {/* Main Title */}
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 3,
              color: "#c9aa77",
              fontWeight: "bold",
              textShadow: "0 0 10px rgba(209, 192, 122, 0.61)",
            }}
          >
            Market Movers
          </Typography>

          {/* Top Gainers Section */}
          <div style={{ marginBottom: "2rem" }}>
            <Typography
              variant="h4"
              align="center"
              sx={{ mb: 1, color: "#0ccb80", fontWeight: "bold" }}
            >
              Top Gainers
            </Typography>
            <Grid container spacing={3}>
              {topGainers.length > 0 ? (
                topGainers.slice(0, 6).map((stock, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      sx={{
                        background: "#2e2f46", // Dark gray background
                        borderRadius: "15px",
                        boxShadow: 3,
                        transition:
                          "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 6,
                          backgroundColor: "#3a3b4f", // Slightly lighter on hover for contrast
                        },
                      }}
                    >
                      <CardContent sx={{ padding: "1.5rem" }}>
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ color: "#0ccb80", fontSize: "1.6rem" }}
                          >
                            {stock.ticker}
                          </Typography>
                          <Tooltip title={`+${stock.change_percentage}%`} arrow>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#0ccb80",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                              }}
                            >
                              <ArrowUpwardIcon
                                sx={{ fontSize: 16, marginRight: 0.5 }}
                              />
                              {stock.change_percentage}%
                            </Typography>
                          </Tooltip>
                        </Grid>

                        <Box mt={2}>
                          <Typography
                            variant="body1"
                            sx={{ color: "white", fontSize: "1.1rem" }}
                          >
                            <strong>Price:</strong> ${stock.price}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ color: "white", fontSize: "1.1rem" }}
                          >
                            <strong>Change Amount:</strong> $
                            {stock.change_amount}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ color: "white", fontSize: "1.1rem" }}
                          >
                            <strong>Volume:</strong> {stock.volume}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="gray" align="center">
                    No data available
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>

          {/* Top Losers Section */}
          <div style={{ marginBottom: "2rem" }}>
            <Typography
              variant="h4"
              align="center"
              sx={{ mb: 1, color: "#f6465d", fontWeight: "bold" }}
            >
              Top Losers
            </Typography>
            <Grid container spacing={3}>
              {topLosers.length > 0 ? (
                topLosers.slice(0, 6).map((stock, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                   <Card
  sx={{
    background: "#2e2f46", // Dark gray background
    borderRadius: "15px",
    boxShadow: 3,
    transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: 6,
      backgroundColor: "#3a3b4f", // Slightly lighter on hover for contrast
    },
  }}
>
  <CardContent sx={{ padding: "1.5rem" }}>
    <Grid container justifyContent="space-between" alignItems="center">
      {/* Stock Ticker */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: "#f6465d", fontSize: "1.6rem" }} // Red for losers
      >
        {stock.ticker}
      </Typography>
      
      {/* Change Percentage */}
      <Tooltip title={`-${stock.change_percentage}%`} arrow>
        <Typography
          variant="body1"
          sx={{
            color: "#f6465d", // Red for losers
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.2rem", // Increased font size
          }}
        >
          <ArrowDownwardIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
          {stock.change_percentage}%
        </Typography>
      </Tooltip>
    </Grid>

    {/* Stock Details */}
    <Box mt={2}>
      <Typography variant="body1" sx={{ color: "white", fontSize: "1.1rem" }}>
        <strong>Price:</strong> ${stock.price}
      </Typography>
      <Typography variant="body1" sx={{ color: "white", fontSize: "1.1rem" }}>
        <strong>Change Amount:</strong> ${stock.change_amount}
      </Typography>
      <Typography variant="body1" sx={{ color: "white", fontSize: "1.1rem" }}>
        <strong>Volume:</strong> {stock.volume}
      </Typography>
    </Box>
  </CardContent>
</Card>

                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="gray" align="center">
                    No data available
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>

          {/* Most Active Section */}
          <div>
            <Typography
              variant="h4"
              align="center"
              sx={{ mb: 1, color: "#808080", fontWeight: "bold" }}
            >
              Most Active
            </Typography>
            <Grid container spacing={3}>
              {mostActive.length > 0 ? (
                mostActive.slice(0, 6).map((stock, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
  sx={{
    background: "#2e2f46", // Dark gray background
    borderRadius: "15px",
    boxShadow: 3,
    transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: 6,
      backgroundColor: "#3a3b4f", // Slightly lighter on hover for contrast
    },
  }}
>
  <CardContent sx={{ padding: "1.5rem" }}>
    <Grid container justifyContent="space-between" alignItems="center">
      {/* Stock Ticker */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: "#808080", fontSize: "1.6rem" }} // Lighter gray for most active
      >
        {stock.ticker}
      </Typography>

      {/* Change Percentage */}
      <Tooltip title={`${stock.change_percentage}%`} arrow>
        <Typography
          variant="body1"
          sx={{
            color: "#808080", // Light gray for most active percentage
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.2rem", // Increased font size
          }}
        >
          {stock.change_percentage}%
        </Typography>
      </Tooltip>
    </Grid>

    {/* Stock Details */}
    <Box mt={2}>
      <Typography variant="body1" sx={{ color: "white", fontSize: "1.1rem" }}>
        <strong>Price:</strong> ${stock.price}
      </Typography>
      <Typography variant="body1" sx={{ color: "white", fontSize: "1.1rem" }}>
        <strong>Change Amount:</strong> ${stock.change_amount}
      </Typography>
      <Typography variant="body1" sx={{ color: "white", fontSize: "1.1rem" }}>
        <strong>Volume:</strong> {stock.volume}
      </Typography>
    </Box>
  </CardContent>
</Card>

                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="gray" align="center">
                    No data available
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>
        </section>
      </main>
    </>
  );
}

export default ApiTest;
