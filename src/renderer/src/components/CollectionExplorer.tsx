import React from "react";
import { useState } from "react";
import { Channels } from '../../../shared/contants'
import { Collection } from "../../../shared/chroma-service";

export const CollectionExplorer = ({ onSelectCollection }) => {
  const [collections, setCollections] = useState<Array<Collection>>([]);

  async function loadCollections() {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTIONS)
    setCollections(result);
  }

  React.useEffect(() => {
    loadCollections()
  }, []);

  return (
    <div style={{float: "left"}}>
      <h2>Collections ({collections.length})</h2> <br />
      <ul>
        {
          collections.map(collection => {
            return ( 
              <li key={collection.id} onClick={() => onSelectCollection(collection)}>
                <div style={{borderTop: "1px solid gray"}}>{collection.name}</div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}