import { ChromaClient, IncludeEnum } from "chromadb";
import path from "path";
import { AccessTokenConnectionOptions, ChromaService, Collection, ConnectionOptions, ConnectionStatus, ConnectionType, Document, DocumentChunk, DocumentMetadata, UsernamePasswordConnectionOptions } from "../shared/chroma-service";

export class ChromaDbService implements ChromaService {
  private chromaClient: ChromaClient | undefined;

  getAuthConfiguration(connectionOptions: ConnectionOptions): { provider: string; credentials: string} {
    if (connectionOptions.connectionType === ConnectionType.USERNAME_PASSWORD) {
      const credentials = (connectionOptions.credentials as UsernamePasswordConnectionOptions)
      return {
        provider: 'basic',
        credentials: `${credentials.username}:${credentials.password}`
      }
    } else if (connectionOptions.connectionType === ConnectionType.ACCESS_TOKEN) {
      return {
        provider: 'token',
        credentials: (connectionOptions.credentials as AccessTokenConnectionOptions).accessToken
      }
    } else {
      return undefined;
    }
  }

  async connect(connectionOptions: ConnectionOptions): Promise<ConnectionStatus> {
    this.chromaClient = new ChromaClient({
      path: connectionOptions.connectionString,
      auth: this.getAuthConfiguration(connectionOptions)
    });

    // verify the connection was successful and auth is configured
    try {
      await this.chromaClient.countCollections();
      return {
        connected: true
      }
    } catch (err) {
      console.error(err);
      return {
        connected: false,
        errorMessage: 'Could not connect to endpoint: ' + connectionOptions.connectionString
      }
    }
  }

  async disconnect(): Promise<ConnectionStatus> {
    this.chromaClient = undefined;

    return {
      connected: false
    }
  }

  async heartbeat(): Promise<boolean> {
    if (this.chromaClient === undefined) {
      return false;
    }

    const response = await this.chromaClient.heartbeat();
    return response > 0;
  }

  async listCollections(): Promise<Array<Collection>> {
    if (this.chromaClient === undefined) {
      return new Array<Collection>();
    }

    const collections = await this.chromaClient.listCollections();
    return collections.map<Collection>(c => ({ ...c }));
  }

  async getCollection(collectionName: string): Promise<Array<DocumentMetadata>> {
    if (this.chromaClient === undefined) {
      return []
    }

    const collection = await this.chromaClient.getCollection({ name: collectionName });

    //const documents = new Set<string>();
    const documents = new Map<string, number>();

    // do the following until no documents are left to get out of the collection
    let hasMore = true;
    let offset = 0;
    const limit = 1000;

    do {
      const collectionContents = await collection.get({
        limit,
        offset,
        include: [IncludeEnum.Metadatas]
      });

      collectionContents.metadatas.forEach(document => {
        const key = <string>document?.source ?? '<unknown>';
        const chunkCount = documents.get(key);

        if (chunkCount) {
          documents.set(key, chunkCount + 1);
        } else {
          documents.set(key, 1);
        }
      });

      offset = offset + limit;
      hasMore = collectionContents.metadatas.length !== 0;
    } while (hasMore)

    const output = new Array<DocumentMetadata>();
    documents.forEach((v, k) => output.push({
      path: k,
      name: path.basename(k),
      chunkCount: v
    }));
    
    return output;
  }

  async getDocument(collectionName: string, documentPath: string): Promise<Document | undefined> {
    if (this.chromaClient === undefined) {
      return undefined;
    }

    const collection = await this.chromaClient.getCollection({ 
      name: collectionName, 
    });

    const whereClause = documentPath === '<unknown>' ? undefined : {
      source: { '$eq': documentPath }
    };

    const result = await collection.get({
      where: whereClause
    });

    const chunks = new Array<DocumentChunk>();
    for (let i = 0; i < result.ids.length; i++) {
      chunks.push({
        id: result.ids[i],
        content: result.documents[i],
        metadata: result.metadatas[i]
      });
    }

    return {
      name: path.basename(documentPath),
      path: documentPath,
      chunks
    };
  }

  async searchCollection(collectionName: string, searchString: string): Promise<Array<Document>> {
    if (this.chromaClient === undefined) {
      return []
    }

    const collection = await this.chromaClient.getCollection({ 
      name: collectionName, 
    });

    const result = await collection.get({
      whereDocument: {
        $contains: searchString
      }
    });

    const docs = Array.from(Array(result.ids.length)).map((_, index) => {
      return {
        id: result.ids[index],
        documentPath: <string>result.metadatas[index]?.source ?? '<unknown>',
        content: <string>result.documents[index],
        metadata: result.metadatas[index],
      }
    });

    const docIndex = new Map<string, Array<DocumentChunk>>();
    for (const doc of docs) {
      if (!docIndex.has(doc.documentPath)) {
        docIndex.set(doc.documentPath, new Array<DocumentChunk>());
      }
  
      docIndex.get(doc.documentPath)?.push({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata
      });
    }

    const output = new Array<Document>();
    docIndex.forEach((v, k) => output.push({
      path: k,
      name: path.basename(k),
      chunks: v
    }));
    
    return output;
  }
}
