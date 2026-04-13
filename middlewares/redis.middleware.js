import redisClient from '../config/redis.js';

export const cache = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json;

      res.json = async (body) => {
        await redisClient.setEx(key, duration, JSON.stringify(body));
        originalJson.call(res, body);
      };

      next();
    } catch (error) {
      console.log("Cache error:", error);
      next();
    }
  };
};