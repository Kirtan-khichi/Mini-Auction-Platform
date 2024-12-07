const admin = require('../utils/firebase');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  const bucket = admin.storage().bucket();

  const file = bucket.file(`auction-items/${req.file.originalname}`);

  try {
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    res.status(200).json({ message: 'Image uploaded successfully', url: publicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadImage, upload };
