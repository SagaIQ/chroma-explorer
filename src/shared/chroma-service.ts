export interface Collection {
  readonly id: string;
  readonly name: string;
}

export interface Document {
  readonly name: string;
  readonly path: string;
  readonly chunks: Array<DocumentChunk>
}

export interface DocumentChunk {
  readonly id: string;
  readonly content: string;
  readonly metadata: any;
}

export interface ConnectionStatus {
  readonly connected: boolean;
  readonly errorMessage?: string;
}

export enum ConnectionType {
  NO_AUTH = 'NO_AUTH',
  USERNAME_PASSWORD = 'USERNAME_PASSWORD',
  ACCESS_TOKEN = 'ACCESS_TOKEN'
}

export interface NoAuthConnectionOptions {

}

export interface UsernamePasswordConnectionOptions {
  readonly username: string;
  readonly password: string;
}

export interface AccessTokenConnectionOptions {
  readonly accessToken: string;
}

export interface ConnectionOptions {
  readonly connectionString: string;
  readonly connectionType: ConnectionType;
  readonly connectionOptions: NoAuthConnectionOptions | UsernamePasswordConnectionOptions | AccessTokenConnectionOptions;
}

export interface ChromaService {
  connect(connectionOptions: ConnectionOptions): Promise<ConnectionStatus>;
  disconnect(): Promise<ConnectionStatus>;
  heartbeat(): Promise<boolean>;
  listCollections(): Promise<Array<Collection>>
  getDocumentsForCollection(collectionName: string): Promise<Array<string>>;
  getDocument(collectionName: string, documentName: string): Promise<Document | undefined>;
  searchCollection(collectionName: string, searchString: string): Promise<Array<Document>>;
}