import "./App.css";
import Header from "./components/layout/Header/Header.js";
import Home from "./components/Home/Home.js";
import { Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React, { useEffect } from "react";
import Footer from "./components/layout/Footer/Footer.js";
import ProductDetail from "./components/Product/ProductDetail.js";
import Products from "./components/Product/Product.js";
import Search from "./components/Product/Search.js";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/product/:id" element={<ProductDetail />} />
          <Route exact path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path="/search" element={<Search />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
