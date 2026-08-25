// FFmpeg service abstraction
// In-browser FFmpeg.wasm for supported codecs, with backend fallback architecture.

let ffmpegInstance = null;
let ffmpegLoaded = false;

export async function loadFFmpeg() {
  if (ffmpegLoaded) return ffmpegInstance;
  try {
    // Dynamic import — only loaded when needed
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');

    ffmpegInstance = new FFmpeg();
    const coreURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js';
    const wasmURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm';

    await ffmpegInstance.load({
      coreURL: await toBlobURL(coreURL, 'text/javascript'),
      wasmURL: await toBlobURL(wasmURL, 'application/wasm'),
    });

    ffmpegLoaded = true;
    ffmpegInstance._fetchFile = fetchFile;
    return ffmpegInstance;
  } catch (err) {
    console.warn('FFmpeg.wasm failed to load. Export will use MediaRecorder fallback.', err);
    return null;
  }
}

export function isFFmpegSupported() {
  return typeof SharedArrayBuffer !== 'undefined' && typeof WebAssembly !== 'undefined';
}

export async function transcodeVideo(file, options = {}) {
  const ffmpeg = await loadFFmpeg();
  if (!ffmpeg) {
    throw new Error('FFmpeg not available in this browser. Use MediaRecorder export instead.');
  }
  const { format = 'mp4', resolution = '1080p', fps = 30 } = options;
  const inputName = `input.${file.name.split('.').pop()}`;
  const outputName = `output.${format}`;

  await ffmpeg.writeFile(inputName, await ffmpeg._fetchFile(file));
  const scaleMap = { '480p': '854:480', '720p': '1280:720', '1080p': '1920:1080', '1440p': '2560:1440', '2160p': '3840:2160' };
  const scale = scaleMap[resolution] || scaleMap['1080p'];

  await ffmpeg.exec([
    '-i', inputName,
    '-vf', `scale=${scale}`,
    '-r', String(fps),
    '-c:v', 'libx264',
    '-preset', 'fast',
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  const blob = new Blob([data.buffer], { type: `video/${format}` });
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);
  return blob;
}
