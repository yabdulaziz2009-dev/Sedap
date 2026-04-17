import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex bg-[#F8F9FA] p-10">
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-56">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 ml-56">
        <Header />
      </div>

      <main className="mt-16 p-4">
        <Outlet />
        
      </main>
    </div>
  );
}

export default App;
