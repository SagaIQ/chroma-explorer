import React, { useState } from "react";
import { Channels } from '../../../shared/contants'
import { Collection } from "../../../shared/chroma-service";
import { Filter } from "@renderer/components/Filter";
import { CollectionCard } from "@renderer/components/CollectionCard";

type CollectionsPageProps = {
  openCollectionHandler(collectionName: string): void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = (props: CollectionsPageProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');
  const [collections, setCollections] = useState<Array<Collection>>([]);
  const [filteredCollections, setFilteredCollections] = useState<Array<Collection>>([]);

  async function loadCollections() {
    setLoading(true);
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTIONS)
    setCollections(result);
    setFilteredCollections(result);
    setLoading(false);
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
      {loading ? <div className="loading" /> :
        <>
          <div className="row">
            <div className="column">
              <Filter filter={filter} setFilter={setFilter} filterName={"Collection"} />
            </div>
          </div>
          <div className="column">
            <div className="row">
              {
                filteredCollections.map((collection: Collection) => {
                  return (
                    <CollectionCard name={collection.name} openCollectionHandler={props.openCollectionHandler} />
                  )
                })
              }
            </div>
          </div>
        </>
      }
    </>
  );
};
