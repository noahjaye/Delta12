"use client";

import React, { useEffect, useState } from "react";
import User from "./user";
import ping from "../functions/ping.js";
import Form from "../components/form";

export default function Page() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    setLoading(true);

    ping("getuser", { username })
      .then(result => {
        if (!result?.user) {
          setUserData(null);
          return;
        }

        const parsed = JSON.parse(result.user);
        setUserData(parsed);
      })
      .finally(() => setLoading(false));
  }, [username]);

  console.log("USD", userData)
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Find a patient</h2>

        <Form
          name="Patient name"
          handleSub={setUsername}
        >
          Form
        </Form>

        {loading && <p className="mt-3 text-sm text-slate-600">Loading user data...</p>}

        {!loading && username && !userData && (
          <p className="mt-3 text-sm text-rose-600">User not found.</p>
        )}

        {userData && (
          <div className="mt-6">
            <User
              userNameExternal={userData.username}
              drugsExternal={userData.drugs}
            />
          </div>
        )}
      </div>
    </div>
  );
}
