export function generateUniqueJobTitle(baseName: string): string {
    const timestamp = Date.now();
    return `${baseName}_${timestamp}`;
}

export function generateDescription() {
  return "Auto generated job description";
}

export function generateNote() {
  return "Auto generated note";
}

