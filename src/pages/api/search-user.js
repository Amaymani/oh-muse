
import User from '@/lib/models/user';
import dbConnect from '@/lib/dbConnect'

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    await dbConnect();
    const users = await User.find(
      { username: { $regex: query, $options: 'i' } }, 
      { username: 1 }
    ).limit(10); 
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}