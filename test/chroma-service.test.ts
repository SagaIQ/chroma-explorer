import { ChromaDBContainer, StartedChromaDBContainer } from '@testcontainers/chromadb'
import { ChromaClient } from 'chromadb';
import { randomUUID } from 'crypto';
import { ChromaDbService } from '../src/main/chroma-service';
import { ConnectionType } from '../src/shared/chroma-service';
import { unlinkSync, writeFileSync } from 'fs';
import os from 'os';
import bcrypt from 'bcrypt';

jest.setTimeout(300000)

const CHROMA_IMAGE = 'chromadb/chroma:0.5.5'

describe('ChromaDbService', () => {
  let container: StartedChromaDBContainer | undefined = undefined;
  const collection1 = randomUUID();
  const collection2 = randomUUID();

  const chromaService: ChromaDbService = new ChromaDbService();

  beforeAll(async () => {
    // start the chromadb test container
    container = await new ChromaDBContainer(CHROMA_IMAGE).start()
    
    // create a new chromadb client connected to the container
    const chromaClient = new ChromaClient({
      path: container?.getHttpUrl()
    });

    // seed chromadb with two collections
    const collections = await Promise.all([
      chromaClient.createCollection({ name: collection1 }),
      chromaClient.createCollection({ name: collection2 })
    ]);

    // verify chromadb has two collections
    const collectionsCount = await chromaClient.countCollections();
    expect(collectionsCount).toBe(2);

    // seed the first collection with some sample data
    await collections[0].add({
      ids: ["1", "2", "3"],
      documents: ["apples", "oranges", "pineapples"],
      embeddings: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      metadatas: [
        { source :"/tmp/document.pdf" },
        { source :"/tmp/document.pdf" },
        { source :"/tmp/document.pdf" }
      ]
    });

    // verify the first collection was seeded correctly
    const collection1Result = await await collections[0].get({ ids: ["1", "2", "3"] });
    expect(collection1Result).toMatchInlineSnapshot(`
      {
        "data": null,
        "documents": [
          "apples",
          "oranges",
          "pineapples",
        ],
        "embeddings": null,
        "ids": [
          "1",
          "2",
          "3",
        ],
        "included": [
          "metadatas",
          "documents",
        ],
        "metadatas": [
          {
            "source": "/tmp/document.pdf",
          },
          {
            "source": "/tmp/document.pdf",
          },
          {
            "source": "/tmp/document.pdf",
          },
        ],
        "uris": null,
      }
    `);

    // seed the second collection with some sample data
    await collections[1].add({
      ids: ["1", "2", "3"],
      documents: ["shirts", "shoes", "shorts"],
      embeddings: [
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90],
      ]
    });

    // verify the second collection was seeded correctly
    const collection2Result = await await collections[1].get({ ids: ["1", "2", "3"] });
    expect(collection2Result).toMatchInlineSnapshot(`
      {
        "data": null,
        "documents": [
          "shirts",
          "shoes",
          "shorts",
        ],
        "embeddings": null,
        "ids": [
          "1",
          "2",
          "3",
        ],
        "included": [
          "metadatas",
          "documents",
        ],
        "metadatas": [
          null,
          null,
          null,
        ],
        "uris": null,
      }
    `);

    // verify that heartbeat returns false when chroma client is disconnected
    const heartbeatResponse = await chromaService.heartbeat();
    expect(heartbeatResponse).toBe(false);

    // pre-connect our chromadb service for subsequent tests
    const connectResponse = await chromaService.connect({
      connectionString: container.getHttpUrl(),
      connectionType: ConnectionType.NO_AUTH,
      credentials: {}
    });

    // verify the chromadb service is connected
    expect(connectResponse.connected).toBe(true);
  })

  afterAll(async () => {
    // disconnect from chromadb and verify connected status is false
    const disconnectResponse = await chromaService.disconnect();
    expect(disconnectResponse.connected).toBe(false);

    if (container) {
      await container.stop();
    }
  })

  it('heartbeat() returns true when connected', async () => {
    const heartbeatResponse = await chromaService.heartbeat();
    expect(heartbeatResponse).toBe(true);
  })

  it('listCollections() returns the correct array of collections', async () => {
    const listCollectionsResponse = await chromaService.listCollections();

    // verify there are two collections and they are the two collections we expect to exist
    expect(listCollectionsResponse.length).toBe(2);
    expect(listCollectionsResponse.find((c => c.name === collection1))).toBeDefined();
    expect(listCollectionsResponse.find((c => c.name === collection2))).toBeDefined();
  })

  it('getCollection(collection1) returns correct collection', async () => {
    const getCollectionResponse = await chromaService.getCollection(collection1);
    
    expect(getCollectionResponse[0].name).toBe('document.pdf');
    expect(getCollectionResponse[0].path).toBe('/tmp/document.pdf');
    expect(getCollectionResponse[0].chunkCount).toBe(3);
  })

  it('getCollection(collection2) returns correct collection', async () => {
    const getCollectionResponse = await chromaService.getCollection(collection2);
    
    expect(getCollectionResponse[0].name).toBe('<unknown>');
    expect(getCollectionResponse[0].path).toBe('<unknown>');
    expect(getCollectionResponse[0].chunkCount).toBe(3);
  })

  it('getDocument(collection1, <unknown>) returns correct document', async () => {
    const getDocumentResponse = await chromaService.getDocument(collection1, '<unknown>');
    
    expect(getDocumentResponse).toBeDefined();
    expect(getDocumentResponse.name).toBe('<unknown>');
    expect(getDocumentResponse.path).toBe('<unknown>');

    expect(getDocumentResponse.chunks.length).toBe(3);
    expect(getDocumentResponse.chunks.find(c => c.id === '1' && c.content === 'apples')).toBeDefined();
    expect(getDocumentResponse.chunks.find(c => c.id === '2' && c.content === 'oranges')).toBeDefined();
    expect(getDocumentResponse.chunks.find(c => c.id === '3' && c.content === 'pineapples')).toBeDefined();
  });

  it('getDocument(collection2, some-document) returns correct document', async () => {
    const getDocumentResponse = await chromaService.getDocument(collection2, 'some-document');
    
    expect(getDocumentResponse).toBeDefined();
  });

  it('getDocument(collection2, <unknown>) returns correct document', async () => {
    const getDocumentResponse = await chromaService.getDocument(collection2, '<unknown>');
    
    expect(getDocumentResponse).toBeDefined();
    expect(getDocumentResponse.name).toBe('<unknown>');
    expect(getDocumentResponse.path).toBe('<unknown>');

    expect(getDocumentResponse.chunks.length).toBe(3);
    expect(getDocumentResponse.chunks.find(c => c.id === '1' && c.content === 'shirts')).toBeDefined();
    expect(getDocumentResponse.chunks.find(c => c.id === '2' && c.content === 'shoes')).toBeDefined();
    expect(getDocumentResponse.chunks.find(c => c.id === '3' && c.content === 'shorts')).toBeDefined();
  });

  it('searchCollection(collection1, apples) returns correct document chunks', async () => {
    const searchResponse = await chromaService.searchCollection(collection1, 'apples');
    expect(searchResponse.length).toBe(1);
    expect(searchResponse[0].name).toBe('document.pdf')
    expect(searchResponse[0].path).toBe('/tmp/document.pdf')
  })

  it('searchCollection(collection2, shirts) returns correct document chunks', async () => {
    const searchResponse = await chromaService.searchCollection(collection2, 'shirts');
    expect(searchResponse.length).toBe(1);
    expect(searchResponse[0].name).toBe('<unknown>')
    expect(searchResponse[0].path).toBe('<unknown>')
  })
});

describe('Undefined ChromaClient', () => {
  const chromaService = new ChromaDbService();

  it('heartbeat() returns false', async () => {
    const response = await chromaService.heartbeat();
    expect(response).toBe(false);
  })

  it('listCollections() returns empty array', async () => {
    const response = await chromaService.listCollections();
    expect(response.length).toBe(0);
  })

  it('getCollection() returns empty array', async () => {
    const response = await chromaService.getCollection('collection-name');
    expect(response.length).toBe(0);
  })

  it('getDocument() returns undefined', async () => {
    const response = await chromaService.getDocument('collection-name', 'document-name');
    expect(response).toBeUndefined();
  })

  it('searchCollection() returns empty array', async () => {
    const response = await chromaService.searchCollection('collection-name', 'search-string');
    expect(response.length).toBe(0);
  })
});

describe('ChromaDbService_AccessToken_Authentication', () => {
  const accessToken = randomUUID();
  let container: StartedChromaDBContainer | undefined = undefined;

  beforeAll(async () => {
    container = await new ChromaDBContainer(CHROMA_IMAGE)
      .withEnvironment({
        CHROMA_SERVER_AUTHN_CREDENTIALS: accessToken,
        CHROMA_SERVER_AUTHN_PROVIDER: 'chromadb.auth.token_authn.TokenAuthenticationServerProvider'
      })
      .start();
  });

  afterAll(async () => {
    if (container) {
      await container.stop();
    }
  });

  it('client with no auth fails to listCollections()', async () => {
    const connectResponse = await new ChromaDbService().connect({
      connectionString: container?.getHttpUrl(),
      connectionType: ConnectionType.NO_AUTH,
      credentials: {}
    });
    expect (connectResponse.connected).toBe(false);
    expect (connectResponse.errorMessage).toBe(`Could not connect to endpoint: ${container?.getHttpUrl()}`);
  });

  it('client with auth calls listCollections() successfully', async () => {
    const connectResponse = await new ChromaDbService().connect({
      connectionString: container?.getHttpUrl(),
      connectionType: ConnectionType.ACCESS_TOKEN,
      credentials: {
        accessToken
      }
    });
    expect (connectResponse.connected).toBe(true);
    expect(connectResponse.errorMessage).toBeUndefined();
  });
});

describe('ChromaDbService_UsernamePassword_Authentication', () => {
  let container: StartedChromaDBContainer | undefined = undefined;
  const username = 'testuser'
  const password = randomUUID();
  const htpasswdFileLocation = `${os.tmpdir()}/${randomUUID()}.htpasswd`

  beforeAll(async () => {

    const passwordHash = await bcrypt.hash(password, 10);
    writeFileSync(htpasswdFileLocation, `${username}:${passwordHash}`);

    container = await new ChromaDBContainer(CHROMA_IMAGE)
      .withCopyFilesToContainer([{
        source: htpasswdFileLocation,
        target: '/chroma/server.htpasswd'
      }])
      .withEnvironment({
        CHROMA_SERVER_AUTHN_CREDENTIALS_FILE: `server.htpasswd`,
        CHROMA_SERVER_AUTHN_PROVIDER: 'chromadb.auth.basic_authn.BasicAuthenticationServerProvider'
      })
      .start();
  });

  afterAll(async () => {
    if (container) {
      await container.stop();
    }

    try {
      unlinkSync(htpasswdFileLocation)
    } catch (err) {
      console.log(`error cleaning up temp file ${htpasswdFileLocation}`);
    }
  });

  it('client with no auth fails to listCollections()', async () => {
    const connectResponse = await new ChromaDbService().connect({
      connectionString: container?.getHttpUrl(),
      connectionType: ConnectionType.NO_AUTH,
      credentials: {}
    });
    expect (connectResponse.connected).toBe(false);
    expect (connectResponse.errorMessage).toBe(`Could not connect to endpoint: ${container?.getHttpUrl()}`);
  });

  it('client with incorrect auth fails to listCollections()', async () => {
    const chromaClient = new ChromaClient({
      path: container?.getHttpUrl(),
      auth: {
        provider: 'basic',
        credentials: `${username}:${password}bad-characters`,
      },
    });

    try {
      await chromaClient.listCollections();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      expect(err.status).toBe(403);
    }
  });

  it('client with auth calls listCollections() successfully', async () => {
    const connectResponse = await new ChromaDbService().connect({
      connectionString: container?.getHttpUrl(),
      connectionType: ConnectionType.USERNAME_PASSWORD,
      credentials: {
        username,
        password
      }
    });
    expect (connectResponse.connected).toBe(true);
    expect(connectResponse.errorMessage).toBeUndefined();
  });
});