import { GAME_MODES } from '../config/gameModes.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.selectedIndex = 0;
    this.items = [];
  }

  create() {
    this.selectedIndex = 0;
    this.items = [];

    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x17375f).setDepth(-10);

    this.add
      .text(width / 2, 72, 'SZAMJATEK', {
        fontFamily: 'Arial Black',
        fontSize: 52,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 126, 'Valassz feladatot', {
        fontFamily: 'Arial',
        fontSize: 28,
        color: '#d4ecff',
      })
      .setOrigin(0.5);

    const startY = 220;
    const gap = 120;

    GAME_MODES.forEach((mode, index) => {
      const y = startY + gap * index;
      const panel = this.add
        .rectangle(width / 2, y, Math.min(920, width * 0.85), 90, 0x2b5f95, 1)
        .setStrokeStyle(3, 0x96c8ff)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => this.startMode(index));

      const title = this.add
        .text(width / 2, y - 16, mode.title, {
          fontFamily: 'Arial Black',
          fontSize: 34,
          color: '#fff5b4',
        })
        .setOrigin(0.5);

      const desc = this.add
        .text(width / 2, y + 16, mode.description, {
          fontFamily: 'Arial',
          fontSize: 22,
          color: '#deecff',
        })
        .setOrigin(0.5);

      this.items.push({ panel, title, desc });
    });

    this.add
      .text(width / 2, height - 36, 'Fel/Le + Enter vagy erintes', {
        fontFamily: 'Arial',
        fontSize: 22,
        color: '#d4ecff',
      })
      .setOrigin(0.5);

    if (this.input.keyboard) {
      this.input.keyboard.resetKeys();
      this.navKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        w: Phaser.Input.Keyboard.KeyCodes.W,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      });
    } else {
      this.navKeys = null;
    }

    this.updateSelectionVisuals();
  }

  update() {
    if (!this.navKeys) return;

    if (
      Phaser.Input.Keyboard.JustDown(this.navKeys.down) ||
      Phaser.Input.Keyboard.JustDown(this.navKeys.s)
    ) {
      this.selectedIndex = (this.selectedIndex + 1) % GAME_MODES.length;
      this.updateSelectionVisuals();
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.navKeys.up) ||
      Phaser.Input.Keyboard.JustDown(this.navKeys.w)
    ) {
      this.selectedIndex = (this.selectedIndex - 1 + GAME_MODES.length) % GAME_MODES.length;
      this.updateSelectionVisuals();
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.navKeys.enter) ||
      Phaser.Input.Keyboard.JustDown(this.navKeys.space)
    ) {
      this.startMode(this.selectedIndex);
    }
  }

  startMode(index) {
    const mode = GAME_MODES[index];
    this.scene.start(mode.sceneKey);
  }

  updateSelectionVisuals() {
    this.items.forEach((item, index) => {
      const selected = index === this.selectedIndex;
      item.panel.setFillStyle(selected ? 0x3f84c5 : 0x2b5f95, 1);
      item.panel.setStrokeStyle(3, selected ? 0xffec8c : 0x96c8ff);
      item.title.setScale(selected ? 1.03 : 1);
      item.desc.setAlpha(selected ? 1 : 0.9);
    });
  }
}
