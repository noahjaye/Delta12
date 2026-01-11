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
      {
        console.log("DRUGS", drugs)
      }
      {
        
      Array.isArray(drugs) && drugs.map((drug, index) => {
        console.log("MAPPEDRUG", drug)
        return(
        <tr key={index}>
        <td className="px-4 py-2 border">{drug?.drug}</td>
        <td className="px-4 py-2 border">{drug?.dosage}</td>
        <td className="px-4 py-2 border">{`${drug?.taken} / ${drug?.dosage} ${drug?.unit}`}</td>
        
        <td className="px-4 py-2 border flex justify-center">
          <button onClick={() => handleTrackMaker(1, username)(index)} className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110 size-10">
            +
          </button>
          <button onClick={() => handleTrackMaker(-1, username)(index)} className="px-3 py-1 bg-blue-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-110 size-10">
            -
          </button>
        </td>
        </tr>
      )})}
    </tbody>
    
    </table>
      <p>Add drugs below: </p>
      <input className="bg-white text-black" onChange={makeChangeHandler(setDrug)}></input>
      <p>And drug dosage:</p>
      <input className="bg-white text-black" onChange={makeChangeHandler(setDosage)}></input>
      <p>And also units:</p>
      <input className="bg-white text-black" onChange={makeChangeHandler(setUnit)}></input>
      <button className="px-3 py-1 bg-blue-500 text-white rounded mx-auto my-5 transition duration-300 ease-in-out hover:scale-110 length-50" onClick={() => ping('doctordrugs', {username:  props.userNameExternal, drugs: [{drug: drug, dosage: dosage, unit: unit}]})}>Add Drugs</button>
    </div>
  )
}