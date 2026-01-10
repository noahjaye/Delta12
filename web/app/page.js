'use client';

import emailpassword from '../../types/body.tsx';
import body from '../../types/body'

export default function Home() {
  async function ping(url, data) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    console.log(await res.json());
  }

  return (
    <div>
      <button onClick={() => ping("login")}>Login</button>
      <button onClick={() => ping("invite")}>Invite</button>
      <button onClick={() => ping("signup")}>Newuser</button>
    </div>
  )
}

