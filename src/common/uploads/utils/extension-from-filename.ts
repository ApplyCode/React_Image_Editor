export function extensionFromFilename(
  fullFileName: string
): string | undefined {
  const re = /(?:\.([^.]+))?$/;
  return re.exec(fullFileName)?.[1];
}
