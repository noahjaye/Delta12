'use client';
import React, { useEffect, useState, useRef } from 'react';
process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000" //Remove please
import ping from "../functions/ping.js"



const PRESCRIPTION_SERVICE_UUID = "12345678-1280-1280-1280-676767abcdef";
const COUNTER_CHARACTERISTIC_UUID = "87654321-1280-1280-1280-abcdef676767";

export default function User(props) {
  const [username, setUsername] = useState(props.userNameExternal)
  const [drugs, setDrugs] = useState(props.drugsExternal);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const bleDeviceRef = useRef(null);
  const bleServiceRef = useRef(null);
  const counterCharRef = useRef(null);
  const notificationHandlerRef = useRef(null);

  useEffect(() => {
    console.log("frugs updated:", drugs);
    ping("updatedrugs", {username: username, drugs: drugs})
  }, [drugs]);

  // Setup BLE notification listener when component mounts
  useEffect(() => {
    return () => {
      // Cleanup: disconnect if connected
      if (isConnected && bleDeviceRef.current) {
        bleDeviceRef.current.gatt.disconnect();
      }
    };
  }, [isConnected]);

  
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
    console.log("Updated", drugs)
  }

  return (
    <div className="flex flex-col mb-10">
      <h1 className="flex justify-center text-5xl p-8"> 
        {username}
      </h1>

      <div className="m-4">
        {!isConnected ? (
          <button 
            //onClick={handleConnectPrescription}
            className="px-4 py-2 bg-green-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-105"
          >
            Connect to Prescription
          </button>
        ) : (
          <button 
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-105"
          >
            Disconnect
          </button>
        )}
        <span className="ml-4 text-lg font-semibold">{connectionStatus}</span>
      </div>

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

