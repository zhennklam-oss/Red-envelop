export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET') {
    const envCheck = {
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      hasAdminKey: !!process.env.ADMIN_KEY,
      nodeVersion: process.version,
      vercelEnv: process.env.VERCEL_ENV || 'local',
    };

    res.status(200).json(envCheck);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
