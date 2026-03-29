import { drawNumberVisual } from '../ui/diceVisual.js';

export class CountingScene extends Phaser.Scene {
  constructor() {
    super('CountingScene');
    this.count = 1;
    this.options = [];
    this.feedbackTimer = null;
    this.optionButtons = [];
    this.shapeGraphics = [];
    this.visualParts = [];
  }

  create() {
    this.count = 1;
    this.options = [];
    this.feedbackTimer = null;
    this.optionButtons = [];
    this.shapeGraphics = [];
    this.visualParts = [];

    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x4a1d70);

    this.add
      .text(width / 2, 52, 'Szamold meg a koroket!', {
        fontFamily: 'Arial Black',
        fontSize: 42,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.feedbackText = this.add
      .text(width / 2, height - 70, '', {
        fontFamily: 'Arial Black',
        fontSize: 40,
        color: '#fff2a1',
      })
      .setOrigin(0.5);

    this.createBackButton();
    this.createOptionButtons();
    this.createRound();

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.feedbackTimer) {
        this.feedbackTimer.remove(false);
        this.feedbackTimer = null;
      }
    });
  }

  createBackButton() {
    const btn = this.add
      .rectangle(100, 46, 160, 56, 0x264f79, 1)
      .setStrokeStyle(2, 0xa8d8ff)
      .setDepth(1000);

    this.add
      .text(btn.x, btn.y, 'Vissza', {
        fontFamily: 'Arial Black',
        fontSize: 26,
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(1001);

    this.add
      .zone(btn.x, btn.y, 180, 64)
      .setOrigin(0.5)
      .setDepth(1002)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.goToMenu());
  }

  createOptionButtons() {
    const { width, height } = this.scale;
    const y = height - 170;
    const spacing = Math.min(250, width * 0.22);
    const startX = width / 2 - spacing;

    for (let i = 0; i < 3; i += 1) {
      const x = startX + i * spacing;
      const button = this.add
        .rectangle(x, y, 170, 140, 0x7f35b2, 1)
        .setStrokeStyle(3, 0xe4c9ff)
        .setInteractive({ useHandCursor: true });

      button.on('pointerup', () => this.checkAnswer(i));
      this.optionButtons.push({ button, x, y });
    }
  }

  createRound() {
    this.feedbackText.setText('');

    this.count = Phaser.Math.Between(1, 10);
    this.options = [this.count];

    while (this.options.length < 3) {
      const n = Phaser.Math.Between(1, 12);
      if (!this.options.includes(n)) this.options.push(n);
    }

    Phaser.Utils.Array.Shuffle(this.options);

    this.shapeGraphics.forEach((g) => g.destroy());
    this.shapeGraphics = [];

    for (let i = 0; i < this.count; i += 1) {
      const x = Phaser.Math.Between(110, this.scale.width - 110);
      const y = Phaser.Math.Between(120, 380);
      const circle = this.add.circle(x, y, 22, 0xffd04f).setStrokeStyle(4, 0x3d2a12);
      this.shapeGraphics.push(circle);
    }

    this.visualParts.forEach((part) => part.destroy());
    this.visualParts = [];

    this.optionButtons.forEach((entry, i) => {
      entry.button.setFillStyle(0x7f35b2, 1);
      entry.button.setStrokeStyle(3, 0xe4c9ff);

      const parts = drawNumberVisual(this, entry.x, entry.y - 20, this.options[i], 58);
      const label = this.add
        .text(entry.x, entry.y + 48, String(this.options[i]), {
          fontFamily: 'Arial Black',
          fontSize: 26,
          color: '#f6ebff',
        })
        .setOrigin(0.5);

      this.visualParts.push(...parts, label);
    });
  }

  checkAnswer(index) {
    if (this.feedbackTimer) return;

    const selected = this.options[index];
    const correct = selected === this.count;

    if (correct) {
      this.feedbackText.setText('SZUPER!');
      this.optionButtons[index].button.setFillStyle(0x52aa58, 1);

      this.feedbackTimer = this.time.delayedCall(900, () => {
        this.feedbackTimer = null;
        this.createRound();
      });
      return;
    }

    this.feedbackText.setText('NEM EZ, PROBALD UJRA');
    this.optionButtons[index].button.setFillStyle(0xb44747, 1);

    this.feedbackTimer = this.time.delayedCall(700, () => {
      this.feedbackTimer = null;
      this.feedbackText.setText('');
      this.optionButtons[index].button.setFillStyle(0x7f35b2, 1);
      this.optionButtons[index].button.setStrokeStyle(3, 0xe4c9ff);
    });
  }

  update() {
    if (!this.cursors || !this.enterKey || this.feedbackTimer) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.goToMenu();
    }
  }

  goToMenu() {
    if (this.feedbackTimer) {
      this.feedbackTimer.remove(false);
      this.feedbackTimer = null;
    }
    this.scene.start('MenuScene');
  }
}
