import React from 'react'
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const Cards = () => {
    return (
        <div>
            <img src="path/to/image.jpg" alt="Alisher" />
            <div className='py-4'>
                <div className="w-[240px] h-[300px] bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition dark:bg-slate-800 dark:shadow-slate-900">
                    <div className="flex justify-center -mt-12">
                        <img
                            src={food.image}
                            alt={food.name}
                            className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-white dark:border-slate-800"
                        />
                    </div>
                    <h3 className="mt-4 font-semibold text-lg text-gray-800 h-[56px] leading-tight dark:text-slate-100">
                        {food.name}
                    </h3>
                    <p className="text-sm mt-1">
                        <span className="text-green-500">Food</span>
                        <span className="text-gray-400 dark:text-slate-400"> / {food.category}</span>
                    </p>
                    <Link to={`/foods/${food.id}`}>
                        <div className="flex justify-center mt-4">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800">
                                <FaEye />
                            </button>
                        </div>
                    </Link>
                    <p className="text-xs text-gray-500 mt-2 dark:text-slate-400">View</p>
                </div>
            </div>
        </div>
    )
}

export default Cards
