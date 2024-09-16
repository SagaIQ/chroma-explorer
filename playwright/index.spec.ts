const { test: pw_test, expect: pw_expect, _electron: electron } = require('@playwright/test')

pw_test.describe('ChromaExplorer', () => {
  pw_test.test('works', async () => {
    const electronApp = await electron.launch({ args: ['.'] })

    const window = await electronApp.firstWindow()

    const headerElement = await window.$('h1')
    const headerText = await headerElement.textContent()
    pw_expect(headerText).toBe("Chroma Explorer")

    await electronApp.close()
  });
})

// test('an h1 contains hello world"', async () => {
  //const electronApp = await electron.launch({ args: ['.'] })

  // Wait for the first BrowserWindow to open
  //const window = await electronApp.firstWindow()
  //console.log(window);

  // Check for the presence of an h1 element with the text "hello"
  //const headerElement = await window.$('h1')
  //fconsole.log(headerElement);
  // const headerText = await headerElement.textContent()
  // expect(headerText).toBe("Chroma Explorer")

  // Close the app
  //await electronApp.close()
// })