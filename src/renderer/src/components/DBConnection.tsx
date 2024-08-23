import { useState } from "react";

export const DBConnection = ({ onConnect }) => {
  const [dbEndpoint, setDbEndpoint] = useState<string | undefined>('http://localhost:8001');

  const handleChange = (event) => {
    setDbEndpoint(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    onConnect(dbEndpoint);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={dbEndpoint} onChange={handleChange} />
      <button type="submit">Connect</button>
    </form>
  )
}