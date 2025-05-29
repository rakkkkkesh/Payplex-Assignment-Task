const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
  toggleStatus,
} = require('../Controllers/PageController');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

router.get('/', getAllPages);
router.get('/:id', getPageById);
router.post('/', upload.fields([{ name: 'logo' }, { name: 'bannerImage' }]), createPage);
router.put('/:id', upload.fields([{ name: 'logo' }, { name: 'bannerImage' }]), updatePage);
router.delete('/:id', deletePage);

// PATCH route to toggle active status
router.patch('/:id/status', toggleStatus);

module.exports = router;