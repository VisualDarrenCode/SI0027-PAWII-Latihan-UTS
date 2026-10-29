const Menu = require("../models/menuModel");

const MAX_LIMIT = 100;

// B1: GET /menu - daftar menu
exports.getAll = async (req, res) => {
  // Filter berdasarkan kantin
  const filter = {};

  if (req.query.kantinId) {
    filter.kantinId = req.query.kantinId;
  }

  // Pagination
  const pageInput = Number.parseInt(req.query.page, 10);
  const page = Number.isInteger(pageInput) && pageInput > 0
    ? pageInput
    : 1;

  const limitInput = Number.parseInt(req.query.limit, 10);
  const requestedLimit = Number.isInteger(limitInput) && limitInput > 0
    ? limitInput
    : 10;

  const limit = Math.min(requestedLimit, MAX_LIMIT);

  // Sorting ascending, default createdAt
  const sortField =
    typeof req.query.sort === "string" && req.query.sort.trim()
      ? req.query.sort.trim()
      : "createdAt";

  // Total dokumen yang cocok dengan filter, tanpa pagination
  const total = await Menu.countDocuments(filter);

  // Query daftar menu
  let query = Menu.find(filter)
    .populate("kantinId")
    .sort({ [sortField]: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // Projection: fields=nama,kode
  if (typeof req.query.fields === "string" && req.query.fields.trim()) {
    const fields = req.query.fields
      .split(",")
      .map(field => field.trim())
      .filter(Boolean);

    // Tetap sertakan kantinId agar dapat di-populate
    if (!fields.includes("kantinId")) {
      fields.push("kantinId");
    }

    query = query.select(fields.join(" "));
  }

  const data = await query;

  res.status(200).json({
    data,
    page,
    limit,
    total
  });
};

// B2: GET /menu/:id - detail menu
exports.getById = async (req, res) => {
  const menu = await Menu.findById(req.params.id)
    .populate("kantinId");

  if (!menu) {
    throw { status: 404, message: "Menu tidak ditemukan" };
  }

  res.status(200).json(menu);
};

// B3: POST /menu - tambah menu
exports.create = async (req, res) => {
  const menu = await Menu.create(req.body);

  res.status(201).json(menu);
};

// B4: PUT /menu/:id - ubah menu
exports.update = async (req, res) => {
  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!menu) {
    throw { status: 404, message: "Menu tidak ditemukan" };
  }

  res.status(200).json(menu);
};

// B5: DELETE /menu/:id - hapus menu
exports.remove = async (req, res) => {
  const menu = await Menu.findByIdAndDelete(req.params.id);

  if (!menu) {
    throw { status: 404, message: "Menu tidak ditemukan" };
  }

  res.status(204).send();
};