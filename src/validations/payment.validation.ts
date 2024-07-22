import Joi from 'joi';

const processPayment = {
  body: Joi.object().keys({
    amount: Joi.number().required()
  })
};

export default {
  processPayment
};
