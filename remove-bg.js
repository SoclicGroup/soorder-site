const { Jimp } = require("jimp");

Jimp.read("Logo-soorder.png").then(img => {
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    if (r < 30 && g < 30 && b < 30) {
      this.bitmap.data[idx + 3] = 0;
    }
  });
  return img.write("logo-transparent.png");
}).then(() => {
  console.log("Done — logo-transparent.png saved");
}).catch(err => {
  console.error(err);
  process.exit(1);
});
