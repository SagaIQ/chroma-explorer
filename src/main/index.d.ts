import { electronAPI } from './preload'

declare global {
    interface Window {chromadb: typeof electronAPI}
}