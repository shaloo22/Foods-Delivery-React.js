import React, { useEffect, useState } from "react";
import FoodData from "../data/FoodData";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../slices/CategorySlice";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);

  const listUniqueCategories = () => {
    const uniqueCategories = [
      ...new Set(FoodData.map((food) => food.category)),
    ];
    setCategories(uniqueCategories);
    console.log(uniqueCategories);
  };

  useEffect(() => {
    listUniqueCategories();
  }, []);

  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.category);

  return (
    <div className="px-4 sm:px-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-3">Find the best food</h3>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button
          onClick={() => dispatch(setCategory("All"))}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 font-bold rounded-xl whitespace-nowrap text-sm transition-all flex-shrink-0
            ${selectedCategory === "All"
              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
              : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
            }`}
        >
          All
        </button>
        {categories.map((category, index) => (
          <button
            onClick={() => dispatch(setCategory(category))}
            key={index}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 font-bold rounded-xl whitespace-nowrap text-sm transition-all flex-shrink-0
              ${selectedCategory === category
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
