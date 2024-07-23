const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const orderSchema = new mongoose.Schema(
  {
    userData: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String },
        zip: { type: String, required: true }
      }
    },
    orderItems: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    paymentInfo: {
      stripeId: { type: String, required: true },
      status: { type: String, required: true }
    },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, required: true, default: 'Processing' },
    paidAt: { type: Date, required: true },
    deliveredAt: { type: Date }
  },
  { collection: 'orders', timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

async function updateOrderStatuses() {
  try {
    // Connect to the MongoDB cluster
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to the database.');

    // Fetch orders with status 'Paid'
    const paidOrders = await Order.find({ orderStatus: 'Paid' });

    if (paidOrders.length === 0) {
      console.log('No orders with status "Paid" found.');
      return;
    }

    // Example: Change the status of some orders to different statuses
    const numberToUpdate = 50; // Number of orders to update
    const statuses = ['Shipped', 'Delivered', 'Processing'];

    for (let i = 0; i < numberToUpdate; i++) {
      const order = paidOrders[i];
      const newStatus = statuses[i % statuses.length];
      await Order.updateOne({ _id: order._id }, { $set: { orderStatus: newStatus } });
      console.log(`Updated order ${order._id} to status ${newStatus}`);
    }

    console.log('Statuses updated successfully.');
  } catch (error) {
    console.error('Error updating statuses:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateOrderStatuses();
