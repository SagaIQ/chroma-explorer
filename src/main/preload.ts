import { ConnectionOptions } from "../shared/chroma-service";
import { Channels } from "../shared/contants"

import { contextBridge, ipcRenderer } from 'electron'

export const electronAPI = {
  heartbeat: () => ipcRenderer.invoke(Channels.HEARTBEAT),
  connect: (connectionOptions: ConnectionOptions) => ipcRenderer.invoke(Channels.CONNECT, connectionOptions),
  disconnect: () => ipcRenderer.invoke(Channels.DISCONNECT),
  loadCollections: () => ipcRenderer.invoke(Channels.GET_COLLECTIONS),
  loadCollection: (collectionName: string) => ipcRenderer.invoke(Channels.GET_COLLECTION, collectionName),
  searchCollection: (collectionName: string, searchString: string) => ipcRenderer.invoke(Channels.SEARCH_COLLECTION, collectionName, searchString),
  getDocument: (collectionName: string, documentName: string) => ipcRenderer.invoke(Channels.GET_DOCUMENT, collectionName, documentName)
};

contextBridge.exposeInMainWorld(
  'chromadb', electronAPI
);
