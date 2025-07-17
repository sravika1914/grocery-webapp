/**************************************************************************
 *  Grocery Web‑App – Backend (Express + MongoDB)                         *
 *  index.js – revised 16 Jul 2025                                        *
 **************************************************************************/

require('dotenv').config();                    // 1️⃣  Load .env variables
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

const connectDB = require('./db/connect');     // 2️⃣  Mongo connection helper
const models    = require('./db/schema');      // 3️⃣  Mongoose models

const app  = express();
const PORT = process.env.PORT || 5100;

/* ───────────────────────────── MIDDLEWARE ───────────────────────────── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ──────────────────────  AUTH‑HELPER MIDDLEWARES  ───────────────────── */
const adminAuthenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, process.env.JWT_ADMIN_SECRET, (err, user) =>
    err ? res.status(403).send('Forbidden') : (req.user = user, next())
  );
};

const userAuthenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).send('Forbidden');
  }
};

/* ───────────────────────────  AUTH ROUTES  ──────────────────────────── */
// Admin register
app.post('/admin/register', async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!username) return res.status(400).send('Username is required');
    if (await models.Admins.findOne({ username }))
      return res.status(400).send('Username already exists');

    const hash = await bcrypt.hash(password, 10);
    await new models.Admins({ firstname, lastname, username, email, password: hash }).save();
    res.status(201).json({ message: 'Admin registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Admin login
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await models.Admins.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ userId: admin._id }, process.env.JWT_ADMIN_SECRET, { expiresIn: '3h' });
  res.json({ admin, token });
});

// User register
app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!username) return res.status(400).send('Username is required');
    if (await models.Users.findOne({ username }))
      return res.status(400).send('Username already exists');

    const hash = await bcrypt.hash(password, 10);
    await new models.Users({ firstname, lastname, username, email, password: hash }).save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await models.Users.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_USER_SECRET, { expiresIn: '3h' });
  res.json({ user, token });
});

/* ─────────────────────────  CATEGORY ROUTES  ────────────────────────── */
app.post('/categories', adminAuthenticateToken, async (req, res) => {
  try {
    const { category, description } = req.body;
    if (!category) return res.status(400).send('Category is required');
    if (await models.Category.findOne({ category }))
      return res.status(400).send('Category already exists');

    const saved = await new models.Category({ category, description }).save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/categories', async (_req, res) => {
  try {
    res.json(await models.Category.find());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/* ───────────────────────────  PRODUCT ROUTES  ───────────────────────── */
app.post('/products', adminAuthenticateToken, async (req, res) => {
  try {
    const { productname, description, price, image, category,
            countInStock, rating } = req.body;

    if (![productname, description, price, image, category, countInStock, rating].every(Boolean))
      return res.status(400).send('All product fields are required');

    const saved = await new models.Product({
      productname, description, price, image,
      category, countInStock, rating,
      dateCreated: new Date()
    }).save();

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/products', async (_req, res) => {
  try {
    res.json(await models.Product.find());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.route('/products/:id')
  .get(async (req, res) => {
    const product = await models.Product.findById(req.params.id);
    product ? res.json(product) : res.status(404).send('Product not found');
  })
  .put(adminAuthenticateToken, async (req, res) => {
    const updated = await models.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updated ? res.json(updated) : res.status(404).send('Product not found');
  })
  .delete(adminAuthenticateToken, async (req, res) => {
    const deleted = await models.Product.findByIdAndDelete(req.params.id);
    deleted ? res.json({ message: 'Product deleted' }) : res.status(404).send('Product not found');
  });

/* ─────────────────────────────  CART ROUTES  ────────────────────────── */
app.post('/cart', userAuthenticateToken, async (req, res) => {
  try {
    const { productId, productName, quantity = 1 } = req.body;
    const item = await new models.AddToCart({
      userId: req.user.id, productId, productName, quantity
    }).save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/cart', userAuthenticateToken, async (req, res) => {
  try {
    const cartItems = await models.AddToCart.find({ userId: req.user.id });
    const products   = await models.Product.find({ _id: { $in: cartItems.map(i => i.productId) } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.delete('/cart/:productId', userAuthenticateToken, async (req, res) => {
  try {
    const result = await models.AddToCart.deleteOne({ userId: req.user.id, productId: req.params.productId });
    result.deletedCount ? res.json({ message: 'Removed from cart' })
                        : res.status(404).send('Item not found');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/* ─────────────────────────────  ORDER ROUTES  ───────────────────────── */
app.post('/orders', userAuthenticateToken, async (req, res) => {
  try {
    const { firstname, lastname, phone, productId,
            quantity, paymentMethod, address } = req.body;
    const product = await models.Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const amount = product.price * quantity;
    const order = await new models.Order({
      firstname, lastname, user: req.user.id, phone,
      productId, productName: product.productname,
      quantity, paymentMethod, address, price: amount
    }).save();

    await new models.Payment({
      user: req.user.id, name: `${firstname} ${lastname}`,
      order: order._id, amount,
      deliveryStatus: order.status, paymentMethod, status: 'Pending'
    }).save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/orders', adminAuthenticateToken, async (_req, res) => {
  try {
    res.json(await models.Order.find());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/my-orders', userAuthenticateToken, async (req, res) => {
  try {
    res.json(await models.Order.find({ user: req.user.id }));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/* ───────────────────────────  FEEDBACK ROUTES  ──────────────────────── */
app.post('/feedback', userAuthenticateToken, async (req, res) => {
  try {
    const saved = await new models.Feedback({
      user: req.user.id, message: req.body.message
    }).save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/feedback', adminAuthenticateToken, async (_req, res) => {
  try {
    res.json(await models.Feedback.find());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

/* ─────────────────────────  SERVER & DB BOOTSTRAP  ──────────────────── */
(async () => {
  try {
    await connectDB();                          // Connect to MongoDB first
    app.listen(PORT, () =>
      console.log(`🚀  Server ready at http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    process.exit(1);
  }
})();

module.exports = app; // for testing
