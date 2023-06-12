const router = require('express').Router();
const { models: { User, Order, OrderItems, Product }} = require('../db');

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    console.log('Fetching users from the database');
    const users = await User.findAll({
      order: ['id'],
      attributes: ['id', 'username', 'email', 'address', 'imgUrl']
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'address', 'imgUrl']
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id/edit
router.put('/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'address', 'imgUrl']
    });
    user.set(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'address', 'imgUrl']
    });
    await user.destroy();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// GET /api/users/:id/cart
router.get('/:id/cart', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'address', 'imgUrl']
    });
    const order = await Order.findOne({
      where: {
        userId: user.id,
        isFulfilled: false
      }
    });
    const orderItems = await OrderItems.findAll({
      where: {
        orderId: order.id
      }
    });
    const fullOrder = {
      cartInfo: order,
      orderItems
    };
    res.json(fullOrder);
  } catch (error) {
    next(error);
  }
});

// POST /api/users/:id/cart/add
router.post('/:id/cart/add', async (req, res, next) => {
  try {
    const { quantity, productId, orderId } = req.body;
    const orderItem = await OrderItems.findOne({
      where: { productId, orderId }
    });
    const product = await Product.findOne({
      where: {
        id: productId
      }
    });
    const order = await Order.findOne({
      where: {
        id: orderId,
        isFulfilled: false
      }
    });
    if (orderItem) {
      OrderItems.increment(
        'quantity', { by: quantity, where: {
          productId,
          orderId
        }}
      );
      order.total += product.price * quantity;
      await order.save();
      await orderItem.save();
    } else {
      const newOrderItem = await OrderItems.create({
        quantity,
        productId,
        orderId
      });
      order.total += product.price * quantity;
      await order.save();
      res.json(newOrderItem);
    }
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// PUT /api/users/:id/cart/editCart
router.put('/:id/cart/editCart', async (req, res, next) => {
  try {
    const { quantity, productId, orderId } = req.body;
    const { id } = req.params;
    const order = await Order.findOne({
      where: {
        userId: id,
        isFulfilled: false
      }
    });
    const product = await Product.findByPk(productId);
    const orderItem = await OrderItems.findOne({
      where: {
        productId,
        orderId
      }
    });

    if (orderItem.quantity > quantity) {
      OrderItems.decrement(
        'quantity', { by: 1, where: {
          productId,
          orderId
        }}
      );
      order.total -= product.price;
      await order.save();
      await OrderItems.save();
    } else {
      OrderItems.increment(
        'quantity', { by: 1, where: {
          productId,
          orderId
        }}
      );
      order.total += product.price;
      await order.save();
      await orderItem.save();
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// PUT /api/users/:id/cart/remove
router.put('/:id/cart/remove', async (req, res, next) => {
  try {
    const { product } = req.body;
    const { id } = req.params;
    const order = await Order.findOne({
      where: {
        userId: id,
        isFulfilled: false
      }
    });
    const orderItemToDelete = await OrderItems.findOne({
      where: {
        orderId: order.id,
        productId: product.id
      }
    });

    if (!orderItemToDelete) {
      console.log('This item is not in your cart!');
    } else {
      order.total -= orderItemToDelete.quantity * product.price;
      await order.save();
      await orderItemToDelete.destroy();
      const orderItems = await OrderItems.findAll({
        where: {
          orderId: order.id
        }
      });
      res.json(orderItems);
    }
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// PUT /api/users/:id/completeOrder
router.put('/:id/completeOrder', async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: {
        userId: id,
        isFulfilled: false
      }
    });

    order.isFulfilled = true;
    await order.save();

    const newOrder = await Order.create({
      userId: id,
      total: 0,
      isFulfilled: false
    });

    const orderItems = await OrderItems.findAll({
      where: {
        orderId: newOrder.id
      }
    });

    const fullOrder = {
      cartInfo: newOrder,
      orderItems
    };
  
    res.json(fullOrder);
  } catch(err) {
    console.error(err.message);
    next(err);
  }
});

module.exports = router;

