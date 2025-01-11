import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Box, Typography, Paper, Button, Card, CardContent, CardMedia } from "@mui/material";
import Navbar_loggedin from "../Elements/Navbars/navbar_loggedin";
import ProfitImg from "../Assets/Profit.svg";
import WalletImg from "../Assets/Wallet.svg";
import UserImg from "../Assets/User.svg";

function Dashboard() {
  const [totalProfit, setTotalProfit] = useState(0);
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

  const renderPortfolio = user.portfolio.length ? (
    user.portfolio.map((element, index) => (
      <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: "rgb(1, 22, 44)", color: "wheat", borderRadius: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>{element.stock}</Typography>
        <Typography variant="h6">{element.qty}</Typography>
        <Typography variant="h6">${element.price}</Typography>
      </Box>
    ))
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "200px", textAlign: "center", bgcolor: "rgb(35, 47, 62)", borderRadius: 2, p: 3 }}>
      <Typography variant="h6" sx={{ color: "#f2f2f2" }}>No stocks in your portfolio yet. Start investing today!</Typography>
    </Box>
  );

  const renderTransactions = user.transactions.length ? (
    user.transactions.map((element, index) => (
      <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: "rgb(1, 22, 44)", color: "wheat", borderRadius: 2, mb: 1 }}>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>{element.stock}</Typography>
        <Typography variant="h6" textTransform="capitalize">{element.trade}</Typography>
        <Typography variant="h6">{element.qty}</Typography>
        <Typography variant="h6">${element.price}</Typography>
      </Box>
    ))
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "200px", textAlign: "center", bgcolor: "rgb(35, 47, 62)", borderRadius: 2, p: 3 }}>
      <Typography variant="h6" sx={{ color: "#f2f2f2" }}>No transactions yet. Start trading now to see your history!</Typography>
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar_loggedin />
      <Grid container sx={{ height: "87vh" }}>
        <Grid
          item
          md={2}
          sx={{
            bgcolor: "radial-gradient(circle at 5% 23%, rgba(0, 40, 83, 1) 2%, rgba(4, 12, 24, 1) 25%)",
            color: "white",
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "300px",
            borderRadius: "15px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <Paper elevation={3} sx={{ p: 2, mb: 3, textAlign: "center", backgroundColor: "rgba(190, 190, 190, 0.71)"}}>
            <Typography variant="h5" sx={{fontWeight: "bold"}}>Dashboard</Typography>
          </Paper>
          <Button component={Link} to="/analysis" sx={{ mb: 3, color: "white", textTransform: "capitalize", fontWeight: "bold", fontSize: "16px", '&:hover': { color: "#e0e0e0" } }}>
            <Typography variant="h5">Analysis</Typography>
          </Button>
          <Button sx={{ color: "white", textTransform: "capitalize", fontWeight: "bold", fontSize: "16px", '&:hover': { color: "#e0e0e0" } }}>
            <Typography variant="h5">Help</Typography>
          </Button>
        </Grid>
        <Grid item md={10} sx={{ p: 2, bgcolor: "#e0e0e0", borderRadius: 3 }}>
          <Grid container justifyContent="space-around" alignItems="center" sx={{ mb: 4 }}>
            {[ 
              { img: UserImg, label: "Hello,", value: user.username },
              { img: ProfitImg, label: "Profit:", value: `$${Math.round(totalProfit)}` },
              { img: WalletImg, label: "Balance:", value: `$${Math.round(user.balance)}` },
            ].map((card, idx) => (
              <Card key={idx} sx={{ 
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
              }}>
                <CardMedia component="img" src={card.img} sx={{ width: 80, height: 80, borderRadius: 1, mr: 2 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "capitalize" }}>{card.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{card.value}</Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid container spacing={4}>
            <Grid item md={7}>
              <Paper sx={{ p: 3, bgcolor: "rgb(1, 22, 44)", color: "wheat", borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "uppercase" }}>Stock</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "uppercase" }}>Qty</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "uppercase" }}>Price</Typography>
                </Box>
                {renderPortfolio}
              </Paper>
            </Grid>
            <Grid item md={5}>
              <Paper sx={{ p: 3, bgcolor: "rgb(1, 22, 44)", color: "wheat", borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "uppercase" }}>Stock</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "uppercase" }}>Trade</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "uppercase" }}>Qty</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ textTransform: "uppercase" }}>Price</Typography>
                </Box>
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
