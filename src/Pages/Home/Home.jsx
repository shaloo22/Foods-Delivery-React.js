import React from "react";
import Navbar from "../../components/Navbar";
import CategoryMenu from "../../components/CategoryMenu";
import FoodItems from "../../components/FoodItems";
import Cart from "../../components/Cart";
import PromoFlyer from "../../components/PromoFlyer";

const Home = () => {
  return (
    <>
      <Navbar />
      <PromoFlyer />
      <CategoryMenu />
      <FoodItems />
      <Cart />
    </>
  );
};

export default Home;
