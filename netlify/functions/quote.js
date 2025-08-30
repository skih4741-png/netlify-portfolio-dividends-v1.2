export async function handler(event) {
  try {
    const sym = (event.queryStringParameters?.symbol || "").toUpperCase().trim();
    if (!sym) return { statusCode: 400, body: JSON.stringify({ error: "symbol required" }) };
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1d&interval=1d`;
    const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Netlify)" } });
    if (!resp.ok) return { statusCode: resp.status, body: JSON.stringify({ error: `Yahoo error ${resp.status}` }) };
    const data = await resp.json();
    const r = data?.chart?.result?.[0];
    const price = r?.meta?.regularMarketPrice ?? null;
    const currency = r?.meta?.currency ?? "USD";
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ symbol: sym, price, currency }) };
  } catch (e) {
    return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: String(e) }) };
  }
}