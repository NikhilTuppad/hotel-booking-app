const imageDownloader = require('image-downloader');
const fs = require('fs');
const path = require('path');

const uploadByLink = async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  const destDir = path.join(__dirname, '..', 'uploads');
  
  try {
    await imageDownloader.image({
      url: link,
      dest: path.join(destDir, newName),
    });
    res.json(newName);
  } catch (err) {
    res.status(500).json('Failed to download image');
  }
};

const uploadPhotos = async (req, res) => {
  const uploadedFiles = [];
  try {
    const { fileTypeFromFile } = await import('file-type');

    for (let i = 0; i < req.files.length; i++) {
      const { path: tempPath, originalname } = req.files[i];
      const ext = originalname.split('.').pop().toLowerCase();
      
      // Basic extension validation
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        continue; // Skip invalid extensions
      }

      // Check real mime type
      const type = await fileTypeFromFile(tempPath);
      if (!type || !type.mime.startsWith('image/')) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        continue;
      }

      const newPath = tempPath + '.' + ext;
      fs.renameSync(tempPath, newPath);
      
      // Support cross-platform paths
      let relativePath = newPath.replace('uploads\\', '').replace('uploads/', '');
      uploadedFiles.push(relativePath);
    }
    res.json(uploadedFiles);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json('Failed to process uploads');
  }
};

module.exports = { uploadByLink, uploadPhotos };
