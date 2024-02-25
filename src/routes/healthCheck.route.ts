import express from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';

const router = express.Router();

const healthCheck = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send('Health check passed');
});

router.route('/').get(
  healthCheck
  /*
    #swagger.summary = 'Health check'
    #swagger.tags = ['HealthCheck']

    #swagger.responses[200] = {
        description: 'Health check passed',
    }
    */
);

export default router;
