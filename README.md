

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

### Rodando a aplicação

Clone o repositório localmente, usando `--recuse-submodules`, para garantir que o os repositórios do frontend e do backend sejam clonados corretamente. Em seguida, entre no diretório do respositório clonado:

```bash
git clone https://github.com/mateus-sartorio/corenotes --recurse-submodules
cd corenotes
```

Além disso, é necessário criar um aquivo de variáveis de ambiente (`.env`) no diretório raíz do backend para configurar as URLs de conexão com o banco de dados:

```bash
cd corenotes-backend
touch .env
```

No arquivo criado, crie as seguintes variáveis ambientes (`MONGODB_ENDPOINT` é utilizada pela aplicação em funcionamento normal e `MONGODB_MOCK_ENDPOINT` para testes unitários):

```
MONGODB_ENDPOINT="mongodb://mongo:27017/corelab"
MONGODB_MOCK_ENDPOINT="mongodb://mongo:27017/corelab_mock"
```

Caso prefira utilizar o MongoDB na nuvem, obtenha uma string de conexão em [MongoDB Atlas](https://www.mongodb.com/atlas/database), e use a string de conexão para inicializar as variáveis de ambiente, no formato mostrado abaixo:

```
MONGODB_ENDPOINT="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/corelab/?retryWrites=true&w=majority"
MONGODB_MOCK_ENDPOINT="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/corelab_mock/?retryWrites=true&w=majority"
```

Neste caso, recomenda-se também remover o serviço `mongo` em `docker-compose.yml` encontrado na pasta raíz do projeto, uma vez que o banco de dados não precisa mais ser executado localmente.


#### Rodando com Docker

Caso prefira rodar a aplicação com Docker, basta inicializar o Docker Engine, e rodar o seguinte comando na pasta raíz do projeto:

```bash
docker compose up
```

Caso tudo tenha ocorrido conforme o esperado, o frontend deve estar rodando em `localhost:3000` e o backend em `localhost:4000`.


#### Rodando nativamente

Caso prefira rodar a aplicação nativamente, na pasta raíz do backend, instale as dependências do Node.js e depois inicialize o servidor, com os seguintes comandos:

```bash
npm install
npm start
```

Já na pasta raíz do frontend, as dependências também devem ser instaladas antes de inicializar o servidor:

```bash
npm install
npm run dev
```

Caso queira gerar uma build de produção para o frontend, execute em sua pasta raíz:

```bash
npm run build
```

O servidor com a build de produção pode ser inicializado com:

```bash
npm start
```

> [!TIP]
> Ao instalar dependências do Node.js e inicializar os servidores nativamente, sempre certifique-se de estar usando a versão 16 do Node.js
> 
> Para verificar qual versão do Node.js está usando, execute `node --version`
> 
> Caso esteja usando `nvm`, pode-se selectionar a versão 16 do Node.js com o comando `nvm use 16`
> 
> Com o `nvm` é possível também instalar a versão 16 do Node.js, caso ainda não esteja instalada, com o comando `nvm install 16`

<br/>

## ⚠️ Limitatações

- O sistema ainda não possui um sistema de cadastro e login de usuários.


## 🐞 Bugs conhecidos

- A paleta de selecão de cores (ColorPicker) pode dar overflow na tela caso seja aberta no cartão de uma tarefa muito próxima à margem direita da tela.

<br/>

## ⚖️ Licença:

Este programa é um software livre: você pode redistribuí-lo e/ou modificá-lo sob os termos da Licença Pública Geral GNU, conforme publicada pela Free Software Foundation; seja a versão 3 da Licença, ou (a seu critério) qualquer versão posterior.

Este programa é distribuído na esperança de que seja útil, mas SEM QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIABILIDADE ou ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA. Consulte a Licença Pública Geral GNU para mais detalhes.

Você deveria ter recebido uma cópia da Licença Pública Geral GNU juntamente com este programa. Se não recebeu, consulte [www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Este programa é lançado sob a licença GNU GPL v3+.


## 🔧 Suporte:

Por favor reporte qualquer problema com a aplicação [github.com/mateus-sartorio/corenotes](https://github.com/mateus-sartorio/corenotes).