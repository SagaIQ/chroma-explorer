import { electronAPI } from "./main/preload";

declare global {
    interface Window {chromadb: typeof electronAPI}
}