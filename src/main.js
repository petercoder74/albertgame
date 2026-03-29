import { MenuScene } from './scenes/MenuScene.js';
import { NumberMatchScene } from './scenes/NumberMatchScene.js';
import { CountingScene } from './scenes/CountingScene.js';

const config = {
  type: Phaser.AUTO,
  title: 'Albert Szamjatek',
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#17375f',
  scene: [MenuScene, NumberMatchScene, CountingScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 3,
    smoothFactor: 0.15,
  },
};

new Phaser.Game(config);
