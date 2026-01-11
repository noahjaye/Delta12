"use client";
import React, { use, useState, useEffect } from 'react';
process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000" //Remove please
import ping from "../functions/ping.js"
import List from '../components/many.js';


export default function User(props) {
  
  // Drug name, taken today, daily dose, dose unit
  const [username, setUsername] = useState(props.userNameExternal)
  const [drugs, setDrugs] = useState(props.drugsExternal);
  const [drug, setDrug] = useState()
  const [dosage, setDosage] = useState()
  const [unit, setUnit] = useState()


  console.log("Userdrugs", drugs)
  function makeChangeHandler(setter) {
    return function(e) {
      const { name, value } = e.target;
      console.log("Setting with a handler", name, value)
      setter(value);
    }
  }
  function handleTrackMaker(delta, uname) {
    return function (i) {
      setDrugs(prev =>
        prev.map((drug, index) =>
          
          index === i
            ? {
                ...drug,
                dosage: Math.max(0, parseInt(drug.dosage) + delta)
              }
            : drug
        ),
        ping('updatedrugs', {username: uname, drugs: drugs})
      )
    };
  }

  
  

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 flex flex-col items-center">
      <h1 className="text-4xl font-semibold text-slate-800 p-6"> 
      {username}
      </h1>
    
    <table className="w-full border border-gray-200 rounded overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Medication</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Dosage</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Taken Today</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Count</th>
        </tr>
      </thead>
    
    <tbody>
      {
        console.log("DRUGS", drugs)
      }
      {
        
      Array.isArray(drugs) && drugs.map((drug, index) => {
        console.log("MAPPEDRUG", drug)
        return(
        <tr key={index} className="odd:bg-white even:bg-slate-50">
        <td className="px-4 py-3 border-b border-gray-100 text-slate-700">{drug?.drug}</td>
        <td className="px-4 py-3 border-b border-gray-100 text-slate-700">{drug?.dosage}</td>
        <td className="px-4 py-3 border-b border-gray-100 text-slate-700">{`${drug?.taken} / ${drug?.dosage} ${drug?.unit}`}</td>
        
        <td className="px-4 py-3 border-b border-gray-100 flex justify-center">
          <button onClick={() => handleTrackMaker(1, username)(index)} className="px-3 py-1 bg-teal-600 text-white rounded m-2 transition transform duration-150 hover:scale-105">
            +
          </button>
          <button onClick={() => handleTrackMaker(-1, username)(index)} className="px-3 py-1 bg-teal-600 text-white rounded m-2 transition transform duration-150 hover:scale-105">
            -
          </button>
        </td>
        </tr>
      )})}
    </tbody>
    
    </table>
      <p className="mt-6 mb-2 text-sm text-slate-600">Add drugs below: </p>
      <input className="w-full max-w-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded text-slate-800 mb-3" onChange={makeChangeHandler(setDrug)}></input>
      <p className="mb-2 text-sm text-slate-600">And drug dosage:</p>
      <input className="w-full max-w-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded text-slate-800 mb-3" onChange={makeChangeHandler(setDosage)}></input>
      <p className="mb-2 text-sm text-slate-600">And also units:</p>
      <input className="w-full max-w-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded text-slate-800 mb-3" onChange={makeChangeHandler(setUnit)}></input>
      <button className="px-4 py-2 bg-teal-600 text-white rounded mt-3 transition transform duration-150 hover:bg-teal-700" onClick={() => ping('doctordrugs', {username:  props.userNameExternal, drugs: [{drug: drug, dosage: dosage, unit: unit}]})}>Add Drugs</button>
    </div>
   )
 }