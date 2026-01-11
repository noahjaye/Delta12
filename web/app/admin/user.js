"use client";

import React, { useEffect, useState } from 'react';
process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000" //Remove please
import ping from "../functions/ping.js"


export default function User(props) {
  
  
  
  // Drug name, taken today, daily dose, dose unit
  const [username, setUsername] = useState(props.userNameExternal)
  const [drugs, setDrugs] = useState(props.drugsExternal);
    

  function incrementHandleTrack(i) {
  setDrugs(prev => {
    const updated = prev.map((drug, index) => index === i ? [...drug] : drug);
    // const updated = [...prev];
    updated[i][1] = updated[i][1] + 1; // increment takenToday
    return updated;
  });
}

  function decrementHandleTrack(i) {
  setDrugs(prev => {
    const updated = prev.map((drug, index) => index === i ? [...drug] : drug);
    // const updated = [...prev];
    updated[i][1] = updated[i][1] - 1; // increment takenToday
    return updated;
  });
}

  return (
    <div className="flex flex-col align-middle">
      <h1 className="flex justify-center text-5xl p-8"> 
        {username}
      </h1>

    <table className="w-9/12 border border-gray-300 mx-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Medication</th>
          <th className="px-4 py-2 border">Dosage</th>
          <th className="px-4 py-2 border">Taken Today</th>
          <th className="px-4 py-2 border">Count</th>
        </tr>
      </thead>

      <tbody>
        {drugs.map((drug, index) => (
          <tr key={index}>
            <td className="px-4 py-2 border">{drug[0]}</td>
            <td className="px-4 py-2 border">{drug[2]}</td>
            <td className="px-4 py-2 border">{`${drug[1]} / ${drug[2]} ${drug[3]}`}</td>

            <td className="px-4 py-2 border flex justify-center">
              <button onClick={() => incrementHandleTrack(index)} className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110 size-10">
                +
              </button>
              <button onClick={() => decrementHandleTrack(index)} className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110 size-10">
                -
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110">
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>
    <button className="px-3 py-1 bg-blue-500 text-white rounded mx-auto my-5 transition duration-300 ease-in-out hover:scale-110 length-50" onClick={() => ping('updatedrugs', {username: "Bronny", drugs: drugs})}>Add Drugs</button>
    </div>
  )
}

