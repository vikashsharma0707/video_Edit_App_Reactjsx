export function validateProject(project) {
  const errors = [];
  if (!project) {
    errors.push('Project is null or undefined');
    return { valid: false, errors };
  }
  if (!project.name) errors.push('Project name is missing');
  if (!project.tracks || project.tracks.length === 0) errors.push('Project has no tracks');
  if (!project.clips) errors.push('Project clips array is missing');
  return { valid: errors.length === 0, errors };
}

export function validateClip(clip) {
  const errors = [];
  if (!clip.id) errors.push('Clip missing id');
  if (!clip.trackId) errors.push('Clip missing trackId');
  if (clip.duration <= 0) errors.push('Clip duration must be positive');
  if (clip.start < 0) errors.push('Clip start cannot be negative');
  return { valid: errors.length === 0, errors };
}

export function validateExportSettings(settings) {
  const errors = [];
  if (!settings.resolution) errors.push('Resolution is required');
  if (!settings.format) errors.push('Format is required');
  if (!settings.fps || settings.fps < 1) errors.push('Valid FPS is required');
  return { valid: errors.length === 0, errors };
}
