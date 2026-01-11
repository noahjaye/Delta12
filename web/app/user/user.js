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
    console.log("drugs updated:", drugs);
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

  async function ping(url, data) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    console.log(await res.json()); // Drug name, taken today, daily dose, dose unit
  }
function updrug(index, delta, uname) {
    console.log("Delta", delta)
    setDrugs(prev =>
      prev.map((drug, index) =>
        
        index === index
          ? {
              ...drug,
              taken: Math.max(0, parseInt(drug.taken) + delta)
            }
          : drug
      ),
      ping('updatedrugs', {username: uname, drugs: drugs}))
  }
  async function handleConnectPrescription() {
    try {
      setConnectionStatus("Searching for device...");
      
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [PRESCRIPTION_SERVICE_UUID] }
        ]
      });

      setConnectionStatus("Connecting...");
      const gatt = await device.gatt.connect();
      bleDeviceRef.current = device;

      const service = await gatt.getPrimaryService(PRESCRIPTION_SERVICE_UUID);
      bleServiceRef.current = service;
      const counterChar = await service.getCharacteristic(COUNTER_CHARACTERISTIC_UUID);
      counterCharRef.current = counterChar;

      // Handle initial value
      const initialValue = await counterChar.readValue();
      const val1 = initialValue.getUint32(0, true);
      const val2 = initialValue.getUint32(4, true);
      // setDrugs((prev) => {
      //   const updated = prev.map((drug, index) => {
      //     if (index === 0) return [drug.drug, drug.dosage, drug.taken, drug.unit];
      //     return drug;
      //   });
      //   return updated;
      // });

      // Setup notifications for counter characteristic updates
      await counterChar.startNotifications();
      
      notificationHandlerRef.current = (event) => {
        console.log("No")
        const dataView = event.target.value;
        const val1 = dataView.getUint32(0, true);
        const val2 = dataView.getUint32(4, true);

        //!
        if (val1) {
        updrug(0, 1, username)
        }
        if (val2) {
          updrug(1, 1, username)
        }
        // Update both drugs with their respective counter values
        // setDrugs((prev) => {
        //   const updated = prev.map((drug, index) => {
        //     if (index === 0) return [drug[0], tylenolValue, drug[2], drug[3]];
        //     if (index === 1) return [drug[0], vivaceValue, drug[2], drug[3]];
        //     return drug;
        //   });
        //   return updated;
        // });
      };

      counterChar.addEventListener('characteristicvaluechanged', notificationHandlerRef.current);

      setIsConnected(true);
      setConnectionStatus("Connected to prescription device");
    } catch (error) {
      console.error("BLE Connection error:", error);
      setConnectionStatus("Failed to connect: " + error.message);
      setIsConnected(false);
    }
  }
  
  function handleDisconnect() {
    if (bleDeviceRef.current) {
      if (counterCharRef.current && notificationHandlerRef.current) {
        counterCharRef.current.removeEventListener('characteristicvaluechanged', notificationHandlerRef.current);
      }
      bleDeviceRef.current.gatt.disconnect();
      setIsConnected(false);
      setConnectionStatus("Disconnected");
    }
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
      <h1 className="text-4xl font-semibold text-slate-800 p-6">{username}</h1>

      <div className="w-full flex items-center justify-start mb-4">
        {!isConnected ? (
          <button 
            onClick={handleConnectPrescription}
            className="px-4 py-2 bg-teal-600 text-white rounded m-2 transition transform duration-150 hover:scale-105"
          >
            Connect to Prescription
          </button>
        ) : (
          <button 
            onClick={handleDisconnect}
            className="px-4 py-2 bg-rose-500 text-white rounded m-2 transition transform duration-150 hover:scale-105"
          >
            Disconnect
          </button>
        )}
        <span className="ml-4 text-lg font-semibold text-slate-700">{connectionStatus}</span>
      </div>

      <table className="w-full border border-gray-200 rounded overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Medication</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Daily Dose</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Taken Today</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(drugs) && drugs.map((drug, index) => (
            <tr key={index} className="odd:bg-white even:bg-slate-50">
              <td className="px-4 py-3 border-b border-gray-100 text-slate-700">{drug.drug}</td>
              <td className="px-4 py-3 border-b border-gray-100 text-slate-700">{drug.dosage}</td>
              <td className="px-4 py-3 border-b border-gray-100 text-slate-700">{`${drug.taken} / ${drug.dosage} ${drug.unit}`}</td>
            </tr>
          ))}
        </tbody>
        
      </table>
    </div>
  )
}

