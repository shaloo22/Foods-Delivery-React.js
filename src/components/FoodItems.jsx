import React from "react";
import FoodCard from "./FoodCard";
import FoodData from "../data/FoodData";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import FoodModal from "./FoodModal";
import { useState, useEffect } from "react";
import API from "../api";

const FoodItems = () => {
  const category = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await API.get("foods");
        setFoods(data.length > 0 ? data : FoodData);
      } catch (error) {
        console.error("Error fetching foods", error);
        setFoods(FoodData);
      }
    };
    fetchFoods();
  }, []);

  const handleToast = (name) => toast.success(`Added ${name} `);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 sm:mx-6 my-6">
        {foods.filter((food) => {
          if (category === "All") {
            return food.name.toLowerCase().includes(search.toLowerCase());
          } else {
            return (
              category === food.category &&
              food.name.toLowerCase().includes(search.toLowerCase())
            );
          }
        }).map((food) => (
          <FoodCard
            key={food._id || food.id}
            id={food._id || food.id}
            name={food.name}
            price={food.price}
            desc={food.desc || food.description}
            rating={food.rating}
            img={food.img || food.image}
            food={food}
            handleToast={handleToast}
            onOpenDetails={() => setSelectedFood(food)}
          />
        ))}
      </div>
      <FoodModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
        handleToast={handleToast}
      />
    </>
  );
};



export default FoodItems;
