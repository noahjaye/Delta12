async function ping(url, data) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    let json = await res.json();
    console.log("JOSN", json);
    return json;
  }

export default ping