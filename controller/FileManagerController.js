const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const multer = require("multer");

const BASE_DIR = path.resolve("public/nj");

/* =====================
   SAFE PATH
===================== */
function safePath(userPath = "") {
  const target = path.resolve(BASE_DIR, userPath);
  if (!target.startsWith(BASE_DIR)) {
    throw new Error("Access denied");
  }
  return target;
}

/* =====================
   FILE MANAGER VIEW
===================== */
exports.fileview = (req, res) => {
  res.render("admin/FileManager");
};

/* =====================
   LIST FILES
===================== */
exports.filesapi = async (req, res) => {
  try {
    const relPath = req.query.path || "";
    const dir = safePath(relPath);

    const files = await fsp.readdir(dir, { withFileTypes: true });

    res.json({
      path: relPath,
      items: files.map(f => ({
        name: f.name,
        type: f.isDirectory() ? "folder" : "file"
      }))
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

/* =====================
   DELETE FILE / FOLDER
===================== */
exports.filedelete = async (req, res) => {
  try {
    const target = safePath(req.body.path);
    await fsp.rm(target, { recursive: true, force: true });
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

/* =====================
   MULTER STORAGE
===================== */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    try {
      const folder = safePath(req.body.path || "");
      cb(null, folder);
    } catch (err) {
      cb(err);
    }
  },
  filename(req, file, cb) {
    const safeName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

/* =====================
   MULTER CONFIG
===================== */
const cupload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
});

/* =====================
   FILE UPLOAD CONTROLLER
===================== */
exports.fileupload = (req, res) => {
  cupload.single("file")(req, res, err => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      file: {
        name: req.file.filename,
        path: req.body.path || ""
      }
    });
  });
};