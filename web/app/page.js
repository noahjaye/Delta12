'use client';

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

  let db = [
    {"LeBron" : [["Tylenol", 1], ["Vivace", 3]]},
    {"LeTwo" : [["Tylenol", 4], ["Vivace", 2]]},
  ]

  return (
    <div className="flex flex-col align-middle">

      <h1 className="flex justify-center text-5xl p-8"> 
        Lorem Ipsum 
      </h1>

      <table className="w-9/12 border border-gray-300 mx-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Medication</th>
            <th className="px-4 py-2 border">Dosage</th>
            <th className="px-4 py-2 border">Edit</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="px-4 py-2 border">{db[0]["LeBron"][0][0]}</td>
            <td className="px-4 py-2 border">{db[0]["LeBron"][0][1]}</td>
            <td className="px-4 py-2 border">
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>


      {/* <div className="flex justify-center ">
          {/* {db.map((user) => ( */}
            {/* <div className="flex pl-10 pr-10 gap-5">
                <p>Text</p>
                <p>Dosage</p>
                <button>Button</button>
            </div> */} 
            {/* <li key={fruit}>{fruit}</li> */}
          {/* ))} */}

      {/* </div> */}


      <div>
        <button onClick={() => ping("invite")}>Invite</button>
        <button onClick={() => ping("signup")}>New user</button>
        <button onClick={() => ping("login")}>Login</button>
      </div>
    </div>
  )
}

