

<p align="center"><img align="center" width="280" src="./.github/logo-light.svg#gh-light-mode-only"/></p>
<p align="center">
  <img src="https://skillicons.dev/icons?i=typescript,docker,nodejs" /> <br/>
  <a href="https://github.com/mateus-sartorio/corenotes"><kbd>🔵 GitHub</kbd></a>
</p>

# 🗒️ Certification Hub Backend


The backend of this application is responsible for managing interactions with the blockchain and the Cartesi Machine, implementing a Decentralized Public Key Infrastructure (DPKI). It was developed using the  TypeScript programming language and is designed to work in conjunction with a blockchain based on the Ethereum Virtual Machine (EVM).

<br/>

## ⚙️ Set up and run locally

### Requirements:

- Node.js 16 
- Docker
- Cartesi


```bash
node --version
```


If your Node.js version is not 16, it is recommended to use nvm, which allows you to install and manage multiple versions of Node.js on your machine  [Repository with installation instructions](https://github.com/nvm-sh/nvm)).

For Docker, installation instructions for each operating system can be found in its [official documentation](https://docs.docker.com/engine/install/).

For Cartesi, you can find installation instructions in its [official documentation](https://docs.cartesi.io/cartesi-rollups/1.3/development/installation/).

### Running the Application

To run the application, follow these steps:

1. **Build the Application**: Use the following command to build the application:
   ```bash
   cartesi build
```bash
2. **Run the Application**: Use the following command to run the application:
   ```bash
   cartesi run
```bash