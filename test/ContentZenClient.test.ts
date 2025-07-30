import { ContentZenClient } from '../src/ContentZenClient';

global.fetch = jest.fn();

describe('ContentZenClient', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('calls the correct URL for getPublicDocuments', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ docs: [] }) });
    const client = new ContentZenClient();
    await client.getPublicDocuments({ collectionUuid: 'abc', limit: 5, offset: 2 });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.contentzen.io/api/v1/documents/collection/abc?limit=5&offset=2&state=published',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('adds Authorization header for authenticated requests', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });
    const client = new ContentZenClient({ apiToken: 'token123' });
    await client.getCollections();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.contentzen.io/api/v1/collections',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token123' }),
      })
    );
  });

  it('throws on HTTP error', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' });
    const client = new ContentZenClient();
    await expect(client.getPublicDocuments({ collectionUuid: 'abc' })).rejects.toThrow('Request failed: 404 Not Found');
  });
});