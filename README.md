# ContentZen JS/TS SDK

Official JavaScript and TypeScript SDK for interacting with ContentZen headless CMS.

- Supports both browser and Node.js environments
- Universal compatibility
- Public and authenticated API support

## Installation

```bash
npm install contentzen-sdk
```

## Usage Example

```typescript
import { ContentZenClient } from 'contentzen-sdk';

// For public endpoints (no authentication required)
const client = new ContentZenClient();
const docs = await client.getPublicDocuments({ collectionUuid: 'your-collection-uuid' });

// For authenticated endpoints
const authClient = new ContentZenClient({ apiToken: 'your_api_token_here' });
const collections = await authClient.getCollections();
```

## API Reference

See [public.json](./public.json) for the full API documentation. SDK methods map 1:1 to API endpoints.