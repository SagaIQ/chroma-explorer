import React, { useState } from "react";
import { Channels } from '../../../shared/contants'
import { Collection } from "../../../shared/chroma-service";
import { CollectionFilter } from "@renderer/components/CollectionFilter";
import { CollectionCard } from "@renderer/components/CollectionCard";

export const CollectionsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('');

  const [collections, setCollections] = useState<Array<Collection>>([
    { id: "id1", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
    { id: "id2", name: "smol" },
    { id: "id3", name: "little big bigger" },
    { id: "id4", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
    { id: "id5", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
    { id: "id6", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
    { id: "id7", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
    { id: "id8", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
    { id: "id9", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
  ]);
  const [filteredCollections, setFilteredCollections] = useState<Array<Collection>>([]);

  async function loadCollections() {
    await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTIONS)
    setCollections([{ id: "id1", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
      { id: "id2", name: "smol" },
      { id: "id3", name: "little big bigger" },
      { id: "id4", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
      { id: "id5", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
      { id: "id6", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
      { id: "id7", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
      { id: "id8", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },
      { id: "id9", name: "aakskdkkdk-skskdjsjkss-akakakakaakakks" },])
    // /setCollections(result);
    setFilteredCollections(collections);
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
                <CollectionCard  name={collection.name} itemCount={0} />
              )
            })
          }
        </div>
      </div>
    </>
  );
};
