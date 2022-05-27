import { NumberValueAccessor } from '@angular/forms';
import { IPerson } from './person';

//get random value, uses for coordinates
export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//get random speed from range
export function randomSpeedUp(min: number, max: number): number {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return [0].includes(num) ? randomSpeedUp(min, max) : num;
}

//get chance to infect
function getChance(chance: number): boolean {
  return Math.random() < chance;
}

//get distance from suspectible particle to infected
export function getDistance(a: IPerson, b: IPerson) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
//get distance from suspectible particle to infected
// if distance in range which we determined return chance
// else return false
function updateIsInfected(
  a: IPerson,
  b: IPerson,
  distanceToInfect: number,
  chanceToInfect: number
) {
  if (
    getDistance(a, b) < distanceToInfect &&
    a.getStatus() == 's' &&
    b.getStatus() == 'i'
  ) {
    return getChance(chanceToInfect);
  }
  return false;
}

export function eachGroupAmount(array: IPerson[]) {
  let infectious: number = 0;
  let susceptible: number = 0;
  let recovered: number = 0;

  array.forEach((el) => {
    if (el.getStatus() == 'i') {
      infectious += 1;
    }
    if (el.getStatus() == 's') {
      susceptible += 1;
    }
    if (el.getStatus() == 'r') {
      recovered += 1;
    }
  });
  return [infectious, susceptible, recovered];
}

export function moveSeparate(p1: IPerson, p2: IPerson, moveSeparate: boolean) {
  if (moveSeparate) {
    if (p1 != p2) {
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      let R = 50;
      if (d > 0 && d < R) {
        let dR = R - d;
        let ux = dx / d;
        let uy = dy / d;
        if (p1.moveSeparate == true) {
          p1.x += ux * dR * 0.1;
          p1.y += uy * dR * 0.1;
        }
        if (p2.moveSeparate == true) {
          p2.x += -ux * dR * 0.1;
          p2.y += -uy * dR * 0.1;
        }
      }
    }
  }
}

export function updateAllParams(
  vaccinePercent: number,
  quarantinePercent: number,
  separationPercent: number,
  persons: IPerson[]
) {
  let [infectedAmount, susceptibleAmount, recoveredAmount] =
    eachGroupAmount(persons);
  let vaccineAmount: number;
  let quarantineAmount: number;
  let separationAmount: number;

  vaccineAmount = getPerOfAmount(vaccinePercent, susceptibleAmount);

  quarantineAmount = getPerOfAmount(quarantinePercent, susceptibleAmount);

  separationAmount = getPerOfAmount(separationPercent, susceptibleAmount);

  persons.forEach((person) => {
    if (vaccineAmount != 0) {
      person.isVaccinated = true;
      person.updateStatus('v');
      person.changeColor('#E4FF00');
      vaccineAmount -= 1;
    }
    if (quarantineAmount != 0) {
      person.onQuarantine = true;
      quarantineAmount -= 1;
    }
    if (separationAmount != 0) {
      person.moveSeparate = true;
      separationAmount -= 1;
    }
  });
}

export function getPerOfAmount(per: number, amount: number) {
  if (per == 0) return 0;
  else return Math.round((per * amount) / 100);
}

export function checkAndUpdate(
  p1: IPerson,
  p2: IPerson,
  distanceToInfect: number,
  chanceToInfect: number
) {
  if (p2.getStatus() == 'i') {
    if (updateIsInfected(p1, p2, distanceToInfect, chanceToInfect)) {
      p1.updateStatus('i');
      p1.changeColor('#FF0000');
      if (!p1.onQuarantine) {
        p1.checkIfRecovered();
      } else {
        p1.ifOnQuarantine();
      }
    }
  }
}
