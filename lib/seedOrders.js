const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

const baseOrder = {
  userData: {
    id: '6600340879941294c2823be7',
    name: 'Jane Doe',
    email: 'user@test.com',
    phone: '068245456501',
    shippingInfo: {
      address: 'Nezalezhnosty St.',
      city: 'Brovary',
      country: 'UA',
      state: '32',
      zip: '07400'
    }
  },
  orderItems: [
    {
      id: '65edf11ead2f299753cb31a1',
      title: 'Apple MacBook Pro M2',
      image:
        'https://raw.githubusercontent.com/elian-cheng/online-store-elyte/main/src/assets/img/97875233511-l.jpg',
      price: 1223.75,
      quantity: 1
    }
  ],
  paymentInfo: {
    stripeId: 'pi_3PfQwdG34C1Ik0UU1ftzNCGc',
    status: 'succeeded'
  },
  totalPrice: 1223.75,
  orderStatus: 'Paid'
};

// const generateDates = (numOfOrders) => {
//   const dates = [];
//   for (let i = 0; i < numOfOrders; i++) {
//     const date = new Date();
//     date.setMonth(date.getMonth() - i); // Adjust this to set dates to different months/weeks
//     dates.push(date);
//   }
//   return dates;
// };

const generateDates = (numOfOrders) => {
  const dates = [];
  const startDate = new Date('2024-01-01T00:00:00Z');
  const endDate = new Date('2024-07-22T00:00:00Z'); // Generate orders until July 22, 2024
  const timeRange = endDate.getTime() - startDate.getTime();
  const interval = timeRange / numOfOrders;

  for (let i = 0; i < numOfOrders; i++) {
    const date = new Date(startDate.getTime() + i * interval);
    if (date < endDate) {
      dates.push(date);
    }
  }
  return dates;
};

const createOrders = async (numOfOrders) => {
  const dates = generateDates(numOfOrders);

  for (const date of dates) {
    const order = new Order({
      ...baseOrder,
      createdAt: date,
      updatedAt: date,
      paidAt: date // Set paidAt to the same date as createdAt
    });

    await order.save();
    console.log(`Order created for date: ${date}`);
  }
};

createOrders(50)
  .then(() => {
    console.log('Orders created successfully');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error creating orders:', err);
    mongoose.disconnect();
  });
