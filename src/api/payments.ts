import axios from 'axios';
import toast from 'react-hot-toast';

interface IPaymentIntent {
  clientSecret: string;
}

export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await axios.post<IPaymentIntent>('/payments/process', {
      amount,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response: { data: { message: string } } };
    toast.error(err.response.data.message);
  }
};
