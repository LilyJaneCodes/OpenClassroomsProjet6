const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const inputPath = req.file.path;
  const outputFilename = `${path.parse(req.file.filename).name}.webp`;
  const outputPath = path.join(req.file.destination, outputFilename);

  try {
    await sharp(inputPath)
      .rotate()
      .resize({
        width: 800,
        height: 800,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    fs.unlinkSync(inputPath);

    req.file.filename = outputFilename;
    req.file.path = outputPath;
    req.file.mimetype = 'image/webp';

    next();
  } catch (error) {
    if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
    }

    // Le fichier n'est pas une image valide
    error.code = 'INVALID_IMAGE_CONTENT';

    next(error);
    }
};