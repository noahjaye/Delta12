"use client";
import { useRef } from 'react';
import User from "../admin/user.js";

export default function Admin() {
  const lebron = {
    username: "LeBron",
    drugs: [
      ["Tylenol", 0, 1, "pills"],
      ["Vivace", 0, 3, "grams"]
    ]
  }

  const drake = {
    username: "Drake",
    drugs: [
      ["Advil", 0, 2, "pills"],
      ["Omega 3", 0, 1, "capsules"]
    ]
  }

  return (
    <div className="p-10">
      <title>
      Admin Page
      </title>
      <h1 className="flex justify-left text-3xl">
      Add a prescription to get started.
      </h1>
      <div>
        <User userNameExternal={lebron.username} drugsExternal={lebron.drugs} />
        <User userNameExternal={drake.username} drugsExternal={drake.drugs} />
      </div>
    </div>
  )
}
