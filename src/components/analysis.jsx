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
  Chip,
  Divider,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Chart from "react-google-charts";
import Navbar_loggedin from "../Elements/Navbars/navbar_loggedin";
import marketData from "../data/MoversData.json";
import timeSeries from "../data/timeSeries.json";
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
    chartArea: {
      width: "85%",
      height: "70%",
    },
    backgroundColor: "#0f172a",
    candlestick: {
      fallingColor: { stroke: "#dc2626", fill: "#dc2626" }, // Red for price drops
      risingColor: { stroke: "#16a34a", fill: "#16a34a" }, // Green for price gains
    },
    legend: {
      position: "none",
    },
    hAxis: {
      title: "Date and Time",
      textStyle: {
        color: "#e2e8f0",
        fontSize: 12,
      },
      titleTextStyle: {
        color: "#94a3b8",
        fontSize: 14,
      },
      slantedText: true,
      slantedTextAngle: 35,
      showTextEvery: Math.ceil(graphData.length / 5),
    },
    vAxis: {
      title: "Price",
      textStyle: {
        color: "#e2e8f0",
        fontSize: 12,
      },
      titleTextStyle: {
        color: "#94a3b8",
        fontSize: 14,
      },
    },
  };

  const fetchStockData = async () => {
    if (!symbol) {
      alert("Please enter a valid stock symbol.");
      return;
    }
    setLoading(true);
    try {
      // const response = await fetch(
      //   // `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&apikey=YOUR_API_KEY`
      //   `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=JBQTJBWV8LLJYL6Y`
      // );
      const result = timeSeries;
      if (result["Time Series (5min)"]) {
        const stockData = result["Time Series (5min)"];
        setData(Object.values(stockData)); // Set stock data
        prepareGraphData(stockData); // Prepare the graph data
      } else {
        alert(
          result["Meta Data"]?.message || "Invalid Symbol or API Limit Reached."
        );
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    setLoading(false);
  };

  const prepareGraphData = (stockData) => {
    let dayHigh = -Infinity; // Initialize to the lowest possible value
    let dayLow = Infinity; // Initialize to the highest possible value

    const formattedData = Object.keys(stockData).map((datetime) => {
      const entry = stockData[datetime];
      const low = parseFloat(entry["3. low"]);
      const high = parseFloat(entry["2. high"]);

      // Update day's high and low
      if (low < dayLow) dayLow = low;
      if (high > dayHigh) dayHigh = high;

      return [
        datetime, // x-axis: date and time
        low, // y-axis: low
        parseFloat(entry["1. open"]), // y-axis: open
        parseFloat(entry["4. close"]), // y-axis: close
        high, // y-axis: high
      ];
    });

    setGraphData([graphData[0], ...formattedData]); // Update graph data

    // Set the status to include day's high and low
    setStatus({
      open: stockData[Object.keys(stockData)[0]]["1. open"],
      close: stockData[Object.keys(stockData)[0]]["4. close"],
      high: dayHigh, // Day's high
      low: dayLow, // Day's low
    });
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
            textAlign: "center",
            padding: "1rem",
            background: "linear-gradient(135deg, #0f172a, #2a3650)",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "1rem", 
              color: "white",
              fontWeight: "bold",
              fontSize: "1.8rem",
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
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#c1c1c1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#c1c1c1",
                },
              },
            }}
            InputProps={{
              style: {
                fontSize: "1.2rem",
                color: "#333",
              },
            }}
          />

          {/* Search Button */}
          <Button
            onClick={fetchStockData}
            variant="contained"
            fullWidth
            sx={{
              padding: "0.8rem",
              backgroundColor: "#4e5b6e", 
              color: "white",
              fontSize: "1.2rem",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#65778d", 
                transform: "scale(1.05)",
              },
              transition: "transform 0.3s ease, background-color 0.3s",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Search"
            )}
          </Button>

          {/* Loading message */}
          {loading && (
            <Typography variant="body2" sx={{ mt: 1, color: "white" }}>
              Loading...
            </Typography>
          )}
        </Box>

        {/* Candlestick Chart */}
        {graphData.length > 1 && (
          <section
            className="graph-section"
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              borderRadius: "15px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.4)",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.1rem",
                fontSize: "2rem",
                fontWeight: "600",
                color: "#14b8a6",
              }}
            >
              Candlestick Chart
            </h3>
            <div
              style={{
                background: "#0f172a",
                padding: "1.5rem",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                border: "1px solid #334155",
              }}
            >
              <Chart
                width={"100%"}
                height={450}
                chartType="CandlestickChart"
                loader={
                  <div
                    style={{
                      textAlign: "center",
                      color: "#14b8a6",
                      fontSize: "1.2rem",
                      fontWeight: "500",
                    }}
                  >
                    <div
                      className="loader"
                      style={{ margin: "1rem auto" }}
                    ></div>
                    Fetching stock data...
                  </div>
                }
                data={graphData}
                options={{
                  ...options,
                  chartArea: {
                    width: "85%",
                    height: "70%",
                  },
                  backgroundColor: "#0f172a",
                  candlestick: {
                    fallingColor: { stroke: "#dc2626", fill: "#dc2626" }, // Red for price drops
                    risingColor: { stroke: "#16a34a", fill: "#16a34a" }, // Green for price gains
                  },
                  legend: {
                    position: "none",
                  },
                  hAxis: {
                    textStyle: { color: "#e2e8f0" },
                    titleTextStyle: { color: "#94a3b8" },
                  },
                  vAxis: {
                    textStyle: { color: "#e2e8f0" },
                    titleTextStyle: { color: "#94a3b8" },
                  },
                }}
              />
            </div>
          </section>
        )}

        {/* Stock Status Section */}
        {status && (
          <Box sx={{ mt: 4, px: 2, py: 1 }}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 4,
                fontSize: "2rem",
                fontWeight: 700,
                color: "#1a73e8",
                letterSpacing: 1.1,
              }}
            >
              Stock Status Overview
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {Object.keys(status).map((key) => (
                <Grid item xs={6} sm={3} md={3} key={key}>
                  <Card
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#212121",
                      borderRadius: "12px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                      maxWidth: "300px", // Limit card width to keep it compact
                      margin: "0 auto", // Center the card horizontally
                      "&:hover": {
                        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                        transform: "translateY(-5px)",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 1,
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          color: "#37474f",
                          textTransform: "capitalize",
                        }}
                      >
                        {key.replace(/_/g, " ")}{" "}
                        {/* Replace underscores for better readability */}
                      </Typography>
                      <Divider sx={{ my: 1.5, borderColor: "#e0e0e0" }} />
                      <Chip
                        label={status[key]}
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          px: 1.5,
                          py: 0.5,
                          color: key.includes("change") ? "#d32f2f" : "#388e3c",
                          backgroundColor: key.includes("change")
                            ? "rgba(211, 47, 47, 0.1)"
                            : "rgba(56, 142, 60, 0.1)",
                          border: "1px solid",
                          borderColor: key.includes("change")
                            ? "#d32f2f"
                            : "#388e3c",
                          borderRadius: "8px",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Top Gainers, Losers, and Active Stocks */}
        <section style={{ marginTop: "3rem", marginBottom: "3rem" }}>
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
                              <ArrowDownwardIcon
                                sx={{ fontSize: 18, marginRight: 0.5 }}
                              />
                              {stock.change_percentage}%
                            </Typography>
                          </Tooltip>
                        </Grid>

                        {/* Stock Details */}
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
        </section>
      </main>
    </>
  );
}

export default ApiTest;
