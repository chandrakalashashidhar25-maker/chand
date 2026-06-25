const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Plant = require('../models/Plant');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Only images and videos allowed'));
  }
});

// GET all plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ date: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET recent (last 10 days)
router.get('/recent', async (req, res) => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const plants = await Plant.find({ date: { $gte: tenDaysAgo } }).sort({ date: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single plant
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create plant
router.post('/', upload.array('files', 50), async (req, res) => {
  try {
    const { plantName, date, report } = req.body;
    const files = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    const plant = new Plant({ plantName, date, report, files });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update plant (trimesters)
router.put('/:id', upload.fields([
  { name: 'trimester1', maxCount: 20 },
  { name: 'trimester2', maxCount: 20 },
  { name: 'trimester3', maxCount: 20 },
  { name: 'trimester4', maxCount: 20 },
  { name: 'files', maxCount: 50 }
]), async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    const { plantName, date, report,
      removeT1, removeT2, removeT3, removeT4, removeFiles } = req.body;

    if (plantName) plant.plantName = plantName;
    if (date) plant.date = date;
    if (report !== undefined) plant.report = report;

    // Handle main file updates
    if (req.files && req.files.files) {
      const newFiles = req.files.files.map(f => '/uploads/' + f.filename);
      plant.files = [...(plant.files || []), ...newFiles];
    }
    if (removeFiles) {
      const toRemove = JSON.parse(removeFiles);
      toRemove.forEach(fp => {
        const full = path.join(__dirname, '..', fp);
        if (fs.existsSync(full)) fs.unlinkSync(full);
      });
      plant.files = plant.files.filter(f => !toRemove.includes(f));
    }

    // Trimester updates
    const trims = ['trimester1', 'trimester2', 'trimester3', 'trimester4'];
    const removes = [removeT1, removeT2, removeT3, removeT4];
    trims.forEach((t, i) => {
      if (!plant[t]) plant[t] = { files: [] };
      if (req.files && req.files[t]) {
        const nf = req.files[t].map(f => '/uploads/' + f.filename);
        plant[t].files = [...(plant[t].files || []), ...nf];
      }
      if (removes[i]) {
        const toRm = JSON.parse(removes[i]);
        toRm.forEach(fp => {
          const full = path.join(__dirname, '..', fp);
          if (fs.existsSync(full)) fs.unlinkSync(full);
        });
        plant[t].files = (plant[t].files || []).filter(f => !toRm.includes(f));
      }
    });

    plant.markModified('trimester1');
    plant.markModified('trimester2');
    plant.markModified('trimester3');
    plant.markModified('trimester4');
    await plant.save();
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE plant
router.delete('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    // Delete all files
    const allFiles = [
      ...(plant.files || []),
      ...(plant.trimester1?.files || []),
      ...(plant.trimester2?.files || []),
      ...(plant.trimester3?.files || []),
      ...(plant.trimester4?.files || [])
    ];
    allFiles.forEach(fp => {
      const full = path.join(__dirname, '..', fp);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    });

    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
