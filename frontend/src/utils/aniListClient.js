// AniList's public GraphQL API is a single POST endpoint. It's a first-party
// API (not a scraper like Jikan), so it sees far less downtime, but we still
// retry a few times with backoff to smooth over transient blips.
const ANILIST_ENDPOINT = 'https://graphql.anilist.co';
const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];

async function queryAniList(query, variables, { retries = 3, backoffMs = 600 } = {}) {
    for (let attempt = 0; ; attempt++) {
        let res;
        try {
            res = await fetch(ANILIST_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });
        } catch (networkError) {
            if (attempt >= retries) throw networkError;
            await new Promise((resolve) => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
            continue;
        }

        if (res.ok) {
            const json = await res.json();
            if (json.errors) {
                throw new Error(`AniList query failed: ${json.errors.map((e) => e.message).join(', ')}`);
            }
            return json.data;
        }

        if (!RETRYABLE_STATUSES.includes(res.status) || attempt >= retries) {
            throw new Error(`AniList request failed: ${res.status}`);
        }

        await new Promise((resolve) => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
    }
}

export default queryAniList;
