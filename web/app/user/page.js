'use client';
import User from "./user"

export default function Page() {
  const lebron = {
    username: "LeBron",
    drugs: [
      ["Tylenol", 0, 1, "pills"],
      ["Vivace", 0, 3, "grams"]
    ]
  }

  return (
    <div>
      <User userNameExternal={lebron.username} drugsExternal={lebron.drugs} />
    </div>
  )
}
