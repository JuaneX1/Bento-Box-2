// Jikan (api.jikan.moe) is a free, rate-limited, unauthenticated API and
// intermittently returns 429/5xx under load. Retry a few times with
// backoff before giving up, instead of surfacing a transient blip as
// an empty page.
const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];

async function fetchJikan(url, { retries = 3, backoffMs = 600 } = {}) {
    for (let attempt = 0; ; attempt++) {
        let res;
        try {
            res = await fetch(url);
        } catch (networkError) {
            if (attempt >= retries) throw networkError;
            await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
            continue;
        }

        if (res.ok) return res.json();

        if (!RETRYABLE_STATUSES.includes(res.status) || attempt >= retries) {
            throw new Error(`Jikan request failed: ${res.status} ${url}`);
        }

        await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
    }
}

export default fetchJikan;
