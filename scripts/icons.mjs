import { deflateSync } from 'node:zlib';

const crcTable = Array.from({length: 256}, (_, start) => {
  let value = start;
  for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value;
});
function chunk(type, payload) {
  const data = Buffer.concat([Buffer.from(type), payload]);
  let crc = 0xffffffff;
  for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(payload.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([length, data, checksum]);
}
function nearSegment(x, y, a, b, width) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.min(1, Math.max(0, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy) < width;
}
const logo = [[.26,.41],[.355,.59],[.445,.45],[.535,.59],[.63,.41]];
export function iconPng(width, height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const rows = Buffer.alloc(height * (1 + width * 3));
  const side = Math.min(width,height);
  for (let j = 0; j < height; j++) {
    const y = (j - (height - side) / 2) / side;
    for (let i = 0; i < width; i++) {
      const x = (i - (width - side) / 2) / side;
      const radius = Math.hypot(x - .5, y - .5);
      const glow = Math.max(0, 1 - radius * 1.8);
      let rgb = [12 + 13 * glow, 23 + 31 * glow, 46 + 65 * glow];
      if (Math.abs(radius - .34) < .004 || Math.abs(radius - .395) < .002) rgb = [60,104,166];
      if (logo.slice(1).some((point, index) => nearSegment(x, y, logo[index], point, .022))) rgb = [233,243,255];
      if (Math.hypot(x - .71, y - .59) < .026) rgb = [115,184,255];
      const offset = j * (1 + width * 3) + 1 + i * 3;
      for (let c = 0; c < 3; c++) rows[offset + c] = rgb[c];
    }
  }
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR',header), chunk('IDAT',deflateSync(rows)), chunk('IEND',Buffer.alloc(0))]);
}
