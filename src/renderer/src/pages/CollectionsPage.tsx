/**
 * This code was generated by Builder.io.
 */
import React, { useState } from "react";
import { CollectionCard } from "../components/CollectionCard";
import { Channels } from '../../../shared/contants'
import { Collection } from "../../../shared/chroma-service";

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Array<Collection>>([]);

  async function loadCollections() {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTIONS)
    setCollections(result);
  }

  React.useEffect(() => {
    loadCollections()
  }, []);

  return (
    <>
      {
        collections.map((collection: Collection) => {
          return (
            <div className="row">
              <div className="column">
                <CollectionCard name={collection.name} itemCount={0} />
              </div>
            </div>
          )
        })
      }
    </>
  );
};
