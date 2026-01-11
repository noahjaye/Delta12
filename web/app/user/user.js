'use client';
import React, { useEffect, useState } from 'react';
process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000" //Remove please
import ping from "../functions/ping.js"



export default function User(props) {
  const [username, setUsername] = useState(props.userNameExternal)
  const [drugs, setDrugs] = useState(props.drugsExternal);

  useEffect(() => {

    console.log("frugs updated:", drugs);
    ping("updatedrugs", {username: username, drugs: drugs})
    
  }, [drugs]);


  
  // Drug name, taken today, daily dose, dose unit
  
  

  async function handleTrack(i) {
  setDrugs((prev) => {
    const updated = prev.map((drug, index) => index === i ? [...drug] : drug);
    // const updated = [...prev];
    updated[i][1] = updated[i][1] + 1; // increment takenToday
    console.log("USERNAME", username)
    console.log("DRUGS", drugs)
    return updated;
  });
  console.log("UPdated", drugs)

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

            <td className="px-4 py-2 border">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => handleTrack(index)}
              >
                Track
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>
    </div>
  )
}

