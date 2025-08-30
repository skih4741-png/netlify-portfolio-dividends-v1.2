export async function handler(event) {
  try {
    let symbols = (event.queryStringParameters?.symbols || event.queryStringParameters?.symbol || "")
      .toUpperCase().split(",").map(s => s.trim()).filter(Boolean);
    if (symbols.length === 0) return { statusCode: 400, body: JSON.stringify({ error: "symbols required" }) };
    const out = {};
    for (const sym of symbols) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=10y&interval=1mo&events=div`;
      const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Netlify)" } });
      if (!resp.ok) { out[sym] = { error: `Yahoo error ${resp.status}` }; continue; }
      const data = await resp.json();
      const r = data?.chart?.result?.[0];
      const evs = r?.events?.dividends || {};
      const arr = Object.values(evs).map(v => ({ date: new Date((v?.date || 0) * 1000).toISOString().slice(0,10), amount: v?.amount ?? null }))
        .filter(x => x.amount != null).sort((a,b) => a.date.localeCompare(b.date));
      out[sym] = { latest: arr.length ? arr[arr.length - 1] : null, history: arr };
    }
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(out) };
  } catch (e) {
    return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: String(e) }) };
  }
}