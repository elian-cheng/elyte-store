import mongoose from 'mongoose';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(
      'mongodb+srv://elian:qcksw8XFNY8o3z2a@elyte.hymwsl8.mongodb.net/test?retryWrites=true&w=majority'
    );
  });

  beforeEach(async () => {
    await mongoose.connection.dropCollection('tokens');
    await mongoose.connection.dropCollection('users');
  });

  afterAll(async () => {
    await mongoose.connection.dropCollection('tokens');
    await mongoose.connection.dropCollection('users');
    await mongoose.disconnect();
  });
};

export default setupTestDB;
