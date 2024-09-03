import React, { useState } from "react";
import { Channels } from '../../../shared/contants'
import { Collection } from "../../../shared/chroma-service";
import { CollectionFilter } from "@renderer/components/CollectionFilter";
import { CollectionCard } from "@renderer/components/CollectionCard";

export const CollectionsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('');
  const [collections, setCollections] = useState<Array<Collection>>([]);
  const [filteredCollections, setFilteredCollections] = useState<Array<Collection>>([]);

  async function loadCollections() {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTIONS)
    setCollections(result);
    setFilteredCollections(result);
  }



  React.useEffect(() => {
    loadCollections()
  }, []);
  
  React.useEffect(() => {
    if (filter.length === 0) {
      setFilteredCollections(collections);
    } else {
      setFilteredCollections(collections.filter(c => c.name.startsWith(filter)));
    }
  }, [filter]);

  return (
    <>
    <div className="row">
        <div className="column">
          <CollectionFilter filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <div className="column">
        <div className="row">
          {
            filteredCollections.map((collection: Collection) => {
              return (
                <CollectionCard name={collection.name} itemCount={0} />
              )
            })
          }
        </div>
      </div>
    </>
  );
};
