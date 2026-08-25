import { useRef, useCallback, useState } from 'react';

export default function useAudio() {
  const audioContextRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setError(null);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.');
      setRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        stream?.getTracks().forEach((t) => t.stop());
        setRecording(false);
        resolve({ blob, url });
      };
      const stream = recorder.stream;
      recorder.stop();
    });
  }, []);

  const playAudio = useCallback((url) => {
    const audio = new Audio(url);
    audio.play().catch(() => {});
    return audio;
  }, []);

  return { recording, error, startRecording, stopRecording, playAudio, getAudioContext };
}
