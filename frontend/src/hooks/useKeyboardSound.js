import { audios } from "../assets/assets";

const keyStrokeSounds = [
    audios.keyStroke1, audios.keyStroke2,
    audios.keyStroke3, audios.keyStroke4
];

const useKeyboardSound = () => {
    const playRandomKeyStrokeSound = () => {
        const randomSound = keyStrokeSounds[ Math.floor(Math.random() * keyStrokeSounds.length) ];

        randomSound.currentTime = 0;
        randomSound.play().catch(error => {
            console.error("Audio play failed:", error);
        })
    }

    return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;

