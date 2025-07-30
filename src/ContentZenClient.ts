// Official JavaScript/TypeScript SDK for ContentZen Headless CMS
// Supports both browser and Node.js environments

export interface ContentZenClientOptions {
  apiToken?: string;
  baseUrl?: string;
}

export class ContentZenClient {
  private apiToken?: string;
  private baseUrl: string;

  constructor(options: ContentZenClientOptions = {}) {
    this.apiToken = options.apiToken;
    this.baseUrl = options.baseUrl || 'https://api.contentzen.io';
  }

  /**
   * Internal method to perform HTTP requests
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = options.headers ? { ...options.headers as any } : {};
    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Get all published documents from a public collection (no authentication required)
   * @param params.collectionUuid - UUID of the collection
   * @param params.limit - Number of items to return (default 10)
   * @param params.offset - Number of items to skip (default 0)
   * @param params.state - Document state filter (default 'published')
   */
  async getPublicDocuments(params: {
    collectionUuid: string;
    limit?: number;
    offset?: number;
    state?: string;
  }): Promise<any> {
    const { collectionUuid, limit = 10, offset = 0, state = 'published' } = params;
    const q = `limit=${limit}&offset=${offset}&state=${state}`;
    return this.request(
      `/api/v1/documents/collection/${collectionUuid}?${q}`,
      { method: 'GET' }
    );
  }

  /**
   * Get a specific document from a public collection (no authentication required)
   * @param params.collectionUuid - UUID of the collection
   * @param params.documentUuid - UUID of the document
   */
  async getPublicDocument(params: {
    collectionUuid: string;
    documentUuid: string;
  }): Promise<any> {
    const { collectionUuid, documentUuid } = params;
    return this.request(
      `/api/v1/documents/collection/${collectionUuid}/${documentUuid}`,
      { method: 'GET' }
    );
  }

  // ------------------- Documents (API Token) -------------------

  /**
   * Get documents from a collection (API token required)
   * @param params.collectionUuid - UUID of the collection
   * @param params.limit - Number of items to return (default 10)
   * @param params.offset - Number of items to skip (default 0)
   */
  async getDocuments(params: {
    collectionUuid: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const { collectionUuid, limit = 10, offset = 0 } = params;
    const q = `limit=${limit}&offset=${offset}`;
    return this.request(
      `/api/v1/documents/${collectionUuid}?${q}`,
      { method: 'GET' }
    );
  }

  /**
   * Get a specific document (API token required)
   * @param params.collectionUuid - UUID of the collection
   * @param params.documentUuid - UUID of the document
   */
  async getDocument(params: {
    collectionUuid: string;
    documentUuid: string;
  }): Promise<any> {
    const { collectionUuid, documentUuid } = params;
    return this.request(
      `/api/v1/documents/${collectionUuid}/${documentUuid}`,
      { method: 'GET' }
    );
  }

  /**
   * Create a new document (API token required)
   * @param params.collectionUuid - UUID of the collection
   * @param params.payload - Document payload
   * @param params.lang - Language (e.g., 'en')
   * @param params.state - Document state (e.g., 'draft')
   */
  async createDocument(params: {
    collectionUuid: string;
    payload: Record<string, any>;
    lang?: string;
    state?: string;
  }): Promise<any> {
    const { collectionUuid, payload, lang = 'en', state = 'draft' } = params;
    return this.request(
      `/api/v1/documents/${collectionUuid}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, lang, state }),
      }
    );
  }

  /**
   * Update an existing document (API token required)
   * @param params.collectionUuid - UUID of the collection
   * @param params.documentUuid - UUID of the document
   * @param params.payload - Document payload
   * @param params.state - Document state (e.g., 'published')
   */
  async updateDocument(params: {
    collectionUuid: string;
    documentUuid: string;
    payload: Record<string, any>;
    state?: string;
  }): Promise<any> {
    const { collectionUuid, documentUuid, payload, state } = params;
    return this.request(
      `/api/v1/documents/${collectionUuid}/${documentUuid}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, state }),
      }
    );
  }

  /**
   * Delete a document (API token required)
   * @param params.collectionUuid - UUID of the collection
   * @param params.documentUuid - UUID of the document
   */
  async deleteDocument(params: {
    collectionUuid: string;
    documentUuid: string;
  }): Promise<any> {
    const { collectionUuid, documentUuid } = params;
    return this.request(
      `/api/v1/documents/${collectionUuid}/${documentUuid}`,
      { method: 'DELETE' }
    );
  }

  // ------------------- Collections (API Token) -------------------

  /**
   * Get all collections for a project (API token required)
   */
  async getCollections(): Promise<any> {
    return this.request('/api/v1/collections', { method: 'GET' });
  }

  /**
   * Get a specific collection (API token required)
   * @param collectionUuid - UUID of the collection
   */
  async getCollection(collectionUuid: string): Promise<any> {
    return this.request(`/api/v1/collections/${collectionUuid}`, { method: 'GET' });
  }

  /**
   * Create a new collection (API token required)
   * @param params - Collection creation parameters
   */
  async createCollection(params: {
    name: string;
    display_name: string;
    description?: string;
    is_public?: boolean;
    fields: Array<Record<string, any>>;
  }): Promise<any> {
    return this.request(
      '/api/v1/collections',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Update a collection (API token required)
   * @param collectionUuid - UUID of the collection
   * @param params - Collection update parameters
   */
  async updateCollection(collectionUuid: string, params: {
    display_name?: string;
    description?: string;
    is_public?: boolean;
    fields?: Array<Record<string, any>>;
  }): Promise<any> {
    return this.request(
      `/api/v1/collections/${collectionUuid}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Delete a collection (API token required)
   * @param collectionUuid - UUID of the collection
   */
  async deleteCollection(collectionUuid: string): Promise<any> {
    return this.request(`/api/v1/collections/${collectionUuid}`, { method: 'DELETE' });
  }

  /**
   * Get collection schema (API token required)
   * @param collectionUuid - UUID of the collection
   */
  async getCollectionSchema(collectionUuid: string): Promise<any> {
    return this.request(`/api/v1/collections/${collectionUuid}/schema`, { method: 'GET' });
  }

  /**
   * Get collection fields (API token required)
   * @param collectionUuid - UUID of the collection
   */
  async getCollectionFields(collectionUuid: string): Promise<any> {
    return this.request(`/api/v1/collections/${collectionUuid}/fields`, { method: 'GET' });
  }

  /**
   * Get available field types (API token required)
   */
  async getFieldTypes(): Promise<any> {
    return this.request('/api/v1/collections/field-types', { method: 'GET' });
  }

  // ------------------- Media (API Token) -------------------

  /**
   * List all media files (API token required)
   */
  async listMedia(): Promise<any> {
    return this.request('/api/v1/media/ls', { method: 'GET' });
  }

  /**
   * Upload a media file (API token required)
   * @param file - File to upload (browser: File, Node.js: Buffer or Stream)
   */
  async uploadMedia(file: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/api/v1/media/upload', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Get specific media file details (API token required)
   * @param mediaUuid - UUID of the media file
   */
  async getMediaFile(mediaUuid: string): Promise<any> {
    return this.request(`/api/v1/media/${mediaUuid}`, { method: 'GET' });
  }

  /**
   * Update media file metadata (API token required)
   * @param mediaUuid - UUID of the media file
   * @param params - Metadata to update
   */
  async updateMedia(mediaUuid: string, params: { alt_text?: string }): Promise<any> {
    return this.request(
      `/api/v1/media/${mediaUuid}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Delete a media file (API token required)
   * @param mediaUuid - UUID of the media file
   */
  async deleteMedia(mediaUuid: string): Promise<any> {
    return this.request(`/api/v1/media/${mediaUuid}`, { method: 'DELETE' });
  }

  /**
   * Download a media file (API token required)
   * @param mediaUuid - UUID of the media file
   * @returns Blob (browser) or Buffer (Node.js)
   */
  async downloadMedia(mediaUuid: string): Promise<any> {
    const headers: Record<string, string> = {};
    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }
    const res = await fetch(`${this.baseUrl}/api/v1/media/${mediaUuid}/download`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return typeof window === 'undefined' ? res.buffer() : res.blob();
  }

  // ------------------- Webhooks (API Token) -------------------

  /**
   * List all webhooks (API token required)
   */
  async listWebhooks(): Promise<any> {
    return this.request('/api/v1/webhooks', { method: 'GET' });
  }

  /**
   * Create a new webhook (API token required)
   * @param params - Webhook creation parameters
   */
  async createWebhook(params: {
    name: string;
    url: string;
    events: string[];
    method: string;
  }): Promise<any> {
    return this.request(
      '/api/v1/webhooks',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Update a webhook (API token required)
   * @param webhookUuid - UUID of the webhook
   * @param params - Webhook update parameters
   */
  async updateWebhook(webhookUuid: string, params: {
    name?: string;
    url?: string;
    events?: string[];
    method?: string;
  }): Promise<any> {
    return this.request(
      `/api/v1/webhooks/${webhookUuid}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Delete a webhook (API token required)
   * @param webhookUuid - UUID of the webhook
   */
  async deleteWebhook(webhookUuid: string): Promise<any> {
    return this.request(`/api/v1/webhooks/${webhookUuid}`, { method: 'DELETE' });
  }
}