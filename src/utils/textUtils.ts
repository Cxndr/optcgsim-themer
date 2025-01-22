
export function addSpacesToText(text: string) {
  return text.replace(/(?!^)([A-Z])/g, ' $1').trim();
}