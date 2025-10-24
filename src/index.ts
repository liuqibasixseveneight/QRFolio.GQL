import { ApolloServer } from 'apollo-server';
import chalk from 'chalk';

import { schema } from './graphql/schema';
import { SERVER_PORT, UI_PRODUCTION_URL } from './config';

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  cors: {
    origin: [
      UI_PRODUCTION_URL,
      'http://localhost:3000', // For local development
      'http://localhost:3001', // Alternative local port
      'http://localhost:5173', // Vite default port
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Apollo-Require-Preflight',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
  },
});

const port = SERVER_PORT;

server.listen({ port, host: '0.0.0.0' }).then(({ url }) => {
  console.log(
    `${chalk.bgGreen('<< ✔ >>')} ${chalk.green(
      'Server ready at:'
    )} ${chalk.green.underline(url)}`
  );
});
