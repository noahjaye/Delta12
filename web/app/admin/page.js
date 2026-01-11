"use client";
import { useState, useRef, useEffect } from "react";
import User from "../admin/user.js"
import ping from "../functions/ping.js"
import Form from "../components/form.js";

export default function Admin() {
    const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
    const [doctorName, changeDoc] = useState("")
    const [db, setDb] = useState([]);
    
    useEffect(() =>  {
        ping("newdoctor", {username: doctorName})
        let docs
        const interval = setInterval(() => {

            ping("doctorlist", {username: doctorName}).then((thing) => {
                return thing.users
            }).then((thing2) => {
                let parse = JSON.parse(thing2)
                docs = parse
                console.log("PARSE", parse)
                const promises = docs.map((name) => {
                    console.log(name)
                    return ping("getuser", { username: {name: name}})
                });
                Promise.all(promises).then((results) => {
                    console.log("ALLPINGED", results)
                    setDb(results);
                });
                
            })
            
            
            
        }, 2000);

        return () => clearInterval(interval);
    }, [doctorName])
    const cmdCharacteristicRef = useRef(null);

    return (
        <div className="min-h-screen bg-slate-50 p-10 font-sans text-slate-900">
            <title>
                Admin Page
            </title>
            <h1 className="text-3xl font-semibold text-slate-800 mb-6">
                Add a prescription to get started.
            </h1>
             <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-lg font-medium text-teal-700">{doctorName.name}</h1>
                    {console.log("DRN", doctorName)}
                    <Form name={"Doctor name"} handleSub={changeDoc}>Form</Form>
                    <p className="text-sm font-semibold text-slate-600 mt-4">PATIENTS</p>
                     <Form name={"Patient name"} handleSub={((io) => ping('newuser', {username: io, doctor: doctorName}))}>Form</Form>
                    {db.map( (item, index) => {
                        console.log("DBITEM", item)
                        const json = JSON.parse(item.user)
                        console.log("JSONPARSE", json)
                        const username = json.username;
                        const drugsArray = json?.drugs; // array of { drug: qty }
                        console.log("USERNAMEEXT", username, drugsArray)
                        return (
                            <div key={`${username}-${index}`} className="bg-white border border-gray-100 rounded p-4 my-3 shadow-sm">
                                <User userNameExternal={username} drugsExternal={drugsArray}></User>
                            </div>
                        );
                    })}
             </div>
        </div>
    )
}