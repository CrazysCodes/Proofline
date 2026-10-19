// Rasterize the existing vector brand mark; no external image service is used.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const source = await fs.readFile(path.join(root, 'app', 'icon.svg'));
  const output = path.join(root, 'public');
  await fs.mkdir(output, { recursive: true });
  for (const [size, name] of [[192, 'favicon-192.png'], [180, 'apple-touch-icon.png']]) {
    await sharp(source).resize(size, size).png().toFile(path.join(output, name));
  }
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((png, index) => {
    const entry = 6 + 16 * index;
    header[entry] = sizes[index];
    header[entry + 1] = sizes[index];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  await fs.writeFile(path.join(output, 'favicon.ico'), Buffer.concat([header, ...images]));
  console.log('Generated PNG, Apple touch icon, and multi-size ICO from app/icon.svg.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
