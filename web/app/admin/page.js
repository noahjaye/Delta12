"use client";

export default function Admin() {
    let db = [
    { LeBron: [{ Tylenol: 1 }, { Vivace: 3 }] },
    { LeTwo: [{ Tylenol: 4 }, { Vivace: 2 }] },
    ];

    return (
        <div>
            <title>
                Admin Page
            </title>
            <h1 className="flex flex-col align-left font-size 30">
                Add a prescription to get started.
            </h1>
        </div>
    )
}
