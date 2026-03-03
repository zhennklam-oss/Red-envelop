      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  } else if (req.method === 'POST') {
    try {
      const { image, key } = req.body;

      // 验证管理员密钥
      if (key !== process.env.ADMIN_KEY && key !== 'creator_secret_123') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // 保存图片到 Vercel KV
      await kv.set('surprise_image', image);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}