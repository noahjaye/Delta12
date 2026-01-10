"use client";
import { useState } from "react";

export default function Admin() {
    const [db, setDb] = useState([
    { LeBron: [{ Tylenol: 1 }, { Vivace: 3 }] },
    { LeTwo: [{ Tylenol: 4 }, { Vivace: 2 }] },
    ]);

    const incrementDosage = () => {
        setDb(prev => {
            const copy = structuredClone(prev)
            copy[0].LeBron[0].Tylenol += 1
            return copy
        } 
        );
    }
    const decrementDosage = () => {
        setDb(prev => {
            const copy = structuredClone(prev)
            copy[0].LeBron[0].Tylenol -= 1
            return copy
        }
        );
    }

    return (
        <div className="p-10">
            <title>
                Admin Page
            </title>
            <h1 className="flex justify-left text-3xl">
                Add a prescription to get started.
            </h1>
            <table className="w-9/12 border border-gray-300 m-10 mx-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">User</th>
                        <th className="px-4 py-2 border">Medication</th>
                        <th className="px-4 py-2 border">Dosage</th>
                        <th className="px-4 py-2 border">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 py-2 border text-center">{Object.keys(db[0])[0]}</td>
                        <td className="px-4 py-2 border text-center">{Object.keys(db[0]["LeBron"][0])[0]}</td>
                        <td className="px-4 py-2 border text-center">{db[0]["LeBron"][0]["Tylenol"]}</td>
                        <td className="px-4 py-2 border text-center">
                            <button onClick={incrementDosage} className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110">
                                +
                            </button>
                            <button onClick={decrementDosage} className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110">
                                -
                            </button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110">
                                Edit
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
