"use client";
import { useState } from "react";

// BLE service UUIDs
const SERVICE = "12345678-1280-1280-1280-676767abcdef";
const CHARACTERISTIC = "87654321-1280-1280-1280-abcdef676767";
const CMD_CHARACTERISTIC = "12345678-1280-1280-1280-abcdefabcdef";

export default function Admin() {
    const [db, setDb] = useState([
    { LeBron: [{ Tylenol: 0 }, { Vivace: 3 }] },
    { LeTwo: [{ Tylenol: 4 }, { Vivace: 2 }] },
    ]);

    const cmdCharacteristicRef = useRef(null);

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
            setDb((prev) => {
                const copy = structuredClone(prev);
                copy[0].LeBron[0].Tylenol = initialCounter;
                return copy;
            });

            console.log(`Initial Dosage: ${initialCounter}`);

            // Subsequent notifications
            await characteristic.startNotifications();
            characteristic.addEventListener("characteristicvaluechanged", (event) => {
                const counter = event.target.value.getUint32(0, true);
                console.log(`Dosage Updated: ${counter}`);

                setDb((prev) => {
                    const copy = structuredClone(prev);
                    copy[0].LeBron[0].Tylenol++;
                    return copy;
                });
            });
        } catch (error) {
            console.log("Oops... " + error);
        }
    }

    const incrementDosage = () => {
        setDb(prev => {
            const copy = structuredClone(prev)
            copy[0].LeBron[0].Tylenol += 1
            return copy
        } 
        );
    }
    const decrementDosage = async () => {
        setDb(prev => {
            const copy = structuredClone(prev)
            copy[0].LeBron[0].Tylenol -= copy[0].LeBron[0].Tylenol > 0 ? 1 : 0;
            return copy
        }
        );

        if (cmdCharacteristicRef.current) {
            try {
                await cmdCharacteristicRef.current.writeValue(new Uint8Array([1]));
                console.log("Sent decrement command to device");
            } catch (error) {
                console.error("Error sending command to device: ", error);
            }
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
