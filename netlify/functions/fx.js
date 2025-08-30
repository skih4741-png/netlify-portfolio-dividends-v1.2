export async function handler(event) {
  try {
    const url = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW";
    const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Netlify)" } });
    if (!resp.ok) return { statusCode: resp.status, body: JSON.stringify({ error: `FX error ${resp.status}` }) };
    const data = await resp.json();
    const rate = data?.rates?.KRW ?? null;
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ base: "USD", to: "KRW", rate, date: data?.date }) };
  } catch(e) {
    return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: String(e) }) };
  }
}