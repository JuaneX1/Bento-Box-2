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
