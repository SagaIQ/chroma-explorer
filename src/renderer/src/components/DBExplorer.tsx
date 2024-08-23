import { useState } from "react";
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { CollectionExplorer } from "./CollectionExplorer";
import { DocumentExplorer } from "./DocumentExplorer";
import { Collection } from "../../../shared/chroma-service";

export const DBExplorer = ({ onDisconnect }) => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | undefined>(undefined);

  const handleCollectionChanged = async (collection) => {
    setSelectedCollection(collection);
  }

  return (
    <>
      <button onClick={onDisconnect}>Disconnect</button><br/>
        <Splitter direction={SplitDirection.Horizontal} initialSizes={[30, 70]}>
          <CollectionExplorer onSelectCollection={handleCollectionChanged} />
          <DocumentExplorer selectedCollection={selectedCollection} />
        </Splitter>
    </>
  )
}