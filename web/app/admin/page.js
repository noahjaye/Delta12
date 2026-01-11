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
        <div className="p-10">
            <title>
                Admin Page
            </title>
            <h1 className="flex justify-left text-3xl">
                Add a prescription to get started.
            </h1>
             <div>
                    <h1>{doctorName.name}</h1>
                    {console.log("DRN", doctorName)}
                    <Form name={"Doctor name"} handleSub={changeDoc}>Form</Form>
                    <p>PATIENTS ...-- THIS LINE NEEDS CSS </p>
                     <Form name={"Patient name"} handleSub={((io) => ping('newuser', {username: io, doctor: doctorName}))}>Form</Form>
                    {db.map( (item, index) => {
                        console.log("DBITEM", item)
                        const json = JSON.parse(item.user)
                        console.log("JSONPARSE", json)
                        const username = json.username;
                        const drugsArray = json?.drugs; // array of { drug: qty }
                        console.log("USERNAMEEXT", username, drugsArray)
                        return (
                            <div key={`${username}-${index}`}>
                            <User userNameExternal={username} drugsExternal={drugsArray}></User>
                            </div>
                        );
                    })}

                   
             </div>
        </div>
    )
}