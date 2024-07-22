import Joi from 'joi';
import { CHECK_IMAGE_BUCKET } from '../utils/constants';
import { objectId } from './custom.validation';

const orderItemsSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required()
});

const shippingInfoSchema = Joi.object({
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.string().required()
});

const userDataSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  shippingInfo: shippingInfoSchema
});

const paymentInfoSchema = Joi.object({
  stripeId: Joi.string().required(),
  status: Joi.string().required()
});

export default {
  createOrder: {
    body: Joi.object({
      userData: userDataSchema,
      orderItems: Joi.array().items(orderItemsSchema).required(),
      paymentInfo: paymentInfoSchema,
      totalPrice: Joi.number().required(),
      orderStatus: Joi.string().required(),
      paidAt: Joi.date().required()
    })
  },
  getOrder: {
    params: Joi.object({
      orderId: Joi.string().required()
    })
  },
  updateOrder: {
    params: Joi.object({
      orderId: Joi.string().required()
    }),
    body: Joi.object({
      status: Joi.string().required()
    })
  },
  deleteOrder: {
    params: Joi.object({
      orderId: Joi.string().required()
    })
  }
};
