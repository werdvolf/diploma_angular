import { IParticle } from './particle';

//chance to infect
const chanceToInfect: number = 0.1;

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
export function getDistance(a: IParticle, b: IParticle) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
//get distance from suspectible particle to infected
// if distance in range which we determined return chance
// else return false
function updateIsInfected(
  a: IParticle,
  b: IParticle,
  distanceToInfect: number,
  chanceToInfect: number
) {
  if (getDistance(a, b) < distanceToInfect && a.getStatus() == 's') {
    return getChance(chanceToInfect);
  }
  return false;
}

export function eachGroupAmount(array: IParticle[]) {
  let infected: number = 0;
  let suspectible: number = 0;
  let recovered: number = 0;

  array.forEach((el) => {
    if (el.getStatus() == 'i') {
      infected += 1;
    }
    if (el.getStatus() == 's') {
      suspectible += 1;
    }
    if (el.getStatus() == 'r') {
      recovered += 1;
    }
  });
  return [infected, suspectible, recovered];
}

export function moveSeparate(
  p1: IParticle,
  p2: IParticle,
  moveSeparate: boolean
) {
  if (moveSeparate) {
    if (getDistance(p2, p1) < 20 && p1 != p2) {
      p1.x += (p1.x - p2.x) * 0.3;
      p1.y += (p1.y - p2.y) * 0.3;
    }
  }
}

export function getPerOfAmount(per: number, amount: number) {
  return Math.round((per * amount) / 100);
}

export function checkAndUpdate(
  a: IParticle,
  b: IParticle,
  distanceToInfect: number,
  chanceToInfect: number
) {
  if (b.getStatus() == 'i') {
    //if updateInfected return True,
    //change suspectible particle status to 'i'
    //and push it to infected array
    if (updateIsInfected(a, b, distanceToInfect, chanceToInfect)) {
      a.updateStatus('i');
      a.changeColor('#FF0000');
      a.checkIfRecovered();
    }
  }
}
