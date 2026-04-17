import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";
import Cards from "../Components/Cards";

function Foods() {
  const dispatch = useDispatch();

  const { foods, loading, error } = useSelector(
    (state) => state.food
  );

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-5 justify-center items-center h-[500px] overflow-hidden">
      {foods.map((item) => (
        <Cards key={item.id} food={item} />
      ))}
    </div>
  );
}

export default Foods;
