import StatsCards from "../components/StatsCards";
import PieChartSection from "../components/PieChartSection";
import ChartOrder from "../components/ChartOrder";
import TotalRevenue from "../components/TotalRevenue";
import CustomerMap from "../components/CustomerMap";
import CustomerReviews from "../components/CustomerReviews";
import { Filter } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-[#F8F9FA] ">
      {/* Page title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Hi Samantha, Welcome back to Sedap Admin!
          </p>
        </div>

        <button className="flex items-center gap-2 text-xs font-medium text-primary border border-primary/30 px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors">
          <Filter size={13} />
          Filter Periode
          <span className="text-gray-400 text-[10px]">
            01 April 2023 - 31 May 2023
          </span>
        </button>
      </div>

      {/* Content */}
      <StatsCards />

      <div className="flex gap-4 mb-5">
        <PieChartSection />
        <ChartOrder />
      </div>

      <div className="flex gap-4 mb-5">
        <TotalRevenue />
        <CustomerMap />
      </div>

      <CustomerReviews />
    </div>
  );
};

export default Home;
