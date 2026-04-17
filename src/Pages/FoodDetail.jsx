import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";

function FoodDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { foods, loading } = useSelector((state) => state.food);

  useEffect(() => {
    if (foods.length === 0) {
      dispatch(fetchFoods());
    }
  }, [dispatch, foods.length]);

  const food = foods.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  if (!food) {
    return <div>Food topilmadi</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 max-w-[460px]">
      <p className="text-right text-xs text-gray-400 mb-3">
        Category: {food.category} / <span className="text-green-700 font-medium">{food.subcategory}</span>
      </p>

      <div className="flex gap-4 items-start mb-4">
        <img
          src={food.image}
          alt={food.name}
          className="w-[130px] h-[100px] object-cover rounded-xl flex-shrink-0"
        />

        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <span className={`w-2 h-2 rounded-full inline-block ${food.stockAvailable ? "bg-green-700" : "bg-red-500"}`} />
            <span className={`text-xs font-medium ${food.stockAvailable ? "text-green-700" : "text-red-500"}`}>
              {food.stockAvailable ? "Stock Available" : "Out of Stock"}
            </span>
          </div>

          <h2 className="text-base font-medium text-gray-900 leading-snug mb-1">
            {food.name}
          </h2>

          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            {food.description}
          </p>

          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white text-xs font-medium px-4 py-2 rounded-lg">
              Add Menu
            </button>
            <button className="text-xs border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
              Edit Menu
            </button>
          </div>
        </div>
      </div>

      <hr className="border-dashed border-gray-200 my-4" />
      <h3 className="text-sm font-medium text-gray-900 mb-2">Ingredients</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{food.ingredients}</p>

      <hr className="border-dashed border-gray-200 my-4" />
      <h3 className="text-sm font-medium text-gray-900 mb-2">Nutrition Info</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{food.nutritionInfo}</p>
    </div>
  );
}

export default FoodDetail;
