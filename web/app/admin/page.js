"use client";
import { useState, useRef, useEffect } from "react";
import User from "../admin/user.js"
import ping from "../functions/ping.js"
import Form from "../components/form.js";

// BLE service UUIDs
const SERVICE = "12345678-1280-1280-1280-676767abcdef";
const CHARACTERISTIC = "87654321-1280-1280-1280-abcdef676767";
const CMD_CHARACTERISTIC = "12345678-1280-1280-1280-abcdefabcdef";

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


    function handleChange(e) {
        console.log()
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault(); // stop page reload
        ping('newuser', {username: formData.name})
    }
    
    async function connectToDevice() {
        try {
            console.log("Requesting Bluetooth Device...");

            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [SERVICE] }],
            });
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(SERVICE);
            const characteristic = await service.getCharacteristic(CHARACTERISTIC);
            const cmdCharacteristic = await service.getCharacteristic(CMD_CHARACTERISTIC);
            cmdCharacteristicRef.current = cmdCharacteristic;

            // Initial read
            const initial = await characteristic.readValue();
            const initialCounter = initial.getUint32(0, true);

            console.log(`Initial Dosage: ${initialCounter}`);

            // Subsequent notifications
            await characteristic.startNotifications();
            characteristic.addEventListener("characteristicvaluechanged", (event) => {
                const counter = event.target.value.getUint32(0, true);
                console.log(`Dosage Updated: ${counter}`);

            });
        } catch (error) {
            console.log("Oops... " + error);
        }
    }

    return (
        <div className="p-10">
            <title>
                Admin Page
            </title>
            <h1 className="flex justify-left text-3xl">
                Add a prescription to get started.
            </h1>
            <div className="m-4">
                <button onClick={connectToDevice} className="px-4 py-2 bg-green-500 text-white rounded m-2 transition duration-300 ease-in-out hover:scale-105">
                    Connect to Prescription
                </button>
            </div>
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