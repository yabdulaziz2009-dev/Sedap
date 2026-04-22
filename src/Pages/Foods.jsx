// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFoods } from "../store/slices/Food";
// import Cards from "../Components/Cards";
// import MenuComparison from "../Components/MenuComparison";

// function Foods() {
//   const dispatch = useDispatch();
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const { foods, loading, error } = useSelector((state) => state.food);

//   useEffect(() => {
//     dispatch(fetchFoods());
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div className="flex justify-around gap-5 flex-col items-center flex-wrap text-slate-700 dark:text-slate-300 p-10">
//         <div className="flex justify-center items-center gap-9 flex-wrap">
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//           <div className="flex w-70 flex-col gap-7">
//             <div className="skeleton h-32 w-full"></div>
//             <div className="skeleton h-4 w-28"></div>
//             <div className="skeleton h-4 w-full"></div>
//             <div className="skeleton h-4 w-full"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }


//   const totalPages = Math.ceil(foods?.length / limit);
//   const currentFoods = foods?.slice((page - 1) * limit, page * limit);

//   return (
//     <div className="flex flex-col justify-center items-center">

//       <div className="flex flex-wrap gap-5 justify-center items-center pt-14">
//         {currentFoods?.map((item) => (
//           <Cards key={item.id} food={item} />
//         ))}
//       </div>

//       <div className="flex gap-2 mt-10">
//         <button
//           onClick={() => setPage((p) => p - 1)}
//           disabled={page === 1}
//           className="px-4 py-1 bg-gray-200 rounded disabled:opacity-40 dark:bg-slate-700 dark:text-white"
//         >
//           Prev
//         </button>

//         <span className="px-4 py-1 bg-green-500 text-white rounded">
//           {page} / {totalPages}
//         </span>

//         <button
//           onClick={() => setPage((p) => p + 1)}
//           disabled={page === totalPages}
//           className="px-4 py-1 bg-gray-200 rounded disabled:opacity-40 dark:bg-slate-700 dark:text-white"
//         >
//           Next
//         </button>
//       </div>

//       <MenuComparison />
//     </div>
//   );
// }

// export default Foods;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/slices/Food";
import Cards from "../Components/Cards";
import MenuComparison from "../Components/MenuComparison";

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-3 w-60 animate-pulse shadow-sm">
      <div className="w-28 h-28 rounded-full bg-gray-100" />
      <div className="h-3 w-24 bg-gray-100 rounded" />
      <div className="h-2.5 w-16 bg-gray-100 rounded" />
      
      <div className="flex gap-3 mt-1">
        {[...Array(4)].map((_, i) => <div key={i} className="w-6 h-6 rounded-full bg-gray-100" />)}
      </div>
    </div>
  );
}

function Foods() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const limit = 10;

  const { foods, loading } = useSelector((state) => state.food);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const filtered = foods?.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];
  const totalPages = Math.ceil(filtered.length / limit);
  const currentFoods = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Foods</h1>
          <p className="text-xs text-gray-400 mt-0.5">Here is your menus summary with graph view</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-sm border border-gray-100 w-64">
            <span className="text-gray-400 flex-shrink-0"><SearchIcon /></span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search here"
              className="text-xs text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-0.5 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "text-gray-700 bg-gray-100" : "text-gray-300 hover:text-gray-500"}`}
            >
              <ListIcon />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-green-500 text-white" : "text-gray-300 hover:text-gray-500"}`}
            >
              <GridIcon />
            </button>
          </div>

          {/* New Menu Button */}
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm">
            <PlusIcon />
            New Menu
          </button>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      <div className="px-8">
        <div className="flex flex-wrap gap-4">
          {loading
            ? [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
            : currentFoods.map((item) => <Cards key={item.id} food={item} />)
          }
        </div>

        {/* ── Pagination ── */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between mt-8 pb-4">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, filtered.length)} from {filtered.length} Menu
            </p>
            <div className="flex items-center gap-1">
              <PaginationBtn onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </PaginationBtn>

              {Array.from({ length: Math.min(totalPages, 4) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    page === i + 1
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-green-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <PaginationBtn onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </PaginationBtn>
            </div>
          </div>
        )}
      </div>

      {/* ── Menu Comparison ── */}
      <div className="px-8 pb-10 mt-2">
        <MenuComparison />
      </div>
    </div>
  );
}

function PaginationBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-green-400 disabled:opacity-30 transition-colors"
    >
      {children}
    </button>
  );
}

export default Foods;