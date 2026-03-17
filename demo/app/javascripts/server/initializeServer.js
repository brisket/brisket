import { App, version } from '../../../../lib/brisket.js';
import '../routing/initializeRouters.js';

App.addServerInitializer(({ environmentConfig, serverConfig }) => {
  // do server-only app set up here
  console.log(`My favorite town is ${environmentConfig.favoriteTown}`);
  console.log(`My favorite server is ${serverConfig.favoriteServer}`);
  console.log(`Server side initialized with Brisket version ${version}`);
});
