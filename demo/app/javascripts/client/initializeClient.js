import { App, version, onError } from '../../../../lib/brisket.js';
import '../routing/initializeRouters.js';

App.addClientInitializer(({ environmentConfig }) => {
  console.log(`My favorite town is ${environmentConfig.favoriteTown}`);
  console.log(`Client side initialized with Brisket version ${version}`);

  onError((error, clientRequest) => {
    console.error('Error: ', error.stack || error);
    console.error('request.referrer: ', clientRequest.referrer);
  });
});

App.start();
