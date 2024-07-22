const orderSchema = {
  _id: 'ObjectId',
  userData: {
    id: 'ObjectId',
    $name: 'User Name',
    $email: 'user@example.com',
    $phone: '123-456-7890',
    shippingInfo: {
      $address: '123 Main St',
      $city: 'City Name',
      $country: 'Country Name',
      $state: 'State Name',
      $zip: '12345'
    }
  },
  orderItems: [
    {
      id: 'ObjectId',
      $title: 'Product Name',
      $image: 'https://example.com/product-image.png',
      $price: 100.0,
      $quantity: 2
    }
  ],
  paymentInfo: {
    $stripeId: 'stripe-transaction-id',
    $status: 'Paid'
  },
  $totalPrice: 200.0,
  $orderStatus: 'Completed',
  $paidAt: '2021-01-01T00:00:00.000Z',
  $createdAt: '2021-01-01T00:00:00.000Z',
  $updatedAt: '2021-01-01T00:00:00.000Z'
};

module.exports = orderSchema;
