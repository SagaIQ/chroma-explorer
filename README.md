# chroma-explorer

[![Continuous build](https://github.com/SagaIQ/chroma-explorer/actions/workflows/main.yml/badge.svg)](https://github.com/SagaIQ/chroma-explorer/actions/workflows/main.yml)

# To build and run the Chroma Explorer

Chroma Explorer is currently built using Node v22

```
npm install
npm run build
npm run start
```

# Running ChromaDB 
### NO AUTH
docker run \
  -p 8001:8000 \
  -v ./chromadb:/chroma/chroma \
  -e IS_PERSISTENT=TRUE \
  chromadb/chroma

### Basic Auth (Username/Password)
docker run --rm --entrypoint echo httpd:2 "change_this_password" | htpasswd -iBc server.htpasswd user1

docker run \
  -p 8001:8000 \
  -v ./chromadb:/chroma/chroma \
  -v ./server.htpasswd:/chroma/server.htpasswd \
  -e IS_PERSISTENT=TRUE \
  -e CHROMA_SERVER_AUTHN_CREDENTIALS_FILE=server.htpasswd \
  -e CHROMA_SERVER_AUTHN_PROVIDER=chromadb.auth.basic_authn.BasicAuthenticationServerProvider \
  chromadb/chroma

### Token Auth
docker run \
  -p 8001:8000 \
  -v ./chromadb:/chroma/chroma \
  -e IS_PERSISTENT=TRUE \
  -e CHROMA_SERVER_AUTHN_CREDENTIALS=<access token> \
  -e CHROMA_SERVER_AUTHN_PROVIDER=chromadb.auth.token_authn.TokenAuthenticationServerProvider \
  chromadb/chroma
