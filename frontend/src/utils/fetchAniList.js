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
