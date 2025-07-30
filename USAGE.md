# ContentZen SDK Usage Examples

## Public Endpoints (No Authentication)

```typescript
import { ContentZenClient } from 'contentzen-sdk';

const client = new ContentZenClient();

// Get all published documents from a public collection
const docs = await client.getPublicDocuments({ collectionUuid: 'your-collection-uuid' });

// Get a specific public document
const doc = await client.getPublicDocument({
  collectionUuid: 'your-collection-uuid',
  documentUuid: 'your-document-uuid',
});
```

## Authenticated Endpoints (API Token Required)

```typescript
import { ContentZenClient } from 'contentzen-sdk';

const client = new ContentZenClient({ apiToken: 'your_api_token_here' });

// Documents
const docs = await client.getDocuments({ collectionUuid: 'your-collection-uuid' });
const doc = await client.getDocument({ collectionUuid: 'your-collection-uuid', documentUuid: 'your-document-uuid' });
const newDoc = await client.createDocument({
  collectionUuid: 'your-collection-uuid',
  payload: { title: 'New Post', content: 'Hello world' },
  lang: 'en',
  state: 'draft',
});
await client.updateDocument({
  collectionUuid: 'your-collection-uuid',
  documentUuid: 'your-document-uuid',
  payload: { title: 'Updated Title' },
  state: 'published',
});
await client.deleteDocument({ collectionUuid: 'your-collection-uuid', documentUuid: 'your-document-uuid' });

// Collections
const collections = await client.getCollections();
const collection = await client.getCollection('your-collection-uuid');
const created = await client.createCollection({
  name: 'products',
  display_name: 'Products',
  fields: [
    { name: 'title', type: 'string', display_name: 'Title', required: true },
    { name: 'price', type: 'number', display_name: 'Price', required: true },
  ],
});
await client.updateCollection('your-collection-uuid', { display_name: 'Updated Products' });
await client.deleteCollection('your-collection-uuid');
const schema = await client.getCollectionSchema('your-collection-uuid');
const fields = await client.getCollectionFields('your-collection-uuid');
const fieldTypes = await client.getFieldTypes();

// Media
const mediaList = await client.listMedia();
// Upload: browser: pass File, Node: pass Buffer/Stream
// const uploaded = await client.uploadMedia(file);
const media = await client.getMediaFile('your-media-uuid');
await client.updateMedia('your-media-uuid', { alt_text: 'New alt text' });
await client.deleteMedia('your-media-uuid');
// Download: returns Blob (browser) or Buffer (Node.js)
// const fileData = await client.downloadMedia('your-media-uuid');

// Webhooks
const webhooks = await client.listWebhooks();
const webhook = await client.createWebhook({
  name: 'My Webhook',
  url: 'https://example.com/webhook',
  events: ['document.created', 'document.updated'],
  method: 'POST',
});
await client.updateWebhook('your-webhook-uuid', { name: 'Updated Webhook' });
await client.deleteWebhook('your-webhook-uuid');
```