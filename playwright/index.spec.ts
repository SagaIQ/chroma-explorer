import { test, expect, _electron, ElectronApplication } from '@playwright/test'
import { ChromaDBContainer, StartedChromaDBContainer } from '@testcontainers/chromadb'
import { ChromaClient } from 'chromadb';
import { randomUUID } from 'crypto';
import { unlinkSync, writeFileSync } from 'fs';
const bcrypt = require('bcrypt');

const CHROMA_IMAGE = 'chromadb/chroma:0.5.5'

test.describe('ChromaExplorer', () => {

  let container: StartedChromaDBContainer | undefined = undefined;
  let electronApp: ElectronApplication;

  const collection1 = randomUUID();
  const collection2 = randomUUID();

  test.beforeAll(async () => {
    container = await new ChromaDBContainer(CHROMA_IMAGE).start() 

    // create a new chromadb client connected to the container
    const chromaClient = new ChromaClient({
      path: container?.getHttpUrl()
    });

    // seed chromadb with two collections
    const collections = await Promise.all([
      chromaClient.createCollection({ name: collection1 }),
      chromaClient.createCollection({ name: collection2 })
    ]);

    // verify chromadb has two collections
    const collectionsCount = await chromaClient.countCollections();
    test.expect(collectionsCount).toBe(2);

    await collections[0].add({
      ids: ["1", "2", "3"],
      documents: ["apples", "oranges", "pineapples"],
      embeddings: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
    });

    await collections[1].add({
      ids: ["1", "2", "3"],
      documents: ["apples", "oranges", "pineapples"],
      embeddings: [
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90],
      ],
    });
  });

  test.afterAll(async () => {
    if (container) {
      await container.stop();
    }
  });

  test.beforeEach(async () => {
    electronApp = await _electron.launch({ args: ['.'] })
  });

  test.afterEach(async () => {
    if (electronApp) {
      await electronApp.close();
    }
  });

  test('Loads successfully', async () => {
    const window = await electronApp.firstWindow()

    const headerElement = await window.$('h1')
    const headerText = await headerElement?.textContent()
    expect(headerText).toBe("Chroma Explorer")
  });

  test('Page navigation works', async () => {
    const window = await electronApp.firstWindow();

    ////////////////////////
    // 1. CONNECTION PAGE //
    ////////////////////////

    // fill out the connection string and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    /////////////////////////
    // 2. COLLECTIONS PAGE //
    /////////////////////////

    // verify the connection string breadcrumb is visible
    await expect(window.getByLabel("connectionStringBreadcrumb")).toBeVisible();

    // verify the collections heading is visible
    await expect(window.getByRole("heading", { name: 'Collections (2)'})).toBeVisible();

    // verify we are now on the collections page
    await expect(window.getByLabel('filterInput')).toBeVisible();

    // verify the connection cards are visible
    await expect(window.getByText(`${collection1.substring(0, 24)}...`)).toBeVisible();
    await expect(window.getByText(`${collection2.substring(0, 24)}...`)).toBeVisible();

    // navigate to a specific collection
    await window.getByRole('button', { name: "Open" }).first().click();

    ////////////////////////
    // 3. COLLECTION PAGE //
    ////////////////////////

    // verify the connection string and collection name breadcrumbs are visible
    await expect(window.getByLabel("connectionStringBreadcrumb")).toBeVisible();
    await expect(window.getByLabel("collectionBreadcrumb")).toBeVisible();

    // verify the documents heading is visible
    await expect(window.getByRole("heading", { name: 'Documents (1)'})).toBeVisible();

    // verify the collection search input and button are visible
    await expect(window.getByLabel('searchCollectionInput')).toBeVisible();
    await expect(window.getByRole('button', { name: "Search" })).toBeVisible();

    // verify a document card is visisble
    await expect(window.getByText('<unknown>')).toBeVisible();
    await expect(window.getByText('3 Document Chunks')).toBeVisible();

    // navigate to a specific document
    await window.getByRole('button', { name: "Open" }).first().click();

    //////////////////////
    // 4. DOCUMENT PAGE //
    //////////////////////

    // verify the connection string, collection name, and document name breadcrumbs are visible
    await expect(window.getByLabel("connectionStringBreadcrumb")).toBeVisible();
    await expect(window.getByLabel("collectionBreadcrumb")).toBeVisible();
    await expect(window.getByLabel("documentBreadcrumb")).toBeVisible();

    // verify the document chunks heading is visible
    await expect(window.getByRole("heading", { name: 'Document Chunks (3)'})).toBeVisible();

    // verify document chunk content is visible
    await expect(window.getByText('apples', { exact: true })).toBeVisible();
    await expect(window.getByText('oranges', { exact: true })).toBeVisible();
    await expect(window.getByText('pineapples', { exact: true })).toBeVisible();

    await electronApp.close()
  });

  test('Disconnect button works', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection string and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    // verify the connection string breadcrumb is visible
    await expect(window.getByLabel("connectionStringBreadcrumb")).toBeVisible();

    // now click the disconnect button which takes us back to the Connection Page.
    await window.getByRole('button', { name: "Disconnect" }).click();

    // verify we are back on the Connection Page
    await expect(window.getByLabel("connectionStringInput")).toBeVisible();
  });

  test('Collections filter', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection string and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Collections (2)'})).toBeVisible();

    // verify the connection cards are visible
    await expect(window.getByText(`${collection1.substring(0, 24)}...`)).toBeVisible();
    await expect(window.getByText(`${collection2.substring(0, 24)}...`)).toBeVisible();

    // verify the collection filter is visible
    await expect(window.getByLabel("filterInput")).toBeVisible();

    // fill out the first few letters of a collection
    await window.getByLabel('filterInput').fill(collection1.substring(0, 3));

    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Collections (1)'})).toBeVisible();

    // now verify that the first collection is still visible but the second no longer is
    await expect(window.getByText(`${collection1.substring(0, 24)}...`)).toBeVisible();
    await expect(window.getByText(`${collection2.substring(0, 24)}...`)).toBeVisible({ visible: false});
  });

  test('Collection search', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection string and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    // navigate to the first collection
    await window.getByRole('button', { name: "Open" }).first().click();

    // search for apples in the collection
    await window.getByLabel('searchCollectionInput').fill('apples');
    await window.getByRole('button', { name: "Search" }).click();

    // verify the search results heading is visible with the correct count
    await expect(window.getByRole("heading", { name: `Found 'apples' 2 times across 1 documents in collection`})).toBeVisible();

    await expect(window.getByText('apples', { exact: true })).toBeVisible();

    // navigate to a specific document
    await window.getByRole('button', { name: "Open Document" }).first().click();

    // verify the document chunks heading is visible
    await expect(window.getByRole("heading", { name: 'Document Chunks (3)'})).toBeVisible();
  });

  test('Breadcrumb navigate from collection to collections', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection string and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    // navigate to a specific collection
    await window.getByRole('button', { name: "Open" }).first().click();

    // use the breadcrumb to navigate back to the collections page
    await window.getByLabel("connectionStringBreadcrumb").click(); 

    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Collections (2)'})).toBeVisible();
  });

  test('Breadcrumb naviagte from document to collection', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection string and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    // navigate to a specific collection
    await window.getByRole('button', { name: "Open" }).first().click();

    // navigate to a specific document
    await window.getByRole('button', { name: "Open" }).first().click();

    // use the breadcrumb to navigate back to the collection page
    await window.getByLabel("collectionBreadcrumb").click(); 


    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Documents (1)'})).toBeVisible();
  });

  test('Breadcrumb navigate from document to collections', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection string and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    // navigate to a specific collection
    await window.getByRole('button', { name: "Open" }).first().click();

    // navigate to a specific document
    await window.getByRole('button', { name: "Open" }).first().click();

    // use the breadcrumb to navigate back to the collections page
    await window.getByLabel("connectionStringBreadcrumb").click(); 

    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Collections (2)'})).toBeVisible();
  });
})

test.describe('ConnectionPage NO_AUTH', () => {
  let container: StartedChromaDBContainer | undefined = undefined;
  let electronApp: ElectronApplication;

  test.beforeAll(async () => {
    container = await new ChromaDBContainer(CHROMA_IMAGE).start();
    electronApp = await _electron.launch({ args: ['.'] });
  });

  test.afterAll(async () => {
    if (container) {
      await container.stop();
    }

    if (electronApp) {
      await electronApp.close();
    }
  });

  test('Connects Successfully', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection details and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByRole('button', { name: "Connect" }).click();

    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Collections (0)'})).toBeVisible();
  });
});

test.describe('ConnectionPage ACCESS_TOKEN', () => {
  const accessToken = randomUUID();
  let container: StartedChromaDBContainer | undefined = undefined;
  let electronApp: ElectronApplication;

  test.beforeAll(async () => {
    container = await new ChromaDBContainer(CHROMA_IMAGE)
      .withEnvironment({
        CHROMA_SERVER_AUTHN_CREDENTIALS: accessToken,
        CHROMA_SERVER_AUTHN_PROVIDER: 'chromadb.auth.token_authn.TokenAuthenticationServerProvider'
      })
      .start();

      electronApp = await _electron.launch({ args: ['.'] })
  });

  test.afterAll(async () => {
    if (container) {
      await container.stop();
    }

    if (electronApp) {
      await electronApp.close();
    }
  });

  test('Connects Successfully', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection details and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByLabel('authenticationSelect').selectOption('Access Token');
    await window.getByLabel('accessTokenInput').fill(accessToken);
    await window.getByRole('button', { name: "Connect" }).click();

    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Collections (0)'})).toBeVisible();
  });
});

test.describe('ConnectionPage USERNAME_PASSWORD', () => {
  const username = 'testuser'
  const password = randomUUID();
  const htpasswdFileLocation = `/tmp/${randomUUID()}.htpasswd`
  let container: StartedChromaDBContainer | undefined = undefined;
  let electronApp: ElectronApplication;

  test.beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 10);
    writeFileSync(htpasswdFileLocation, `${username}:${passwordHash}`);

    container = await new ChromaDBContainer(CHROMA_IMAGE)
      .withCopyFilesToContainer([{
        source: htpasswdFileLocation,
        target: '/chroma/server.htpasswd'
      }])
      .withEnvironment({
        CHROMA_SERVER_AUTHN_CREDENTIALS_FILE: `server.htpasswd`,
        CHROMA_SERVER_AUTHN_PROVIDER: 'chromadb.auth.basic_authn.BasicAuthenticationServerProvider'
      })
      .start();

      electronApp = await _electron.launch({ args: ['.'] })
  });

  test.afterAll(async () => {
    if (container) {
      await container.stop();
    }

    if (electronApp) {
      await electronApp.close();
    }

    try {
      unlinkSync(htpasswdFileLocation)
    } catch (err) {}
  });

  test('Connects Successfully', async () => {
    const window = await electronApp.firstWindow();

    // fill out the connection details and click the connect button
    await window.getByLabel('connectionStringInput').fill(container?.getHttpUrl()!);
    await window.getByLabel('authenticationSelect').selectOption('Username / Password');
    await window.getByLabel('usernameInput').fill(username);
    await window.getByLabel('passwordInput').fill(password);
    await window.getByRole('button', { name: "Connect" }).click();

    // verify the collections heading is visible with the correct count
    await expect(window.getByRole("heading", { name: 'Collections (0)'})).toBeVisible();
  });
});