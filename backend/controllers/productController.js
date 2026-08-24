const products = require('../data/products');

/**
 * Helper function to validate product input data
 * @param {Object} data 
 * @param {boolean} isUpdate 
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
function validateProductData(data, isUpdate = false) {
  const errors = {};

  // Validate Name
  if (!isUpdate || data.name !== undefined) {
    if (data.name === undefined || data.name === null) {
      errors.name = 'Product name is required';
    } else if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.name = 'Product name cannot be empty';
    }
  }

  // Validate Category
  if (!isUpdate || data.category !== undefined) {
    if (data.category === undefined || data.category === null) {
      errors.category = 'Category is required';
    } else if (typeof data.category !== 'string' || data.category.trim() === '') {
      errors.category = 'Category cannot be empty';
    }
  }

  // Validate Price
  if (!isUpdate || data.price !== undefined) {
    if (data.price === undefined || data.price === null || data.price === '') {
      errors.price = 'Price is required';
    } else {
      const numPrice = Number(data.price);
      if (isNaN(numPrice)) {
        errors.price = 'Price must be a valid number';
      } else if (numPrice <= 0) {
        errors.price = 'Price must be greater than 0';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Helper to validate and parse ID parameter
 * @param {string} idParam 
 * @returns {number|string|null} parsed ID or null if invalid
 */
function parseValidId(idParam) {
  if (!idParam || typeof idParam !== 'string') return null;
  const trimmed = idParam.trim();
  if (trimmed === '') return null;
  
  // If it's pure integer digits
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    return isNaN(num) || num <= 0 ? null : num;
  }
  
  // If alphanumeric ID
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Helper to generate an automated icon type based on product name/category
 */
function inferIconType(name, category) {
  const nameLower = (name || '').toLowerCase();
  const catLower = (category || '').toLowerCase();

  if (nameLower.includes('laptop') || nameLower.includes('mac') || nameLower.includes('pc')) return 'laptop';
  if (nameLower.includes('phone') || nameLower.includes('iphone') || nameLower.includes('android')) return 'phone';
  if (nameLower.includes('cloud') || nameLower.includes('software') || catLower === 'software') return 'cloud';
  if (nameLower.includes('headset') || nameLower.includes('audio') || nameLower.includes('headphone') || nameLower.includes('earbuds')) return 'headset';
  if (nameLower.includes('keyboard') || nameLower.includes('mouse')) return 'keyboard';
  if (nameLower.includes('monitor') || nameLower.includes('display') || nameLower.includes('screen')) return 'monitor';
  if (catLower === 'furniture' || nameLower.includes('chair') || nameLower.includes('desk')) return 'chair';
  if (catLower === 'clothing' || nameLower.includes('hoodie') || nameLower.includes('shirt')) return 'clothing';
  if (catLower === 'accessories' || nameLower.includes('watch')) return 'watch';

  return 'default';
}

/**
 * GET /api/products
 * Fetch all products, with optional search and category query filtering
 */
exports.getProducts = (req, res, next) => {
  try {
    let results = [...products];

    // Optional query filtering by search term
    const { search, category } = req.query;

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      results = results.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Optional query filtering by category
    if (category && typeof category === 'string' && category.trim() !== '' && category.toLowerCase() !== 'all') {
      const cat = category.trim().toLowerCase();
      results = results.filter(p => p.category && p.category.toLowerCase() === cat);
    }

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Fetch a single product by ID
 */
exports.getProductById = (req, res, next) => {
  try {
    const rawId = req.params.id;
    const parsedId = parseValidId(rawId);

    if (parsedId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = products.find(p => String(p.id) === String(parsedId));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Create a new product
 */
exports.createProduct = (req, res, next) => {
  try {
    const { name, category, price, sku, status, description, stock, iconType, createdAt } = req.body;

    // Validate required fields
    const validation = validateProductData(req.body, false);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      });
    }

    // Generate numeric unique ID
    const maxId = products.reduce((max, p) => {
      const num = Number(p.id);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const newId = maxId + 1;

    // Generate SKU if omitted
    const generatedSku = sku && typeof sku === 'string' && sku.trim() !== ''
      ? sku.trim().toUpperCase()
      : `${category.trim().slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProduct = {
      id: newId,
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      sku: generatedSku,
      status: status || 'Active',
      createdAt: createdAt || new Date().toISOString().split('T')[0],
      description: description ? description.trim() : '',
      stock: stock !== undefined && !isNaN(Number(stock)) ? Number(stock) : 0,
      iconType: iconType || inferIconType(name, category)
    };

    // Prepend to in-memory list
    products.unshift(newProduct);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Update an existing product
 */
exports.updateProduct = (req, res, next) => {
  try {
    const rawId = req.params.id;
    const parsedId = parseValidId(rawId);

    if (parsedId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const index = products.findIndex(p => String(p.id) === String(parsedId));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Validate fields
    const validation = validateProductData(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      });
    }

    const existing = products[index];
    const { name, category, price, sku, status, description, stock, iconType } = req.body;

    const updatedProduct = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      category: category !== undefined ? category.trim() : existing.category,
      price: price !== undefined ? Number(price) : existing.price,
      sku: sku !== undefined ? sku.trim().toUpperCase() : existing.sku,
      status: status !== undefined ? status : existing.status,
      description: description !== undefined ? description.trim() : existing.description,
      stock: stock !== undefined && !isNaN(Number(stock)) ? Number(stock) : existing.stock,
      iconType: iconType || inferIconType(name || existing.name, category || existing.category),
      id: existing.id, // Preserve immutable ID
      createdAt: existing.createdAt // Preserve creation timestamp
    };

    products[index] = updatedProduct;

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product by ID
 */
exports.deleteProduct = (req, res, next) => {
  try {
    const rawId = req.params.id;
    const parsedId = parseValidId(rawId);

    if (parsedId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const index = products.findIndex(p => String(p.id) === String(parsedId));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    products.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
