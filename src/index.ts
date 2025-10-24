import { ApolloServer } from 'apollo-server';
import chalk from 'chalk';

import { schema } from './graphql/schema';
import { SERVER_PORT } from './config';

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  cors: {
    origin: true,
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
  introspection: true,
  context: ({ req }) => {
    return { req };
  },
});

const port = SERVER_PORT;

async function startServer() {
  try {
    const { url } = await server.listen({ port });
    console.log(
      `${chalk.bgGreen('<< ✔ >>')} ${chalk.green(
        'Server ready at:'
      )} ${chalk.green.underline(url)}`
    );
    console.log(
      `${chalk.bgBlue('<< ℹ >>')} ${chalk.blue(
        'GraphQL Playground available at:'
      )} ${chalk.blue.underline(url)}`
    );
  } catch (error) {
    console.error(
      `${chalk.bgRed('<< ✗ >>')} ${chalk.red('Failed to start server:')}`,
      error
    );
    process.exit(1);
  }
}

startServer();
