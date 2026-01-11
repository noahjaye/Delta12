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
      <Form
        name="Patient name"
        handleSub={setUsername}
      >
        Form
      </Form>

      {loading && <p className="text-sm text-slate-600">Loading user data...</p>}

      {userData && (
        <User
          userNameExternal={userData.username}
          drugsExternal={userData.drugs}
        />
      )}

      {!loading && username && !userData && (
        <p className="text-sm text-rose-600">User not found.</p>
      )}
    </div>
  );
}
