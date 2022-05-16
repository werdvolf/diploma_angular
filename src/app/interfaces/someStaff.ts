import { IParticle } from './particle';

//distance to infect
const distanceToInfect: number = 5;
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
function getDistance(a: IParticle, b: IParticle) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
//get distance from suspectible particle to infected
// if distance in range which we determined return chance
// else return false
function updateIsInfected(a: IParticle, b: IParticle) {
  if (getDistance(a, b) < distanceToInfect && a.getStatus() == 's') {
    return getChance(chanceToInfect);
  }
  return false;
}

export function getParticleAmount(array: IParticle[]) {
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

export function checkAndUpdate(particles: IParticle[]) {
  //loop through suspectible and infected particles
  particles.forEach((s) => {
    particles.forEach((i) => {
      if (i.getStatus() == 'i') {
        //if updateInfected return True,
        //change suspectible particle status to 'i'
        //and push it to infected array
        if (updateIsInfected(s, i)) {
          s.updateStatus('i');
          s.changeColor('#FF0000');
          s.checkIfRecovered();
        }
      }
    });
  });
}
