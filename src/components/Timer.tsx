import { useEffect, useState } from "react";

interface Props {
  seconds: number;
}

export default function Timer({ seconds: _seconds }: Props) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(_seconds);
  const [play, setPlay] = useState(false);
  const [visibility, setVisibility] = useState(true);

  // Convert seconds to minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Count down the timer when running. It stops and calls a function when it reaches 0.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (running && seconds === 0) {
      setPlay(true);
    }
    return () => clearInterval(interval);
  }, [running, seconds]);

  useEffect(() => {
    if (play) {
      const audio = new Audio("/alarm-clock-short-6402.mp3");
      audio.loop = true;
      audio.play();
      return () => audio.pause();
    }
  }, [play]);

  // Flash the timer when it reaches 0
  useEffect(() => {
    if (seconds === 0) {
      const interval = setInterval(() => {
        setVisibility(!visibility);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [seconds, visibility]);

  return (
    <div className="flex items-center justify-center space-x-4 py-2">
      <button
        className="text-sm font-bold text-neutral-600"
        onClick={() => {
          setRunning(!running);
          if (seconds === 0) setSeconds(_seconds);
          setPlay(false);
          setVisibility(true);
        }}
      >
        {running ? "Stop" : "Start"}
      </button>

      <div
        className={`flex select-none items-center justify-center font-mono text-xl text-neutral-800 ${
          visibility ? "visible" : "invisible"
        }`}
      >
        {minutes}:
        {remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
      </div>
      <button
        className="text-sm font-bold text-neutral-600"
        onClick={() => {
          setSeconds(_seconds);
        }}
      >
        Reset
      </button>
    </div>
  );
}
