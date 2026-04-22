import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";
import Cards from "../Components/Cards";
import MenuComparison from "../Components/MenuComparison";

function Foods() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { foods, loading, error } = useSelector((state) => state.food);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-around gap-5 flex-col items-center flex-wrap text-slate-700 dark:text-slate-300 p-10">
        <div className="flex justify-center items-center gap-9 flex-wrap">
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex w-70 flex-col gap-7">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      </div>
    );
  }


  const totalPages = Math.ceil((foods?.length || 0) / limit) || 1;
  const currentFoods = foods?.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex flex-col justify-center items-center">

      <div className="flex flex-wrap gap-5 justify-center items-center pt-14">
        {currentFoods?.map((item) => (
          <Cards key={item.id} food={item} />
        ))}
      </div>

      <div className="flex gap-2 mt-10">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-40 dark:bg-slate-700 dark:text-white"
        >
          Prev
        </button>

        <span className="px-4 py-1 bg-green-500 text-white rounded">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-40 dark:bg-slate-700 dark:text-white"
        >
          Next
        </button>
      </div>

      <MenuComparison />
    </div>
  );
}

export default Foods;