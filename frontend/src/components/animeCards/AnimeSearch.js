import React, { useEffect, useMemo, useRef, useState } from 'react';
import BrowseContent from '../pageFeatures/BrowseContent'
import { searchAnime, fetchPopularAnime } from '../../utils/fetchAniList';

const DEEP_SEARCH_DEBOUNCE_MS = 300;
// Below this length AniList's own search index returns sparse or irrelevant matches,
// so short queries are answered entirely from the local popularity pool instead
const DEEP_SEARCH_MIN_LENGTH = 3;
const POOL_PAGES = 3;
const POOL_PAGE_SIZE = 50;

// Ranks pool matches by whether the title starts with the query, keeping popularity order within each group
function filterPool(pool, query) {
    const q = query.toLowerCase();
    const starts = [];
    const contains = [];
    for (const anime of pool) {
        const title = anime.title_english?.toLowerCase() || '';
        if (title.startsWith(q)) {
            starts.push(anime);
        } else if (title.includes(q)) {
            contains.push(anime);
        }
    }
    return [...starts, ...contains];
}

function AnimeSearch() {
    const [pool, setPool] = useState([]);
    const [isPoolLoading, setIsPoolLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deepResults, setDeepResults] = useState([]);
    const latestRequestId = useRef(0);

    // Loads a large, popularity-ranked pool once so every keystroke can be answered locally and instantly
    useEffect(() => {
        async function loadPool() {
            try {
                const pages = await Promise.all(
                    Array.from({ length: POOL_PAGES }, (_, index) => fetchPopularAnime(index + 1, POOL_PAGE_SIZE))
                );
                setPool(pages.flat());
            } catch (error) {
                console.error('Error fetching popular anime pool:', error);
            } finally {
                setIsPoolLoading(false);
            }
        }

        loadPool();
    }, []);

    const trimmedSearch = search.trim();

    const poolMatches = useMemo(
        () => (trimmedSearch ? filterPool(pool, trimmedSearch) : pool),
        [pool, trimmedSearch]
    );

    // Supplements pool matches with a full-catalog search once the query has enough signal to be reliable
    useEffect(() => {
        if (trimmedSearch.length < DEEP_SEARCH_MIN_LENGTH) {
            setDeepResults([]);
            return;
        }

        const requestId = ++latestRequestId.current;

        const timeout = setTimeout(async () => {
            try {
                const results = await searchAnime(trimmedSearch);
                if (requestId === latestRequestId.current) {
                    setDeepResults(results);
                }
            } catch (error) {
                console.error('Error fetching search anime: ', error);
            }
        }, DEEP_SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [trimmedSearch]);

    const displayedList = useMemo(() => {
        const seenIds = new Set(poolMatches.map((anime) => anime.id));
        const extras = deepResults.filter((anime) => !seenIds.has(anime.id));
        return [...poolMatches, ...extras];
    }, [poolMatches, deepResults]);

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center p-4">
                <form className="d-flex align-items-center" style={{ maxWidth: '500px', width: '100%' }} onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search anime..."
                        className="form-control rounded-0"
                        style={{ flex: '1', backgroundColor: 'var(--ink-raised)', color: 'var(--cheek)', border: '1px solid var(--blue-shade)' }}
                    />
                </form>
            </div>
            {isPoolLoading ? (
                <div className="compartment-grid d-flex flex-wrap justify-content-center gap-4 p-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={`skeleton-${index}`} className="compartment-skeleton" />
                    ))}
                </div>
            ) : (
                <BrowseContent animeList={displayedList} />
            )}
        </div>
    )
}

export default AnimeSearch;
