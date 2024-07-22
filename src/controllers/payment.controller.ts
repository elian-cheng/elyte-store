import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = catchAsync(async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        company: 'Elyte'
      }
    });
    res.status(httpStatus.OK).send({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Creating payment session failed');
  }
});

export default {
  createPaymentIntent
};
