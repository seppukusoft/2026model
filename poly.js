let _polymarketPromise = null;

async function getPolymarketPriors() {
    if (!_polymarketPromise) {
        _polymarketPromise = (async () => {
            try {
                const res  = await fetch("https://gamma-api.polymarket.com/events/32224");
                const data = await res.json();
                const markets = data.markets;

                if (!markets?.length) {
                    console.warn("Polymarket: no markets found");
                    return null;
                }

                function parsePrice(market) {
                    try { return parseFloat(JSON.parse(market.outcomePrices)?.[0]); }
                    catch { return parseFloat(market.bestAsk); }
                }

                const demRaw = parsePrice(markets[0]);
                const repRaw = parsePrice(markets[1]);

                if (isNaN(demRaw) || isNaN(repRaw)) {
                    console.warn("Polymarket: unparseable prices");
                    return null;
                }

                const sum = demRaw + repRaw;
                return { DEM: (demRaw / sum) * 100, REP: (repRaw / sum) * 100 };

            } catch (err) {
                console.warn("Polymarket fetch failed:", err);
                return null;
            }
        })();
    }
    return _polymarketPromise;
}

function applyMarketPriorToEstimates(state, estimates, marketPrior) {
    if (!marketPrior) {
        console.log("no priors; check polymarket api");
        return estimates;
    }
    const out = Object.create(null);
    for (const candidate in estimates) {
        const { pct, party } = estimates[candidate];
        const marketTarget = marketPrior[party];
        out[candidate] = {
            pct: marketTarget !== undefined ? (1 - 0.06) * pct + 0.06 * marketTarget : pct,
            party
        };
    }
    return renormalizeEstimates(out);
}
