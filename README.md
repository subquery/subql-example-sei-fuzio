# SubQuery - Starter Package for Sei

A custom example project with an event handler for Sei Network's Fuzio contract, indexing bets on BTC in Sei testnet atlantic-2. Read more about SubQuery support for Cosmos at https://academy.subquery.network/quickstart/quickstart_chains/cosmos.html.

A SubQuery package defines which data SubQuery will index from the blockchain, and how it will store it.

## Preparation

#### Environment and dependencies

- [Typescript](https://www.typescriptlang.org/) is required to compile project and define types.

- Both SubQuery CLI and generated Project have dependencies and require [Node](https://nodejs.org/en/).

- You will also need [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) or [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [Docker](https://docs.docker.com/engine/install/).

#### Install the SubQuery CLI and Project Dependencies

Install SubQuery CLI globally on your terminal by using NPM (we don't recommend using Yarn to install global dependencies):

```
npm install -g @subql/cli
```

Under the project directory, install the node dependencies by running the following command ([Learn more](https://academy.subquery.network/build/install.html#)):

```
yarn OR npm install
```

## Configure the Project Further

If you want to change your project you will need to work on the following files:

- The Manifest in `project.yaml` to **configure your project**
- The GraphQL Schema in `schema.graphql` to **define shape of the data**
- The Mapping functions in `src/mappings/` directory to **transform data coming from blockchain**

[Learn more](https://academy.subquery.network/build/introduction.html)

## Build the Project

#### 1. Generate Associated Typescript

We will generate the defined entity models with the following command:

```
yarn codegen OR npm run-script codegen
```

If you change any data in your `schema.graphql`, you should run this command again. You should also consider deleting your local database in the `.data/` directory.

#### 2. Build the project

This builds your project into static files within the `/dist` for running.

```
yarn build OR npm run-script codegen
```

If you change any data in your `src/mappings/` directory you should run this command again.

## Indexing and Query

#### 1. Run Docker

Under the project directory run following command:

```
yarn start:docker
```

This will download packages from Docker, create a new Postgres database, and start an indexing an query service. When you first run this, it may take some time to start, please be patient.

#### 2. Query this Project

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that ready to query. On the right hand side is a documentation button that shows you what models you have to construct queries.

With this project can try to query with the following code to get a taste of how it works.

```graphql
query {
    bets (first: 5) {
    	nodes {
        id
        blockHeight
        timestamp
        betType
        }
    }
  	dailyAggregations (first:1){
    nodes{
      id
      bullBets
      bearBets
      bullBetSize
      bearBetSize
      totalSize
      
    }
  }
}
```

```json
{
  "data": {
    "bets": {
      "nodes": [
        {
          "id": "534AC45D3118D9C4F23F34FFBFD22840DBD00346F70FC580E883931D82461394",
          "blockHeight": "25372449",
          "timestamp": "2023-08-02T13:33:42.166",
          "betType": "bear"
        },
        {
          "id": "994998FD2B1CC3013FD0724D4AA007850D2120212B8819B23FC0B5BBAE0926D0",
          "blockHeight": "25376231",
          "timestamp": "2023-08-02T13:59:34.683",
          "betType": "bear"
        },
        {
          "id": "66540B5E632141BE91F8590FE61A93DDFCD91D2C95C23B3EEEC7651B74B31970",
          "blockHeight": "25384804",
          "timestamp": "2023-08-02T14:57:58.041",
          "betType": "bull"
        },
        {
          "id": "2AE7DEFCFE589DA223A25F9AE2696357187DD42FB90AE90644F6B15319DC2446",
          "blockHeight": "25382893",
          "timestamp": "2023-08-02T14:44:57.213",
          "betType": "bear"
        },
        {
          "id": "96228F141CF2038AFBF432F256BE493E276B9E29015D30876DAB9200C3730719",
          "blockHeight": "25382749",
          "timestamp": "2023-08-02T14:44:01.023",
          "betType": "bear"
        }
      ]
    },
    "dailyAggregations": {
      "nodes": [
        {
          "id": "2023-08-02",
          "bullBets": "75",
          "bearBets": "56",
          "bullBetSize": "143000000",
          "bearBetSize": "429964235",
          "totalSize": "572964235"
        }
      ]
    }
  }
}
```

## Useful Resources

- [SubQuery Documentation](https://academy.subquery.network/)
- [Tips and Tricks for Performance Improvements](https://academy.subquery.network/faqs/faqs.html#how-can-i-optimise-my-project-to-speed-it-up)
- [Automated Historical State tracking](https://academy.subquery.network/th/run_publish/historical.html)
- [GraphQL Subscriptions](https://academy.subquery.network/run_publish/subscription.html)
- [Discord with Technical Support Channel](https://discord.com/invite/subquery)
