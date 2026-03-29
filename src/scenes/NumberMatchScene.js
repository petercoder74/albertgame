import { drawNumberVisual } from '../ui/diceVisual.js';

export class NumberMatchScene extends Phaser.Scene {
  constructor() {
    super('NumberMatchScene');
    this.target = 1;
    this.options = [];
    this.feedbackTimer = null;
    this.optionButtons = [];
    this.visualParts = [];
  }

  create() {
    this.target = 1;
    this.options = [];
    this.feedbackTimer = null;
    this.optionButtons = [];
    this.visualParts = [];
    this.selectedIndex = 0;

    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x1f5f2b);

    this.add
      .text(width / 2, 52, 'Talald meg a megfelelo szamot!', {
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
    const y = height - 190;
    const spacing = Math.min(250, width * 0.22);
    const startX = width / 2 - spacing;

    for (let i = 0; i < 3; i += 1) {
      const x = startX + i * spacing;
      const button = this.add
        .rectangle(x, y, 170, 105, 0x2e7d32, 1)
        .setStrokeStyle(3, 0xa8f8af)
        .setInteractive({ useHandCursor: true });

      const label = this.add
        .text(x, y, '', {
          fontFamily: 'Arial Black',
          fontSize: 52,
          color: '#ffffff',
        })
        .setOrigin(0.5);

      button.on('pointerup', () => this.checkAnswer(i));
      this.optionButtons.push({ button, label });
    }
  }

  createRound() {
    this.feedbackText.setText('');

    this.target = Phaser.Math.Between(1, 12);
    this.options = [this.target];

    while (this.options.length < 3) {
      const n = Phaser.Math.Between(1, 12);
      if (!this.options.includes(n)) this.options.push(n);
    }

    Phaser.Utils.Array.Shuffle(this.options);

    this.optionButtons.forEach((entry, i) => {
      entry.label.setText(String(this.options[i]));
      entry.button.setFillStyle(0x2e7d32, 1);
      entry.button.setStrokeStyle(3, 0xa8f8af);
    });

    this.visualParts.forEach((part) => part.destroy());
    this.visualParts = drawNumberVisual(this, this.scale.width / 2, 260, this.target, 130);
  }

  checkAnswer(index) {
    if (this.feedbackTimer) return;

    const selected = this.options[index];
    const correct = selected === this.target;

    if (correct) {
      this.feedbackText.setText('UGYES!');
      this.optionButtons[index].button.setFillStyle(0x3d9f44, 1);

      this.feedbackTimer = this.time.delayedCall(900, () => {
        this.feedbackTimer = null;
        this.createRound();
      });
      return;
    }

    this.feedbackText.setText('PROBALD UJRA!');
    this.optionButtons[index].button.setFillStyle(0xb44747, 1);

    this.feedbackTimer = this.time.delayedCall(700, () => {
      this.feedbackTimer = null;
      this.feedbackText.setText('');
      this.optionButtons[index].button.setFillStyle(0x2e7d32, 1);
      this.optionButtons[index].button.setStrokeStyle(
        4,
        (this.selectedIndex ?? 0) === index ? 0xffe285 : 0xa8f8af,
      );
    });
  }

  update() {
    if (!this.cursors || !this.enterKey || this.feedbackTimer) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.selectedIndex = (this.selectedIndex ?? 0) - 1;
      if (this.selectedIndex < 0) this.selectedIndex = 2;
      this.highlightSelection();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.selectedIndex = ((this.selectedIndex ?? 0) + 1) % 3;
      this.highlightSelection();
    }

    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.checkAnswer(this.selectedIndex ?? 0);
    }

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

  highlightSelection() {
    const active = this.selectedIndex ?? 0;
    this.optionButtons.forEach((entry, i) => {
      entry.button.setStrokeStyle(4, i === active ? 0xffe285 : 0xa8f8af);
    });
  }
}
