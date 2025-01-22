import { isServer, isClient } from '../environment/Environment.js';
import serverWindow from '../server/serverWindow.js';
import jquery from 'jquery';

let $;

if (isServer()) {
  $ = jquery(serverWindow);
}

if (isClient()) {
  $ = jquery;
}

export default $;

