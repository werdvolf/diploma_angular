import * as utils from './utils';

const width = 700;
const height = 700;

export interface IPerson {
  x: number;
  y: number;
  dx: number;
  dy: number;
  status: string;
  color: string;
  particleRadius: number;
  infectionRadius: number;
  chanceToInfect: number;
  timeToRecover: number;
  moveSeparate: boolean;
  isVaccinated: boolean;
  onQuarantine: boolean;
  move(): void;
  updateStatus(value: string): void;
  getStatus(): string;
  setLocate(x: number, y: number): void;
  getSpeed(): Array<number>;
  setSpeed(dx: number, dy: number): void;
  changeColor(value: string): void;
  getLocate(): Array<number>;
  checkIfRecovered(): void;
  ifOnQuarantine(): void;
}

export class Person implements IPerson {
  status: string;
  particleRadius = 5;
  color: string;
  infectionRadius: number;
  timeToRecover: number;
  chanceToInfect: number;
  moveSeparate: boolean = false;
  isVaccinated: boolean = false;
  onQuarantine: boolean = false;

  x = utils.random(this.particleRadius, width - this.particleRadius);
  dx = utils.randomSpeedUp(-4, 4);

  y = utils.random(this.particleRadius, height - this.particleRadius);
  dy = utils.randomSpeedUp(-4, 4);

  constructor(
    status: string,
    infectionRadius: number,
    timeToRecover: number,
    chanceToInfect: number
  ) {
    this.chanceToInfect = chanceToInfect;
    this.timeToRecover = timeToRecover * 1000;
    this.infectionRadius = infectionRadius;
    this.status = status;
    if (this.status == 'i') {
      this.color = '#FF0000';
      this.checkIfRecovered();
    } else if (this.status == 's') {
      this.color = '#0095DD';
    } else if (this.status == 'r') {
      this.color = '#808080';
    }
  }

  public move() {
    if (this.x + this.dx >= width - this.particleRadius) {
      this.x = width - this.particleRadius;
      this.dx = -this.dx;
    }
    if (this.x + this.dx <= this.particleRadius) {
      this.x = this.particleRadius;
      this.dx = -this.dx;
    }
    if (this.y + this.dy >= height - this.particleRadius) {
      this.y = height - this.particleRadius;
      this.dy = -this.dy;
    }
    if (this.y + this.dy <= this.particleRadius) {
      this.y = this.particleRadius;
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  public setSpeed(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }
  public getSpeed(): Array<number> {
    return [this.dx, this.dy];
  }

  public getLocate(): Array<number> {
    return [this.x, this.y];
  }

  public setLocate(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getStatus(): string {
    return this.status;
  }
  public updateStatus(value: string): void {
    this.status = value;
  }
  public changeColor(value: string) {
    this.color = value;
  }

  public checkIfRecovered() {
    setTimeout(() => {
      this.updateStatus('r');
      this.changeColor('#808080');
    }, this.timeToRecover);
  }
  public ifOnQuarantine() {
    this.updateStatus('i');
    this.changeColor('#1BFF00');
    if (this.onQuarantine) {
      setTimeout(() => {
        this.setSpeed(0, 0);
        this.updateStatus('q');
        this.changeColor('#000000');
      }, 3000);
    }
  }
}

export class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  public animate(persons: IPerson[]): void {
    this.ctx.clearRect(0, 0, width, height);
    persons.forEach((p1) => {
      this.ctx.beginPath();
      this.ctx.arc(p1.x, p1.y, p1.particleRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = p1.color;
      this.ctx.fill();
      this.ctx.closePath();
      persons.forEach((p2) => {
        if (p1.getStatus() != 'q' && p2.getStatus() != 'q') {
          utils.checkAndUpdate(p1, p2, p1.infectionRadius, p1.chanceToInfect);
          utils.moveSeparate(p1, p2, p1.moveSeparate);
        }
      });
      p1.move();
    });
  }
}
