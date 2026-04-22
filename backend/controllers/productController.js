const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit).limit(Number(limit))
      .sort({ createdAt: -1 });
    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return res.json({ message: 'Products already seeded' });
    const products = [
      {
        name: 'Classic Round Neck T-Shirt',
        description: 'Premium 180 GSM cotton round neck t-shirt. Perfect for everyday wear and custom printing.',
        basePrice: 299,
        category: 'round-neck',
        colors: [
          { name: 'White', hex: '#FFFFFF', stock: 100 },
          { name: 'Black', hex: '#000000', stock: 100 },
          { name: 'Navy Blue', hex: '#1a237e', stock: 80 },
          { name: 'Red', hex: '#c62828', stock: 60 }
        ],
        sizes: [
          { size: 'XS', additionalPrice: 0 },
          { size: 'S', additionalPrice: 0 },
          { size: 'M', additionalPrice: 0 },
          { size: 'L', additionalPrice: 20 },
          { size: 'XL', additionalPrice: 30 },
          { size: 'XXL', additionalPrice: 50 }
        ],
        printAreas: [
          { name: 'front', additionalPrice: 0 },
          { name: 'back', additionalPrice: 50 },
          { name: 'left-sleeve', additionalPrice: 30 },
          { name: 'right-sleeve', additionalPrice: 30 }
        ],
        bulkPricing: [{ minQty: 10, discount: 10 }, { minQty: 50, discount: 20 }],
        tags: ['cotton', 'basic', 'casual', 'round-neck'],
        images: [{ url: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Round+Neck', alt: 'Round Neck T-Shirt' }]
      },
      {
        name: 'Premium Polo T-Shirt',
        description: 'High-quality 220 GSM pique cotton polo shirt with collar. Great for corporate branding.',
        basePrice: 499,
        category: 'polo',
        colors: [
          { name: 'White', hex: '#FFFFFF', stock: 80 },
          { name: 'Black', hex: '#000000', stock: 80 },
          { name: 'Royal Blue', hex: '#1565c0', stock: 60 }
        ],
        sizes: [
          { size: 'S', additionalPrice: 0 }, { size: 'M', additionalPrice: 0 },
          { size: 'L', additionalPrice: 30 }, { size: 'XL', additionalPrice: 50 }, { size: 'XXL', additionalPrice: 70 }
        ],
        printAreas: [
          { name: 'front', additionalPrice: 0 }, { name: 'back', additionalPrice: 60 }
        ],
        bulkPricing: [{ minQty: 10, discount: 12 }, { minQty: 50, discount: 22 }],
        tags: ['polo', 'corporate', 'premium'],
        images: [{ url: 'https://via.placeholder.com/400x400/1565c0/FFFFFF?text=Polo+Shirt', alt: 'Polo T-Shirt' }]
      },
      {
        name: 'V-Neck Cotton T-Shirt',
        description: 'Stylish 160 GSM combed cotton V-neck t-shirt. Slim fit design.',
        basePrice: 349,
        category: 'v-neck',
        colors: [
          { name: 'White', hex: '#FFFFFF', stock: 70 },
          { name: 'Black', hex: '#000000', stock: 70 },
          { name: 'Grey', hex: '#9e9e9e', stock: 50 }
        ],
        sizes: [
          { size: 'XS', additionalPrice: 0 }, { size: 'S', additionalPrice: 0 },
          { size: 'M', additionalPrice: 0 }, { size: 'L', additionalPrice: 25 },
          { size: 'XL', additionalPrice: 40 }
        ],
        printAreas: [{ name: 'front', additionalPrice: 0 }, { name: 'back', additionalPrice: 50 }],
        bulkPricing: [{ minQty: 10, discount: 10 }],
        tags: ['v-neck', 'slim-fit', 'casual'],
        images: [{ url: 'https://via.placeholder.com/400x400/9e9e9e/FFFFFF?text=V-Neck', alt: 'V-Neck T-Shirt' }]
      },
      {
        name: 'Pullover Hoodie',
        description: '300 GSM fleece pullover hoodie. Perfect for winters with custom print.',
        basePrice: 899,
        category: 'hoodie',
        colors: [
          { name: 'Black', hex: '#000000', stock: 60 },
          { name: 'Navy', hex: '#1a237e', stock: 40 },
          { name: 'Grey', hex: '#616161', stock: 50 }
        ],
        sizes: [
          { size: 'S', additionalPrice: 0 }, { size: 'M', additionalPrice: 0 },
          { size: 'L', additionalPrice: 50 }, { size: 'XL', additionalPrice: 80 }, { size: 'XXL', additionalPrice: 100 }
        ],
        printAreas: [{ name: 'front', additionalPrice: 0 }, { name: 'back', additionalPrice: 80 }],
        bulkPricing: [{ minQty: 5, discount: 8 }, { minQty: 20, discount: 15 }],
        tags: ['hoodie', 'winter', 'fleece'],
        images: [{ url: 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Hoodie', alt: 'Pullover Hoodie' }]
      }
    ];
    await Product.insertMany(products);
    res.json({ message: `${products.length} products seeded successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
