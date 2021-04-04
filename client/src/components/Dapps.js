import React from 'react';

export default class Dapps extends React.Component {
    render() {
        return (
            <div className="flex w-full h-screen mt-8">
                <aside className="w-80 h-screen bg-gray shadow-md w-fulll hidden sm:block">
                    <div className="flex flex-col justify-between h-screen p-4 bg-gray-800">
                        <div className="text-sm">
                            <div className="bg-gray-900 text-white p-5 rounded cursor-pointer">Menu 1</div>
                            <div className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">Menu 2</div>
                            <div className="bg-gray-700 text-blue-300 p-2 rounded mt-2 cursor-pointer">Menu 3</div>
                            <div className="bg-gray-900 flex justify-between items-center text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">
                                <span>Reports</span>
                                <span className="w-4 h-4 bg-blue-600 rounded-full text-white text-center font-normal text-xs">5</span>
                        </div>
                        <div className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">Menu 4</div>
                        <div className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">Menu 5</div>
                        <div className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">Menu 6</div>
                        </div>
                        <div className="flex p-3 text-white bg-red-500 rounded cursor-pointer text-center text-sm">
                            <button className="rounded inline-flex items-center">
                            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                            <span className="font-semibold">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>
                <section className="w-full p-4">
                    <div className="w-full h-64 border-dashed border-4 p-4 text-md">Dashboard</div>
                </section>
            </div>
        )
    }
}