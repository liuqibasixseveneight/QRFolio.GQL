import { ApolloServer } from 'apollo-server';
import chalk from 'chalk';

import { schema } from './graphql/schema';
import { SERVER_PORT } from './config';

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  cors: {
    origin: '*',
    credentials: true,
  },
});

const port = SERVER_PORT;

server.listen({ port }).then(({ url }) => {
  console.log(
    `${chalk.bgGreen('<< ✔ >>')} ${chalk.green(
      'Server ready at:'
    )} ${chalk.green.underline(url)}`
  );
});
