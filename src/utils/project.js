import { uid } from './time';

export function createProject(name = 'Untitled Project', aspectRatio = '16:9') {
  return {
    id: uid(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    duration: 0,
    aspectRatio,
    fps: 30,
    media: [],
    tracks: [
      { id: 'track_v1', type: 'video', name: 'Video 1', muted: false, locked: false, visible: true, collapsed: false },
      { id: 'track_a1', type: 'audio', name: 'Audio 1', muted: false, locked: false, visible: true, collapsed: false },
      { id: 'track_t1', type: 'text', name: 'Text 1', muted: false, locked: false, visible: true, collapsed: false },
    ],
    clips: [],
    settings: {
      canvasColor: '#000000',
      background: 'black',
    },
  };
}

export function createDemoProject() {
  const projectId = uid();
  return {
    id: projectId,
    name: 'Demo Project',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    duration: 30,
    aspectRatio: '16:9',
    fps: 30,
    media: [],
    tracks: [
      { id: 'track_v1', type: 'video', name: 'Video 1', muted: false, locked: false, visible: true, collapsed: false },
      { id: 'track_v2', type: 'video', name: 'Video 2', muted: false, locked: false, visible: true, collapsed: false },
      { id: 'track_t1', type: 'text', name: 'Text 1', muted: false, locked: false, visible: true, collapsed: false },
      { id: 'track_a1', type: 'audio', name: 'Audio 1', muted: false, locked: false, visible: true, collapsed: false },
    ],
    clips: [
      {
        id: 'demo_c1',
        assetId: null,
        trackId: 'track_v1',
        type: 'video',
        name: 'Intro Clip',
        start: 0,
        duration: 10,
        sourceStart: 0,
        sourceEnd: 10,
        volume: 1,
        speed: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, flipH: false, flipV: false },
        filters: { brightness: 1, contrast: 1, saturation: 1 },
        color: '#3b82f6',
      },
      {
        id: 'demo_c2',
        assetId: null,
        trackId: 'track_v2',
        type: 'video',
        name: 'B-Roll',
        start: 5,
        duration: 8,
        sourceStart: 0,
        sourceEnd: 8,
        volume: 1,
        speed: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, flipH: false, flipV: false },
        filters: { brightness: 1, contrast: 1, saturation: 1 },
        color: '#3b82f6',
      },
      {
        id: 'demo_c3',
        assetId: null,
        trackId: 'track_t1',
        type: 'text',
        name: 'Welcome to ClipForge',
        start: 1,
        duration: 6,
        sourceStart: 0,
        sourceEnd: 6,
        volume: 1,
        speed: 1,
        text: 'Welcome to ClipForge',
        textStyle: {
          fontFamily: 'Inter',
          fontSize: 48,
          fontWeight: 700,
          color: '#ffffff',
          align: 'center',
          italic: false,
          underline: false,
          stroke: false,
          strokeColor: '#000000',
          strokeWidth: 2,
          shadow: false,
          shadowBlur: 8,
          shadowColor: '#000000',
          shadowOpacity: 0.5,
        },
        transform: { x: 0, y: -80, scale: 1, rotation: 0, opacity: 1, flipH: false, flipV: false },
        animation: { entrance: 'fade', exit: 'fade', loop: null },
        color: '#f59e0b',
      },
      {
        id: 'demo_c4',
        assetId: null,
        trackId: 'track_a1',
        type: 'audio',
        name: 'Background Music',
        start: 0,
        duration: 30,
        sourceStart: 0,
        sourceEnd: 30,
        volume: 0.5,
        speed: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, flipH: false, flipV: false },
        color: '#8b5cf6',
      },
    ],
    settings: {
      canvasColor: '#000000',
      background: 'black',
    },
    isDemo: true,
  };
}

export function serializeProject(project) {
  return JSON.stringify(project);
}

export function deserializeProject(json) {
  try {
    const data = JSON.parse(json);
    return data;
  } catch {
    return null;
  }
}

export function getAspectRatioValue(ratio) {
  const map = {
    '16:9': { width: 16, height: 9 },
    '9:16': { width: 9, height: 16 },
    '1:1': { width: 1, height: 1 },
    '4:5': { width: 4, height: 5 },
    '4:3': { width: 4, height: 3 },
    '21:9': { width: 21, height: 9 },
  };
  return map[ratio] || map['16:9'];
}
