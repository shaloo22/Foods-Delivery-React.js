import React from "react";
import { AiFillStar } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/CartSlice";

const FoodCard = ({ id, name, price, desc, img, rating, food, handleToast, onOpenDetails }) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white p-3 sm:p-5 flex flex-col rounded-2xl gap-2 sm:gap-3 w-full transition-all duration-300 card-shadow card-hover border border-gray-100 pb-4 sm:pb-6">
      <div
        onClick={onOpenDetails}
        className="overflow-hidden rounded-xl h-[110px] sm:h-[130px] flex items-center justify-center bg-gray-50 mb-1 sm:mb-2"
      >
        <img
          src={img || food?.image}
          alt={name}
          className="w-auto h-full object-contain hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-1">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 line-clamp-1">{name}</h2>
          <span className="text-orange-500 font-bold text-sm sm:text-base flex-shrink-0">₹{price}</span>
        </div>
        <p className="text-gray-500 text-[10px] sm:text-xs font-medium leading-relaxed line-clamp-2">
          {(desc || food?.description)?.slice(0, 60)}...
        </p>
      </div>

      <div className="flex justify-between items-center mt-auto pt-1">
        <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg">
          <AiFillStar className="text-yellow-500 mr-1 text-xs" />
          <span className="text-orange-700 font-bold text-[10px] sm:text-xs">{rating}</span>
        </div>
        <button
          onClick={() => {
            dispatch(addToCart({ id, name, price, rating, img: img || food?.image, qty: 1 }));
            handleToast(name);
          }}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-xl text-[10px] sm:text-xs font-bold transition-all shadow-lg shadow-orange-200 active:scale-95"
        >
          Add +
        </button>
      </div>
    </div>
  );
};

export default FoodCard;

