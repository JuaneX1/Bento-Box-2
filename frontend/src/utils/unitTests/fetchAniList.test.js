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
    genres: ['Action', 'Comedy'],
    status: 'FINISHED',
    duration: 24,
    format: 'TV',
    studios: { nodes: [{ name: 'Test Studio' }] },
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
            genres: ['Action', 'Comedy'],
            status: 'FINISHED',
            duration: 24,
            format: 'TV',
            studio: 'Test Studio',
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
