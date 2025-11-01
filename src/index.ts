import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import chalk from 'chalk';

import { schema } from './graphql/schema';
import { SERVER_PORT } from './config';

async function startServer() {
  const server = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(SERVER_PORT) },
    context: async ({ req }) => {
      // CORS headers are handled by the standalone server
      // Custom context can be added here if needed
      return {};
    },
  });

  console.log(
    `${chalk.bgGreen('<< ✔ >>')} ${chalk.green(
      'Server ready at:'
    )} ${chalk.green.underline(url)}`
  );
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
