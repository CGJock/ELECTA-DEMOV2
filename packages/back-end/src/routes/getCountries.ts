import { Router, Request, Response } from 'express';
import redisClient from '@db/redis.js'; // asumiendo que aquí tienes tu cliente Redis configurado

const router = Router();

const COUNTRIES_KEY = 'countries_list';
const CACHE_TTL = 6 * 60 * 60; // 6 horas

router.get('/', async (req: Request, res: Response) => {
  try {
    // 1️ Buscar en cache
    const cached = await redisClient.get(COUNTRIES_KEY);
    if (cached) {
      console.log('Countries from cache');
      return res.json(JSON.parse(cached));
    }

    //  Si no está en cache, pedir a REST Countries
    console.log('Countries desde API externa');
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
    if (!response.ok) {
      throw new Error(`Error fetching countries: ${response.statusText}`);
    }

    const data = await response.json();

    const countries = data
      .map((c: any) => ({
        name: c.name.common,
        code: c.cca2
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    // Guardar en Redis con TTL
    await redisClient.set(COUNTRIES_KEY, JSON.stringify(countries), 'EX', CACHE_TTL);

    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Error fetching countries' });
  }
});

export default router;
