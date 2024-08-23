<p align="center">
  <img src="./assets/icon.png" alt="Chroma Explorer Logo" />
</p>

# Chroma Explorer by [SagaIQ](https://sagaiq.ai)
A simple, intuitive desktop application for Mac, Windows, and Linux, providing a user-friendly interface to explore the contents of your ChromaDB databases.

[![Continuous build](https://github.com/SagaIQ/chroma-explorer/actions/workflows/main.yml/badge.svg)](https://github.com/SagaIQ/chroma-explorer/actions/workflows/main.yml)


## Features

- **Connect to various database instances:**
  - No Auth
  - Username/Password
  - Access Token
- **Explore databases:**
  - View collections in a database
  - View documents within a collection
  - View document chunks within a document
- **Search functionality:**
  - Search for content across a collection

## Technologies Used

- **Electron** for the desktop environment
- **React** for building the user interface

## Installation

Chroma Explorer is currently built using node v22. To build and run Chroma Explorer locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/SagaIQ/chroma-explorer.git
    cd chroma-explorer
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run Chroma Explorer:
    ```
    npm run start
    ```

## Contributing

Pull requests are welcome! For significant changes, please open an issue first to discuss what you would like to change.

- Fork the repository
- Create your feature branch: `git checkout -b feature/my-new-feature`
- Commit your changes: `git commit -m 'Add some feature'`
- Push to the branch: `git push origin feature/my-new-feature`
- Open a pull request

## License

This project is licensed under the Apache 2.0 License. See the LICENSE file for details.
