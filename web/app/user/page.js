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

  return (
    <div>
      <Form
        name="Patient name"
        handleSub={setUsername}
      >
        Form
      </Form>

      {loading && <p>Loading user data...</p>}

      {userData && (
        <User
          userNameExternal={userData.username}
          drugsExternal={userData.drugs}
        />
      )}

      {!loading && username && !userData && (
        <p>User not found.</p>
      )}
    </div>
  );
}
