const multer = require('multer');
const path = require('path');


// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Not an image! Please upload only images.'), false);
//   }
// };
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Image types
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Video types
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload only images or videos.'), false);
  }
};


// Export the multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Configurable via env; default 200MB
    fileSize: (parseInt(process.env.UPLOAD_MAX_FILE_MB || '200', 10)) * 1024 * 1024
  }
});

module.exports = upload;
