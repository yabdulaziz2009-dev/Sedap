import React, { useState, useMemo } from 'react';
import { FiChevronDown, FiMoreHorizontal } from 'react-icons/fi';
import { LuListFilter } from "react-icons/lu";

const firstNames = ['Veronica', 'Rio', 'Fernando', 'Yanni', 'Danny', 'Andree', 'Siangny', 'Wanda', 'Natasya', 'Tony', 'John', 'Arthur', 'Bruce', 'Peter', 'Stephen', 'Diana', 'Clark', 'Barry', 'Hal', 'Victor', 'Oliver', 'Dinah', 'Billy', 'Shayera'];
const lastNames = ['Da Luca', 'Tan', 'Cheng', 'Liaw', 'The', 'Maximoff', 'Romanoff', 'Stark', 'Banner', 'da Roca', 'Wayne', 'Parker', 'Strange', 'Prince', 'Kent', 'Allen', 'Jordan', 'Stone', 'Queen', 'Lance', 'Batson', 'Hol'];
const cities = ['London', 'New York', 'Gotham', 'Metropolis', 'Central City', 'Coast City', 'Seattle', 'Detroit', 'Star City', 'Fawcett City'];
const streets = ['Corner Street', 'Emerald Tower', 'Blessing Hills', 'Greensand', 'St. Bakersfield', 'Kingsroad', 'Church Road', 'Long Beach', 'Boulevard Dreams', 'San Tower'];

const initialData = Array.from({ length: 60 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i * 3) % lastNames.length];
  const city = cities[(i * 7) % cities.length];
  const street = streets[(i * 11) % streets.length];
  
  return {
    id: `#C-${String(4560 + i).padStart(6, '0')}`,
    joinDate: `${(i % 28) + 1} ${(i % 2 === 0) ? 'July' : 'August'} 2020, ${10 + (i % 12)}:${(i * 13) % 60 < 10 ? '0' : ''}${(i * 13) % 60} ${i % 2 === 0 ? 'AM' : 'PM'}`,
    name: `${firstName} ${lastName}`,
    location: `${(i * 13) % 150 + 1} ${street}, ${city}`,
    spent: `$${(20 + (i * 47) % 900).toFixed(2)}`,
    lastOrder: `$${(5 + (i * 23) % 200).toFixed(2)}`
  };
});

const GeneralCustomer = () => {
  const [customers, setCustomers] = useState(initialData);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Increased content per page

  const toggleDropdown = (id) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    setOpenDropdown(null);
    
    // Adjust page if we deleted the last item on the current page
    const totalPagesAfterDelete = Math.ceil((customers.length - 1) / itemsPerPage);
    if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
      setCurrentPage(totalPagesAfterDelete);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const parseMoney = (moneyStr) => parseFloat(moneyStr.replace('$', ''));

  const sortedCustomers = useMemo(() => {
    let sortableItems = [...customers];
    if (sortConfig !== null && sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle money sorting
        if (sortConfig.key === 'spent' || sortConfig.key === 'lastOrder') {
           aVal = parseMoney(aVal);
           bVal = parseMoney(bVal);
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [customers, sortConfig]);

  // Pagination derived state
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full pb-10">
      {/* Header section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">General Customer</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Here is your general customers list data</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <LuListFilter className="text-[#00B074]" size={18} />
          Filter
          <FiChevronDown />
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="w-full">
          <table className="w-full text-sm text-left relative">
            {/* Table Header */}
            <thead className="text-xs text-white uppercase bg-[#2D9CDB]">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold rounded-tl-2xl cursor-pointer hover:bg-[#208bc4] transition-colors" onClick={() => handleSort('id')}>
                  Customer ID <span className="inline-block ml-1 opacity-60">↕</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#208bc4] transition-colors" onClick={() => handleSort('joinDate')}>
                  Join Date <span className="inline-block ml-1 opacity-60">↕</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#208bc4] transition-colors" onClick={() => handleSort('name')}>
                  Customer Name <span className="inline-block ml-1 opacity-60">↕</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#208bc4] transition-colors" onClick={() => handleSort('location')}>
                  Location <span className="inline-block ml-1 opacity-60">↕</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#208bc4] transition-colors" onClick={() => handleSort('spent')}>
                  Total Spent <span className="inline-block ml-1 opacity-60">↕</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#208bc4] transition-colors" onClick={() => handleSort('lastOrder')}>
                  Last Order <span className="inline-block ml-1 opacity-60">↕</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold rounded-tr-2xl text-center">
                  Action
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                   <td colSpan="7" className="px-4 py-10 text-center text-gray-500 dark:text-slate-400">No records found.</td>
                </tr>
              ) : null}
              {currentItems.map((customer, idx) => (
                <tr
                  key={customer.id}
                  className={`border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${idx === 0 ? 'bg-gray-50/50 dark:bg-slate-700/30' : ''}`}
                >
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-medium">
                    {customer.id}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400 whitespace-nowrap">
                    {customer.joinDate}
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-slate-200 font-medium">
                    {customer.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">
                    <span className="line-clamp-2" title={customer.location}>{customer.location}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-slate-200 font-medium">
                    {customer.spent}
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-slate-200 font-medium">
                    {customer.lastOrder}
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => toggleDropdown(customer.id)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-400 dark:text-slate-500 focus:outline-none"
                    >
                      <FiMoreHorizontal size={20} />
                    </button>

                    {/* Action Dropdown */}
                    {openDropdown === customer.id && (
                      <div className="absolute right-8 top-10 w-32 bg-white dark:bg-slate-700 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-slate-600 z-50 py-2 text-sm text-left transform transition-all animate-in fade-in zoom-in-95">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 transition-colors">
                          View Detail
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 transition-colors">
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 text-red-500 transition-colors"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info and pagination */}
        <div className="px-6 py-6 border-t border-gray-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between text-sm gap-4">
          <p className="text-gray-500 dark:text-slate-400">
            Showing {currentItems.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, customers.length)} from {customers.length} data
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-600 transition-colors bg-white dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
               <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                     currentPage === page
                        ? 'bg-[#2D9CDB]/10 text-[#2D9CDB] font-bold border border-transparent'
                        : 'border border-transparent text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
               >
                  {page}
               </button>
            ))}

            <button
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages || totalPages === 0}
               className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-600 transition-colors bg-white dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              &raquo;
            </button>
          </div>
        </div>
      </div>
    {/* Click outside listener */}
    {openDropdown && (
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={() => setOpenDropdown(null)}
      ></div>
    )}
    </div>
  );
};

export default GeneralCustomer;
