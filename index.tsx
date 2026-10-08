import { defineMiniApp } from '@exercise/mini-app-sdk';

import pkg from './package.json';
import { StretchReminderApp } from './src/App';

export default defineMiniApp({
  id: 'stretch-reminder',
  name: 'Giãn cơ',
  emoji: '🧘',
  color: '#5856D6',
  version: pkg.version,
  component: StretchReminderApp,
});
