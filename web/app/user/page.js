'use client';
import User from "./user"
import React, { useEffect, useState } from 'react';
import ping from "../functions/ping.js"
import Form from "../components/form";

export default function Page() {

    
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
    <div>
      <User userNameExternal={lebron.username} drugsExternal={lebron.drugs} />
      <Form name={"Patient name"}>Form</Form>
      
    </div>
  )
}
