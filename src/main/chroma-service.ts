import { ChromaClient, IncludeEnum } from "chromadb";
import { ipcMain } from "electron";
import path from "path";
import { Channels } from "../shared/contants"
import { ChromaService, Collection, ConnectionOptions, ConnectionStatus, ConnectionType, Document, DocumentChunk } from "../shared/chroma-service";

export class ChromaDbService implements ChromaService {
  private chromaClient: ChromaClient | undefined;

  async connect(connectionOptions: ConnectionOptions): Promise<ConnectionStatus> {
    switch (connectionOptions.connectionType) {
      case ConnectionType.NO_AUTH: {
        this.chromaClient = new ChromaClient({
          path: connectionOptions.connectionString
        });
        break;
      }
      case ConnectionType.USERNAME_PASSWORD: {
        break;
      }
      case ConnectionType.ACCESS_TOKEN: {
        break;
      }
      default:
        throw new Error(`Cannot call connect() method due to unknown ConnectionType: ${connectionOptions.connectionType}`);
    }

    // verify the connection was successful
    try {
      const connected = await this.heartbeat();
      return {
        connected
      };
    } catch (err) {
      console.error(err);
      return {
        connected: false,
        errorMessage: 'Could not connect to endpoint: ' + connectionOptions.connectionString // todo get a better error message up to the user based on the actual error message
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
      console.log(`in heartbeat(), chromaClient is undefined, returning false`)
      return false;
    }

    try {
      await this.chromaClient.heartbeat();
      return true;
    } catch (err) {
      console.log(`heartbeat failed ${err}`)
      return false;
    }
  }

  async listCollections(): Promise<Array<Collection>> {
    if (this.chromaClient === undefined) {
      return new Array<Collection>;
    }

    const collections = await this.chromaClient.listCollections();
    return collections.map<Collection>(c => ({ ...c }));
  }

  async getDocumentsForCollection(collectionName: string): Promise<Array<string>> {
    if (this.chromaClient === undefined) {
      return []
    }

    const collection = await this.chromaClient.getCollection({ name: collectionName });

    const documents = new Set<string>();

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

      collectionContents.metadatas.forEach(document => documents.add(<string>document?.source));
      offset = offset + limit;
      hasMore = collectionContents.metadatas.length !== 0;
    } while (hasMore)

    return Array.from(documents);
  }

  async getDocument(collectionName: string, documentName: string): Promise<Document | undefined> {
    if (this.chromaClient === undefined) {
      return undefined;
    }

    const collection = await this.chromaClient.getCollection({ 
      name: collectionName, 
    });

    const result = await collection.get({
      where: {
        source: { '$eq': documentName }
      }
    });

    const chunks = new Array<DocumentChunk>;
    for (let i = 0; i < result.ids.length; i++) {
      chunks.push({
        id: result.ids[i],
        content: result.documents[i] ?? '',
        metadata: result.metadatas[i]
      });
    }

    return {
      name: path.basename(documentName),
      path: documentName,
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
        documentPath: <string>result.metadatas[index]?.source,
        content: <string>result.documents[index],
        metadata: result.metadatas[index],
      }
    });

    const docIndex = new Map<string, Array<DocumentChunk>>();
    for (const doc of docs) {
      if (!docIndex.has(doc.documentPath)) {
        docIndex.set(doc.documentPath, new Array<DocumentChunk>);
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
  

export const setup = () => {
  const chromaService = new ChromaDbService();

  ipcMain.handle(Channels.CONNECT, async (_, connectionOptions: ConnectionOptions) => {
    // add logger with logger.debug here would be nice
    // console.log(`ipc CONNECT - ${JSON.stringify(connectionOptions)}`);
    return chromaService.connect(connectionOptions);
  });

  ipcMain.handle(Channels.DISCONNECT, async () => {
    return chromaService.disconnect();
  });

  ipcMain.handle(Channels.HEARTBEAT, async () => {
    return chromaService.heartbeat();
  });

  ipcMain.handle(Channels.GET_COLLECTIONS, async () => {
    return chromaService.listCollections();
  });

  ipcMain.handle(Channels.GET_DOCUMENTS_FOR_COLLECTION, async (_, collectionName: string) => {
    return chromaService.getDocumentsForCollection(collectionName);
  }); 

  ipcMain.handle(Channels.GET_DOCUMENT, async (_, collectionName: string, documentName: string) => {
    return chromaService.getDocument(collectionName, documentName);
  }); 

  ipcMain.handle(Channels.SEARCH_COLLECTION_FOR_CONTENT, async (_, collectionName: string, searchString: string) => {
    return chromaService.searchCollection(collectionName, searchString);
  }); 
}