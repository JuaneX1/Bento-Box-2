# AniList API Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Jikan-backed `fetchJikan.js` utility and all its consumers with a new AniList GraphQL client, so anime data no longer depends on Jikan's flaky uptime.

**Architecture:** A low-level `aniListClient.js` handles the HTTP/retry mechanics of POSTing GraphQL queries to `https://graphql.anilist.co` (mirrors the retry/backoff behavior `fetchJikan.js` had). A higher-level `fetchAniList.js` builds the specific GraphQL queries each page needs (top anime, seasonal anime, search, anime-by-id, recommendations) and normalizes AniList's response shape into the same field names the existing components already render (`images.jpg.image_url`, `title_english`, `episodes`, `score`, `trailer.url`), except `mal_id`, which is renamed to `id` everywhere it appears, since it now holds an AniList id, not a MyAnimeList id. Five consumer files (`Browse.js`, `AnimeSearch.js`, `DailyBox.js`, `HomePage.js`, `AnimePage.js`) and two render-only files (`AnimeCard.js`, `BrowseContent.js`) are updated to use the new module and field name.

**Tech Stack:** React (CRA, react-scripts 5), Jest + React Testing Library (already configured), no new dependencies — AniList's API needs no SDK or API key, just `fetch`.

## Global Constraints

- AniList's public GraphQL endpoint requires no API key and has a ~90 requests/minute rate limit — ample for this app's traffic, no auth headers needed.
- AniList's anime `id` is not the same value as MyAnimeList's `mal_id` — every field that used to carry `mal_id` is renamed to `id` so nothing pretends to be a MAL id anymore.
- No new npm dependencies — implement the GraphQL call with plain `fetch`.

---

### Task 1: AniList GraphQL client (`aniListClient.js`)

**Files:**
- Create: `frontend/src/utils/aniListClient.js`
- Test: `frontend/src/utils/unitTests/aniListClient.test.js`

**Interfaces:**
- Produces: `queryAniList(query: string, variables: object, options?: { retries?: number, backoffMs?: number }): Promise<object>` — default export. POSTs to AniList, retries on `[429, 500, 502, 503, 504]` with exponential backoff, throws `Error('AniList request failed: <status>')` on a non-retryable/exhausted HTTP failure, throws `Error('AniList query failed: <messages>')` when the response body contains a GraphQL `errors` array, otherwise resolves to `json.data`.

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/utils/unitTests/aniListClient.test.js`:

```javascript
import queryAniList from '../aniListClient';

describe('queryAniList', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns parsed data on success', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ data: { Media: { id: 1 } } }),
        });

        const data = await queryAniList('query {}', {});

        expect(data).toEqual({ Media: { id: 1 } });
        expect(global.fetch).toHaveBeenCalledWith(
            'https://graphql.anilist.co',
            expect.objectContaining({ method: 'POST' })
        );
    });

    it('retries on a 500 response and then succeeds', async () => {
        global.fetch
            .mockResolvedValueOnce({ ok: false, status: 500 })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ data: { Media: { id: 2 } } }),
            });

        const data = await queryAniList('query {}', {}, { backoffMs: 0 });

        expect(data).toEqual({ Media: { id: 2 } });
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('throws after exhausting retries on a persistent 500', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 500 });

        await expect(
            queryAniList('query {}', {}, { retries: 2, backoffMs: 0 })
        ).rejects.toThrow('AniList request failed: 500');
        expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('throws immediately on a non-retryable status', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 400 });

        await expect(
            queryAniList('query {}', {}, { retries: 3, backoffMs: 0 })
        ).rejects.toThrow('AniList request failed: 400');
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('throws when the response body contains GraphQL errors', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ errors: [{ message: 'Not Found.' }] }),
        });

        await expect(queryAniList('query {}', {})).rejects.toThrow(
            'AniList query failed: Not Found.'
        );
    });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd frontend && npx react-scripts test src/utils/unitTests/aniListClient.test.js --watchAll=false`
Expected: FAIL with "Cannot find module '../aniListClient'"

- [ ] **Step 3: Implement `aniListClient.js`**

Create `frontend/src/utils/aniListClient.js`:

```javascript
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd frontend && npx react-scripts test src/utils/unitTests/aniListClient.test.js --watchAll=false`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add frontend/src/utils/aniListClient.js frontend/src/utils/unitTests/aniListClient.test.js
git commit -m "feat: add AniList GraphQL client with retry/backoff"
```

---

### Task 2: Normalized AniList queries (`fetchAniList.js`)

**Files:**
- Create: `frontend/src/utils/fetchAniList.js`
- Test: `frontend/src/utils/unitTests/fetchAniList.test.js`

**Interfaces:**
- Consumes: `queryAniList` from Task 1 (`frontend/src/utils/aniListClient.js`, default export).
- Produces (all named exports from `frontend/src/utils/fetchAniList.js`):
  - `fetchTopAnime(page = 1, perPage = 24): Promise<NormalizedAnime[]>`
  - `fetchSeasonalAnime(season: string, seasonYear: number, page = 1, perPage = 24): Promise<NormalizedAnime[]>`
  - `searchAnime(search: string, page = 1, perPage = 24): Promise<NormalizedAnime[]>`
  - `fetchAnimeById(id: number|string): Promise<NormalizedAnime>`
  - `fetchAnimeRecommendations(id: number|string, limit = 3): Promise<Array<{ entry: { id: number, title: string, images: { jpg: { image_url: string } } } }>>`
  - `getSeasonForDate(date: Date): { season: string, seasonYear: number }`
  - `getNextSeasonFrom(current: { season: string, seasonYear: number }): { season: string, seasonYear: number }`
  - `getCurrentSeason(): { season: string, seasonYear: number }`
  - `getUpcomingSeason(): { season: string, seasonYear: number }`
  - `NormalizedAnime` shape: `{ id: number, title_english: string, synopsis: string, images: { jpg: { image_url: string, large_image_url: string } }, episodes: number|null, score: number|null, trailer: { url: string|null } }`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/utils/unitTests/fetchAniList.test.js`:

```javascript
import queryAniList from '../aniListClient';
import {
    fetchTopAnime,
    fetchSeasonalAnime,
    searchAnime,
    fetchAnimeById,
    fetchAnimeRecommendations,
    getSeasonForDate,
    getNextSeasonFrom,
} from '../fetchAniList';

jest.mock('../aniListClient');

const RAW_MEDIA = {
    id: 101,
    title: { english: 'Test Anime', romaji: 'Tesuto Anime' },
    description: 'A show about <br>testing.<i>Great</i>',
    coverImage: { large: 'https://img/large.jpg', extraLarge: 'https://img/xl.jpg' },
    episodes: 12,
    averageScore: 85,
    trailer: { id: 'abc123', site: 'youtube' },
};

describe('fetchAniList normalization', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('normalizes a Media object returned for fetchAnimeById', async () => {
        queryAniList.mockResolvedValue({ Media: RAW_MEDIA });

        const anime = await fetchAnimeById(101);

        expect(anime).toEqual({
            id: 101,
            title_english: 'Test Anime',
            synopsis: 'A show about \ntesting.Great',
            images: {
                jpg: {
                    image_url: 'https://img/large.jpg',
                    large_image_url: 'https://img/xl.jpg',
                },
            },
            episodes: 12,
            score: 8.5,
            trailer: { url: 'https://www.youtube.com/watch?v=abc123' },
        });
    });

    it('falls back to the romaji title when no English title exists', async () => {
        queryAniList.mockResolvedValue({
            Media: { ...RAW_MEDIA, title: { english: null, romaji: 'Tesuto Anime' } },
        });

        const anime = await fetchAnimeById(101);

        expect(anime.title_english).toBe('Tesuto Anime');
    });

    it('returns a null trailer url when no trailer exists', async () => {
        queryAniList.mockResolvedValue({ Media: { ...RAW_MEDIA, trailer: null } });

        const anime = await fetchAnimeById(101);

        expect(anime.trailer).toEqual({ url: null });
    });

    it('maps a page of media through fetchTopAnime', async () => {
        queryAniList.mockResolvedValue({ Page: { media: [RAW_MEDIA] } });

        const list = await fetchTopAnime(1, 24);

        expect(list).toHaveLength(1);
        expect(list[0].id).toBe(101);
        expect(queryAniList).toHaveBeenCalledWith(expect.any(String), { page: 1, perPage: 24 });
    });

    it('passes season and year through to fetchSeasonalAnime', async () => {
        queryAniList.mockResolvedValue({ Page: { media: [] } });

        await fetchSeasonalAnime('WINTER', 2026, 2, 12);

        expect(queryAniList).toHaveBeenCalledWith(expect.any(String), {
            season: 'WINTER',
            seasonYear: 2026,
            page: 2,
            perPage: 12,
        });
    });

    it('passes the search term through to searchAnime', async () => {
        queryAniList.mockResolvedValue({ Page: { media: [] } });

        await searchAnime('bebop', 1, 24);

        expect(queryAniList).toHaveBeenCalledWith(expect.any(String), {
            search: 'bebop',
            page: 1,
            perPage: 24,
        });
    });

    it('maps recommendation nodes and drops null recommendations', async () => {
        queryAniList.mockResolvedValue({
            Media: {
                recommendations: {
                    nodes: [
                        {
                            mediaRecommendation: {
                                id: 5,
                                title: { english: 'Rec One', romaji: 'Ichi' },
                                coverImage: { large: 'https://img/5.jpg' },
                            },
                        },
                        { mediaRecommendation: null },
                    ],
                },
            },
        });

        const recommendations = await fetchAnimeRecommendations(101, 3);

        expect(recommendations).toEqual([
            { entry: { id: 5, title: 'Rec One', images: { jpg: { image_url: 'https://img/5.jpg' } } } },
        ]);
    });
});

describe('season helpers', () => {
    it('identifies a February date as WINTER', () => {
        expect(getSeasonForDate(new Date('2026-02-15T00:00:00Z'))).toEqual({
            season: 'WINTER',
            seasonYear: 2026,
        });
    });

    it('identifies a May date as SPRING', () => {
        expect(getSeasonForDate(new Date('2026-05-01T00:00:00Z'))).toEqual({
            season: 'SPRING',
            seasonYear: 2026,
        });
    });

    it('identifies an August date as SUMMER', () => {
        expect(getSeasonForDate(new Date('2026-08-13T00:00:00Z'))).toEqual({
            season: 'SUMMER',
            seasonYear: 2026,
        });
    });

    it('identifies a November date as FALL', () => {
        expect(getSeasonForDate(new Date('2026-11-01T00:00:00Z'))).toEqual({
            season: 'FALL',
            seasonYear: 2026,
        });
    });

    it('rolls FALL over into next year WINTER for the upcoming season', () => {
        const current = getSeasonForDate(new Date('2026-11-01T00:00:00Z'));
        expect(getNextSeasonFrom(current)).toEqual({ season: 'WINTER', seasonYear: 2027 });
    });

    it('advances WINTER to SPRING within the same year', () => {
        const current = getSeasonForDate(new Date('2026-02-15T00:00:00Z'));
        expect(getNextSeasonFrom(current)).toEqual({ season: 'SPRING', seasonYear: 2026 });
    });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd frontend && npx react-scripts test src/utils/unitTests/fetchAniList.test.js --watchAll=false`
Expected: FAIL with "Cannot find module '../fetchAniList'"

- [ ] **Step 3: Implement `fetchAniList.js`**

Create `frontend/src/utils/fetchAniList.js`:

```javascript
import queryAniList from './aniListClient';

const MEDIA_FIELDS = `
    id
    title {
        english
        romaji
    }
    description(asHtml: false)
    coverImage {
        large
        extraLarge
    }
    episodes
    averageScore
    trailer {
        id
        site
    }
`;

const SEASON_ORDER = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
}

function buildTrailerUrl(trailer) {
    if (!trailer || !trailer.id) return null;
    if (trailer.site === 'youtube') return `https://www.youtube.com/watch?v=${trailer.id}`;
    if (trailer.site === 'dailymotion') return `https://www.dailymotion.com/video/${trailer.id}`;
    return null;
}

function normalizeMedia(media) {
    const title = media.title.english || media.title.romaji;
    return {
        id: media.id,
        title_english: title,
        synopsis: stripHtml(media.description),
        images: {
            jpg: {
                image_url: media.coverImage?.large || '',
                large_image_url: media.coverImage?.extraLarge || media.coverImage?.large || '',
            },
        },
        episodes: media.episodes ?? null,
        score: typeof media.averageScore === 'number' ? Math.round(media.averageScore) / 10 : null,
        trailer: { url: buildTrailerUrl(media.trailer) },
    };
}

// Anime seasons: Jan-Mar = WINTER, Apr-Jun = SPRING, Jul-Sep = SUMMER, Oct-Dec = FALL.
export function getSeasonForDate(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    if (month <= 2) return { season: 'WINTER', seasonYear: year };
    if (month <= 5) return { season: 'SPRING', seasonYear: year };
    if (month <= 8) return { season: 'SUMMER', seasonYear: year };
    return { season: 'FALL', seasonYear: year };
}

export function getNextSeasonFrom(current) {
    const idx = SEASON_ORDER.indexOf(current.season);
    if (idx === SEASON_ORDER.length - 1) {
        return { season: SEASON_ORDER[0], seasonYear: current.seasonYear + 1 };
    }
    return { season: SEASON_ORDER[idx + 1], seasonYear: current.seasonYear };
}

export function getCurrentSeason() {
    return getSeasonForDate(new Date());
}

export function getUpcomingSeason() {
    return getNextSeasonFrom(getSeasonForDate(new Date()));
}

export async function fetchTopAnime(page = 1, perPage = 24) {
    const query = `
        query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
                    ${MEDIA_FIELDS}
                }
            }
        }
    `;
    const data = await queryAniList(query, { page, perPage });
    return data.Page.media.map(normalizeMedia);
}

export async function fetchSeasonalAnime(season, seasonYear, page = 1, perPage = 24) {
    const query = `
        query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, isAdult: false) {
                    ${MEDIA_FIELDS}
                }
            }
        }
    `;
    const data = await queryAniList(query, { season, seasonYear, page, perPage });
    return data.Page.media.map(normalizeMedia);
}

export async function searchAnime(search, page = 1, perPage = 24) {
    const query = `
        query ($search: String, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
                media(
                    type: ANIME
                    search: $search
                    format_in: [TV, MOVIE]
                    source: MANGA
                    genre_not_in: ["Ecchi", "Hentai"]
                    isAdult: false
                    sort: SEARCH_MATCH
                ) {
                    ${MEDIA_FIELDS}
                }
            }
        }
    `;
    const data = await queryAniList(query, { search, page, perPage });
    return data.Page.media.map(normalizeMedia);
}

export async function fetchAnimeById(id) {
    const query = `
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                ${MEDIA_FIELDS}
            }
        }
    `;
    const data = await queryAniList(query, { id: Number(id) });
    return normalizeMedia(data.Media);
}

export async function fetchAnimeRecommendations(id, limit = 3) {
    const query = `
        query ($id: Int, $perPage: Int) {
            Media(id: $id, type: ANIME) {
                recommendations(sort: RATING_DESC, perPage: $perPage) {
                    nodes {
                        mediaRecommendation {
                            id
                            title {
                                english
                                romaji
                            }
                            coverImage {
                                large
                            }
                        }
                    }
                }
            }
        }
    `;
    const data = await queryAniList(query, { id: Number(id), perPage: limit });
    const nodes = data.Media?.recommendations?.nodes || [];
    return nodes
        .filter((node) => node.mediaRecommendation)
        .map((node) => {
            const media = node.mediaRecommendation;
            return {
                entry: {
                    id: media.id,
                    title: media.title.english || media.title.romaji,
                    images: {
                        jpg: {
                            image_url: media.coverImage?.large || '',
                        },
                    },
                },
            };
        });
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd frontend && npx react-scripts test src/utils/unitTests/fetchAniList.test.js --watchAll=false`
Expected: PASS (13 tests)

- [ ] **Step 5: Commit**

```bash
git add frontend/src/utils/fetchAniList.js frontend/src/utils/unitTests/fetchAniList.test.js
git commit -m "feat: add normalized AniList query functions"
```

---

### Task 3: Wire up `Browse.js`

**Files:**
- Modify: `frontend/src/components/Browse.js`

**Interfaces:**
- Consumes: `fetchTopAnime`, `fetchSeasonalAnime`, `getCurrentSeason`, `getUpcomingSeason` from Task 2 (`frontend/src/utils/fetchAniList.js`).

- [ ] **Step 1: Replace the Jikan import and category definitions**

In `frontend/src/components/Browse.js`, replace line 3 and lines 15-19:

```javascript
import fetchJikan from '../utils/fetchJikan';
```
with:
```javascript
import { fetchTopAnime, fetchSeasonalAnime, getCurrentSeason, getUpcomingSeason } from '../utils/fetchAniList';
```

and replace:
```javascript
    const categories = [
        { name: 'top rated', endpoint: 'https://api.jikan.moe/v4/top/anime?limit=24' },
        { name: 'upcoming', endpoint: 'https://api.jikan.moe/v4/seasons/upcoming?limit=24' },
        { name: 'airing now', endpoint: 'https://api.jikan.moe/v4/seasons/now?limit=24' },
    ];
```
with:
```javascript
    const categories = [
        { name: 'top rated', fetch: (page) => fetchTopAnime(page, 24) },
        {
            name: 'upcoming',
            fetch: (page) => {
                const { season, seasonYear } = getUpcomingSeason();
                return fetchSeasonalAnime(season, seasonYear, page, 24);
            },
        },
        {
            name: 'airing now',
            fetch: (page) => {
                const { season, seasonYear } = getCurrentSeason();
                return fetchSeasonalAnime(season, seasonYear, page, 24);
            },
        },
    ];
```

- [ ] **Step 2: Update `fetchAnimeByCategory` to call the category's fetch function**

Replace:
```javascript
    const fetchAnimeByCategory = async (endpoint, page = 1) => {
        setIsLoading(true);
        setError('');
        try {
            const data = await fetchJikan(`${endpoint}&page=${page}`);
            setIsLoading(false);
            return data.data;
        } catch (error) {
            console.error('Error fetching anime:', error);
            setError(`Error fetching data: ${error.message}`);
            setIsLoading(false);
            return [];
        }
    };
```
with:
```javascript
    const fetchAnimeByCategory = async (fetchFn, page = 1) => {
        setIsLoading(true);
        setError('');
        try {
            const data = await fetchFn(page);
            setIsLoading(false);
            return data;
        } catch (error) {
            console.error('Error fetching anime:', error);
            setError(`Error fetching data: ${error.message}`);
            setIsLoading(false);
            return [];
        }
    };
```

- [ ] **Step 3: Update the three call sites to pass `category.fetch` instead of `category.endpoint`**

In the `fetchInitialData` effect, replace:
```javascript
                    fetchAnimeByCategory(animes.endpoint, 1).then(initialData => {
```
with:
```javascript
                    fetchAnimeByCategory(animes.fetch, 1).then(initialData => {
```

In `fetchMoreAnime`, replace:
```javascript
            fetchAnimeByCategory(category.endpoint, nextPage) 
```
with:
```javascript
            fetchAnimeByCategory(category.fetch, nextPage)
```

In the category buttons `onClick`, replace:
```javascript
                            onClick={() => handleCategoryChange(category.name, category.endpoint)}
```
with:
```javascript
                            onClick={() => handleCategoryChange(category.name)}
```
(the `endpoint`/second parameter was never read inside `handleCategoryChange`, so dropping the argument is safe.)

- [ ] **Step 4: Manually verify**

Run: `cd frontend && npm start`
Navigate to the Browse page (via Dashboard) and click each of "TOP RATED", "UPCOMING", and "AIRING NOW". Confirm each renders a grid of anime cards, and that scrolling to the bottom of a category loads another page without errors in the browser console.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/Browse.js
git commit -m "feat: wire Browse.js to AniList"
```

---

### Task 4: Wire up `AnimeSearch.js`

**Files:**
- Modify: `frontend/src/components/animeCards/AnimeSearch.js`

**Interfaces:**
- Consumes: `searchAnime`, `fetchTopAnime` from Task 2 (`frontend/src/utils/fetchAniList.js`).

- [ ] **Step 1: Replace the import and the two fetch functions**

Replace line 4:
```javascript
import fetchJikan from '../../utils/fetchJikan';
```
with:
```javascript
import { searchAnime, fetchTopAnime } from '../../utils/fetchAniList';
```

Replace:
```javascript
    const fetchAnime = async (query) => {
        try {
            const search = await fetchJikan(`https://api.jikan.moe/v4/anime?q=${query}&genres_exclude=9,49,12`);

            if (search && search.data) {
                const filteredData = search.data.filter(anime => {
                    return (anime.type === 'TV' || anime.type === 'Movie') && anime.source === 'Manga';
                });
                setAnimeList(filteredData);
            }
            else {
                console.error('Data structure not as expected: ', search);
            }
        }
        catch (error) {
            console.error('Error fetching search anime: ', error);
        }
    };

    const fetchTopAnime = async () => {
        try {
            const temp = await fetchJikan(`https://api.jikan.moe/v4/top/anime?limit=24`);
            setAnimeFound(temp.data);
        } catch (error) {
            console.error('Error fetching top anime:', error);
        }
    };
```
with:
```javascript
    const fetchAnime = async (query) => {
        try {
            const results = await searchAnime(query);
            setAnimeList(results);
        } catch (error) {
            console.error('Error fetching search anime: ', error);
        }
    };

    const loadTopAnime = async () => {
        try {
            const results = await fetchTopAnime();
            setAnimeFound(results);
        } catch (error) {
            console.error('Error fetching top anime:', error);
        }
    };
```

(the AniList query already filters by `format_in: [TV, MOVIE]` and `source: MANGA` server-side — see Task 2 — so the client-side `.filter()` is no longer needed; the local wrapper is renamed `loadTopAnime` since it would otherwise shadow the imported `fetchTopAnime`.)

- [ ] **Step 2: Update the effect that calls the renamed wrapper**

Replace:
```javascript
    useEffect(() => {
        // Fetch top anime if typeDefault is "topAnime"
        if (typeDefault === "topAnime") {
            fetchTopAnime();
        }
    }, [typeDefault]);
```
with:
```javascript
    useEffect(() => {
        // Fetch top anime if typeDefault is "topAnime"
        if (typeDefault === "topAnime") {
            loadTopAnime();
        }
    }, [typeDefault]);
```

- [ ] **Step 3: Manually verify**

Run: `cd frontend && npm start`
Navigate to the page that renders `<AnimeSearch typeDefault="topAnime" />` (Dashboard), confirm it loads a default grid, then type a search term (e.g. "bebop") and submit — confirm results render.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/animeCards/AnimeSearch.js
git commit -m "feat: wire AnimeSearch.js to AniList"
```

---

### Task 5: Wire up `DailyBox.js`

**Files:**
- Modify: `frontend/src/components/pageFeatures/DailyBox.js`

**Interfaces:**
- Consumes: `fetchTopAnime` from Task 2 (`frontend/src/utils/fetchAniList.js`).

- [ ] **Step 1: Replace the import and fetch call**

Replace line 3:
```javascript
import fetchJikan from '../../utils/fetchJikan';
```
with:
```javascript
import { fetchTopAnime } from '../../utils/fetchAniList';
```

Replace:
```javascript
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const data = await fetchJikan(`https://api.jikan.moe/v4/top/anime?limit=24&page=${randomPage}`);
        setPool(data.data || []);
```
with:
```javascript
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const data = await fetchTopAnime(randomPage, 24);
        setPool(data || []);
```

- [ ] **Step 2: Rename the `mal_id` reference**

Replace:
```javascript
    window.location.href = `/anime/${recommendedAnime.mal_id}`;
```
with:
```javascript
    window.location.href = `/anime/${recommendedAnime.id}`;
```

- [ ] **Step 3: Manually verify**

Run: `cd frontend && npm start`
Navigate to the Dashboard page, confirm the "Daily Box" recommendation card loads a title and image, "Shuffle" swaps to a different anime, and "More Details" navigates to that anime's detail page.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/pageFeatures/DailyBox.js
git commit -m "feat: wire DailyBox.js to AniList"
```

---

### Task 6: Wire up `HomePage.js`

**Files:**
- Modify: `frontend/src/pages/HomePage.js`

**Interfaces:**
- Consumes: `fetchSeasonalAnime`, `getCurrentSeason`, `fetchTopAnime` from Task 2 (`frontend/src/utils/fetchAniList.js`).

- [ ] **Step 1: Replace the import and `getData` function**

Replace line 6:
```javascript
import fetchJikan from '../utils/fetchJikan';
```
with:
```javascript
import { fetchSeasonalAnime, getCurrentSeason, fetchTopAnime } from '../utils/fetchAniList';
```

Replace:
```javascript
  const getData = async () => {
    try {
      const resData = await fetchJikan(
        `https://api.jikan.moe/v4/seasons/now?limit=24`
      );
      setAnimeData(resData.data);
    } catch (error) {
      console.error('Error fetching seasonal anime, falling back to top anime:', error);
      try {
        const fallbackData = await fetchJikan(`https://api.jikan.moe/v4/top/anime?limit=24`);
        setAnimeData(fallbackData.data);
      } catch (fallbackError) {
        console.error('Error fetching fallback anime:', fallbackError);
      }
    }
  };
```
with:
```javascript
  const getData = async () => {
    try {
      const { season, seasonYear } = getCurrentSeason();
      const resData = await fetchSeasonalAnime(season, seasonYear, 1, 24);
      setAnimeData(resData);
    } catch (error) {
      console.error('Error fetching seasonal anime, falling back to top anime:', error);
      try {
        const fallbackData = await fetchTopAnime(1, 24);
        setAnimeData(fallbackData);
      } catch (fallbackError) {
        console.error('Error fetching fallback anime:', fallbackError);
      }
    }
  };
```

- [ ] **Step 2: Manually verify**

Run: `cd frontend && npm start`
Load the home page (`/`), confirm the scrolling sidebar of anime posters renders images without broken-image icons.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/HomePage.js
git commit -m "feat: wire HomePage.js to AniList"
```

---

### Task 7: Wire up `AnimePage.js`

**Files:**
- Modify: `frontend/src/pages/AnimePage.js`

**Interfaces:**
- Consumes: `fetchAnimeById`, `fetchAnimeRecommendations` from Task 2 (`frontend/src/utils/fetchAniList.js`).

- [ ] **Step 1: Replace the import and the two fetch functions**

Replace line 9:
```javascript
import fetchJikan from '../utils/fetchJikan';
```
with:
```javascript
import { fetchAnimeById, fetchAnimeRecommendations } from '../utils/fetchAniList';
```

Replace:
```javascript
    const fetchAnimeDetails = async () => {
      try {
        const data = await fetchJikan(`https://api.jikan.moe/v4/anime/${id}`);
        setAnimeData(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setLoading(false);
      }
    };

    const fetchAnimeRecommendations = async () => {
      try {
        const data = await fetchJikan(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
        const animeRecommendationsList = data.data.slice(0, 3);

        setRecommendations(animeRecommendationsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime recommendations:', error);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
    fetchAnimeRecommendations();
```
with:
```javascript
    const fetchAnimeDetails = async () => {
      try {
        const data = await fetchAnimeById(id);
        setAnimeData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setLoading(false);
      }
    };

    const loadAnimeRecommendations = async () => {
      try {
        const data = await fetchAnimeRecommendations(id, 3);
        setRecommendations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime recommendations:', error);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
    loadAnimeRecommendations();
```
(the local effect function is renamed `loadAnimeRecommendations` since it would otherwise shadow the imported `fetchAnimeRecommendations`; the `.slice(0, 3)` is dropped since `fetchAnimeRecommendations(id, 3)` already limits to 3 server-side.)

- [ ] **Step 2: Rename the two `mal_id` references in the recommendations list**

Replace:
```javascript
                      <div key={recommendation.entry.mal_id} className="recommendation-item p-4">
                        <Link className="text-decoration-none" to={`/anime/${recommendation.entry.mal_id}`}>
```
with:
```javascript
                      <div key={recommendation.entry.id} className="recommendation-item p-4">
                        <Link className="text-decoration-none" to={`/anime/${recommendation.entry.id}`}>
```

- [ ] **Step 3: Manually verify**

Run: `cd frontend && npm start`
Navigate to an anime detail page (e.g. click into any card from Browse or Dashboard), confirm the title, image, synopsis, episode count, and score render, and that "You Might Also Like" shows up to 3 recommendation cards that link to their own detail pages.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/AnimePage.js
git commit -m "feat: wire AnimePage.js to AniList"
```

---

### Task 8: Rename `mal_id` in render-only components, delete `fetchJikan.js`, full verification

**Files:**
- Modify: `frontend/src/components/animeCards/AnimeCard.js`
- Modify: `frontend/src/components/pageFeatures/BrowseContent.js`
- Delete: `frontend/src/utils/fetchJikan.js`

**Interfaces:**
- Consumes: `NormalizedAnime.id` from Task 2 (replaces the removed `mal_id` field).

- [ ] **Step 1: Rename `mal_id` in `AnimeCard.js`**

In `frontend/src/components/animeCards/AnimeCard.js`, replace:
```javascript
             to={`/anime/${anime.mal_id}`}
```
with:
```javascript
             to={`/anime/${anime.id}`}
```

- [ ] **Step 2: Rename `mal_id` in `BrowseContent.js`**

In `frontend/src/components/pageFeatures/BrowseContent.js`, replace:
```javascript
                            <div key={anime.mal_id} className="col mb-5 d-flex justify-content-center">
```
with:
```javascript
                            <div key={anime.id} className="col mb-5 d-flex justify-content-center">
```

- [ ] **Step 3: Delete `fetchJikan.js`**

```bash
git rm frontend/src/utils/fetchJikan.js
```

Confirm nothing still imports it:
```bash
grep -rn "fetchJikan" frontend/src
```
Expected: no output.

- [ ] **Step 4: Run the full frontend test suite**

Run: `cd frontend && CI=true npm test`
Expected: all `src/utils/unitTests/*.test.js` tests pass. (`components/unitTests/AnimeCard.test.js` and `components/unitTests/AnimeSearch.test.js` were already failing/unrelated before this change — not introduced by this plan; do not attempt to fix them here.)

- [ ] **Step 5: Full manual walkthrough**

Run: `cd frontend && npm start`
Walk through, in order, confirming no console errors and no broken images:
1. Home page (`/`) — scrolling sidebar loads.
2. Dashboard — Daily Box recommendation loads, Browse categories load and paginate, Search returns results for a query and for the default "top anime" view.
3. Click through to an anime detail page — details and recommendations render, recommendation links navigate correctly.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/animeCards/AnimeCard.js frontend/src/components/pageFeatures/BrowseContent.js
git commit -m "chore: rename mal_id to id, remove fetchJikan.js"
```
