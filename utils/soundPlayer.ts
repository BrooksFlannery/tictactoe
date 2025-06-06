const successSounds = [
  '/sounds/success/1.mp3',
  '/sounds/success/2.mp3',
  '/sounds/success/3.mp3',
  '/sounds/success/4.mp3',
  '/sounds/success/5.mp3',
];

const failureSounds = [
  '/sounds/failure/1.mp3',
  '/sounds/failure/2.mp3',
  '/sounds/failure/3.mp3',
];

const interactionSounds = [
  '/sounds/interaction/1.mp3',
  '/sounds/interaction/2.mp3',
  '/sounds/interaction/3.mp3',
];

const playFrom = (soundArr : string[]) => {
    const randomSound = soundArr[Math.floor(Math.random() * soundArr.length)];
    const sound = new Audio(randomSound);
    sound.playbackRate = 0.8 + (Math.random() - 0.1);
    sound.play();
}

export const playRandomSound = {
    success: () => playFrom(successSounds),
    failure: () => playFrom(failureSounds),
    interaction: () => playFrom(interactionSounds)
}
