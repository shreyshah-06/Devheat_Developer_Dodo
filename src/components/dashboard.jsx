import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Home, BarChart, HelpOutline } from "@mui/icons-material";
import Navbar_loggedin from "../Elements/Navbars/navbar_loggedin";
import ProfitImg from "../Assets/Profit.svg";
import WalletImg from "../Assets/Wallet.svg";
import UserImg from "../Assets/User.svg";

function Dashboard() {
  const [totalProfit, setTotalProfit] = useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [user, setUser] = useState({
    portfolio: [],
    transactions: [],
    balance: 0,
    username: "Guest",
  });

  const token = localStorage.getItem("user");

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "BEARER " + token,
        },
      });
      const data = await response.json();
      setUser(data.userData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    let sum = 0;
    user.transactions.forEach((element) => {
      if (element.trade === "buy") sum -= element.price * element.qty;
      else sum += element.price * element.qty;
    });
    setTotalProfit(sum);
  }, [user.transactions]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const sidebarTabs = [
    { label: "Dashboard", icon: <Home />, link: "/dashboard" },
    { label: "Analysis", icon: <BarChart />, link: "/analysis" },
    { label: "Help", icon: <HelpOutline />, link: "#" },
  ];

  const renderPortfolio = user.portfolio.length ? (
    user.portfolio.map((element, index) => (
      <Box
        key={index}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 3,
          bgcolor: "rgba(40, 55, 70, 0.9)",
          color: "white", 
          borderRadius: 2,
          mb: 2,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)", 
          transition: "background-color 0.3s", 
          "&:hover": {
            bgcolor: "rgba(50, 70, 85, 1)",
            cursor: "pointer", 
          },
        }}
      >
        <Typography
          sx={{
            textTransform: "capitalize",
            color: "#D1D1D1",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {element.stock}
        </Typography>
        <Typography
          sx={{
            color: "#D1D1D1",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {element.qty}
        </Typography>
        <Typography
          sx={{
            color: "#D1D1D1",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          ${element.price}
        </Typography>
      </Box>
    ))
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "200px",
        textAlign: "center",
        bgcolor: "rgba(35, 47, 62, 0.9)",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ color: "#F2F2F2" }}>
        No stocks in your portfolio yet. Start investing today!
      </Typography>
    </Box>
  );

  const renderTransactions = user.transactions.length ? (
    user.transactions.map((element, index) => (
      <Box
        key={index}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 3,
          bgcolor: "rgba(40, 55, 70, 0.9)",
          color: "white", 
          borderRadius: 2,
          mb: 2,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)", 
          transition: "background-color 0.3s", 
          "&:hover": {
            bgcolor: "rgba(50, 70, 85, 1)",
            cursor: "pointer", 
          },
        }}
      >
        {/* Stock Column */}
        <Typography
          sx={{
            textTransform: "capitalize",
            color: "#D1D1D1", 
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {element.stock}
        </Typography>

        {/* Trade Column */}
        <Typography
          sx={{
            textTransform: "capitalize",
            color: "#D1D1D1", 
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {element.trade}
        </Typography>

        {/* Qty Column */}
        <Typography
          sx={{
            color: "#D1D1D1", 
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {element.qty}
        </Typography>

        {/* Price Column */}
        <Typography
          sx={{
            color: "#D1D1D1", 
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          ${element.price}
        </Typography>
      </Box>
    ))
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "200px",
        textAlign: "center",
        bgcolor: "rgba(35, 47, 62, 0.9)", 
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ color: "#F2F2F2" }}>
        No transactions yet. Start trading now to see your history!
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar_loggedin />
      <Grid container sx={{ height: "87vh" }}>
        {/* Sidebar */}
        <Grid
          item
          md={2}
          sx={{
            bgcolor:
              "radial-gradient(circle at 5% 23%, rgba(0, 40, 83, 1) 2%, rgba(4, 12, 24, 1) 25%)",
            color: "white",
            py: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "300px",
            borderRadius: "15px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <List>
            {sidebarTabs.map((tab, idx) => (
              <ListItem
                key={idx}
                button
                component={Link}
                to={tab.link}
                onClick={() => handleTabChange(tab.label)}
                sx={{
                  mb: 2,
                  bgcolor: activeTab === tab.label ? "#004080" : "inherit",
                  color: activeTab === tab.label ? "white" : "inherit",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#00509e", color: "white" },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  {tab.icon}
                </ListItemIcon>
                <Typography
                  primary={tab.label}
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: activeTab === tab.label ? "bold" : "normal",
                    paddingY: 1,
                  }}
                >
                  {tab.label}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        {/* Main Content */}
        <Grid
          item
          md={10}
          sx={{
            p: 3,
            bgcolor: "#f8f9fa",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            container
            justifyContent="space-around"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            {[
              {
                img: UserImg,
                label: "Hello,",
                value: user.username,
              },
              {
                img: ProfitImg,
                label: "Profit:",
                value: `$${Math.round(totalProfit)}`,
              },
              {
                img: WalletImg,
                label: "Balance:",
                value: `$${Math.round(user.balance)}`,
              },
            ].map((card, idx) => (
              <Card
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: 300,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 8,
                    transition: "transform 0.3s, box-shadow 0.3s",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  src={card.img}
                  sx={{ width: 80, height: 80, borderRadius: 1, mr: 2 }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {card.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid container spacing={4}>
            <Grid item md={7}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "rgb(1, 22, 44)",
                  color: "wheat",
                  borderRadius: 2,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    fontWeight="bold"
                    sx={{
                      textTransform: "uppercase",
                      color: "#F2F2F2",
                      fontSize: "1.3rem",
                    }}
                  >
                    Stock
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      textTransform: "uppercase",
                      color: "#F2F2F2",
                      fontSize: "1.3rem",
                    }}
                  >
                    Qty
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      textTransform: "uppercase",
                      color: "#F2F2F2",
                      fontSize: "1.3rem",
                    }}
                  >
                    Price
                  </Typography>
                </Box>

                {renderPortfolio}
              </Paper>
            </Grid>
            <Grid item md={5}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "rgb(1, 22, 44)", 
                  color: "wheat", 
                  borderRadius: 2,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
                }}
              >
                {/* Header Row: Stock, Trade, Qty, Price */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    fontWeight="bold"
                    sx={{
                      textTransform: "uppercase",
                      color: "#F2F2F2",
                      fontSize: "1.3rem",
                    }}
                  >
                    Stock
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      textTransform: "uppercase",
                      color: "#F2F2F2",
                      fontSize: "1.3rem",
                    }}
                  >
                    Trade
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      textTransform: "uppercase",
                      color: "#F2F2F2",
                      fontSize: "1.3rem",
                    }}
                  >
                    Qty
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      textTransform: "uppercase",
                      color: "#F2F2F2",
                      fontSize: "1.3rem",
                    }}
                  >
                    Price
                  </Typography>
                </Box>

                {/* Render the transactions dynamically */}
                {renderTransactions}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
