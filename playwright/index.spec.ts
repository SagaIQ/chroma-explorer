const { test: pw_test, expect: pw_expect, _electron: electron } = require('@playwright/test')
import { ChromaDBContainer, StartedChromaDBContainer } from '@testcontainers/chromadb'
import { ChromaClient } from 'chromadb';
import { randomUUID } from 'crypto';

const CHROMA_IMAGE = 'chromadb/chroma:0.5.5'

pw_test.describe('ChromaExplorer', () => {

  let container: StartedChromaDBContainer | undefined = undefined;
  const collection1 = randomUUID();
  const collection2 = randomUUID();

  pw_test.beforeAll(async () => {
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
    pw_test.expect(collectionsCount).toBe(2);

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
      documents: ["shirts", "shoes", "shorts"],
      embeddings: [
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90],
      ],
    });
  });

  pw_test.afterAll(async () => {
    if (container) {
      await container.stop();
    }
  });

  pw_test.test('loads', async () => {
    const electronApp = await electron.launch({ args: ['.'] })

    const window = await electronApp.firstWindow()

    const headerElement = await window.$('h1')
    const headerText = await headerElement.textContent()
    pw_expect(headerText).toBe("Chroma Explorer")

    await electronApp.close()
  });

  pw_test.test('connects to NO_AUTH database', async () => {
    const electronApp = await electron.launch({ args: ['.'] })
    const window = await electronApp.firstWindow();

    // 1. CONNECTION PAGE

    // fill out the connection string and click the connect button
    await window.getByTestId('connectionStringInput').fill(container?.getHttpUrl());
    await window.getByTestId('connectButton').click();

    // 2. COLLECTIONS PAGE

    // verify the connection string breadcrumb is visible
    await pw_expect(window.getByText(container?.getHttpUrl())).toBeVisible();

    // verify we are now on the collections page
    await pw_expect(window.getByTestId('filterInput')).toBeVisible();

    // verify the connection cards are visible
    await pw_expect(window.getByText(`${collection1.substring(0, 24)}...`)).toBeVisible();
    await pw_expect(window.getByText(`${collection2.substring(0, 24)}...`)).toBeVisible();

    // 3. COLLECTION PAGE
    

    await electronApp.close()
  });
})