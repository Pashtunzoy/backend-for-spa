import dotenv from 'dotenv';
dotenv.config();

export default {
  'secret': 'I<3AFG',
  'database': process.env.MONGODB_URI
};
