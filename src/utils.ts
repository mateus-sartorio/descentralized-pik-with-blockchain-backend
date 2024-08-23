export function hexToString(hex: string): string {
  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }

  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  let result = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    result += String.fromCharCode(charCode);
  }

  return result;
}

export function stringToHex(str: string): string {
  const hex = Array.from(str).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  return `0x${hex}`;
}

export function replaceCRLFWithLineBreaks(input: string): string {
  return input.replace(/\\r\\n/g, '\n');
}