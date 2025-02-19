const Router = require('@koa/router');
const Joi = require('joi');
const knex = require('knex')(require('../knexfile'));

const weatherRepo = require('../repo/weather');
const { body } = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const weatherData = require('../weather.json');

const router = new Router();

// 📌 JOI shema za validaciju vremenskih podataka
const weatherSchema = {
  grad: Joi.string().required(),
  drzava: Joi.string().required(),
  datum: Joi.string().isoDate().required(),
  temperatura: Joi.object({
    min: Joi.number().required(),
    max: Joi.number().required(),
  }).required(),
  vrijeme: Joi.string().required(),
};

// 📌 Ruta za popunjavanje tablice vremenskim podacima
router.post('/populate-weather-table', async (ctx) => {
  ctx.body = await weatherRepo.create();
});

// 📌 Ruta za dohvaćanje podataka iz `weather.json`
router.get('/weather-json', async (ctx) => {
  const { vrijeme, drzava } = ctx.query;
  let result = weatherData;

  if (vrijeme) {
    result = result.filter((entry) => entry.vrijeme.toLowerCase() === vrijeme.toLowerCase());
  }

  if (drzava) {
    result = result.filter((entry) => entry.drzava.toLowerCase() === drzava.toLowerCase());
  }

  ctx.body = result;
});

router.post(
    '/weather',
    authMiddleware(),
    body(weatherSchema), // Koristi 'body' umjesto 'validationMiddleware'
    async (ctx) => {
      const userId = ctx.state.user.id; // Dohvati userId iz tokena
      const weatherEntry = { ...ctx.request.body, userId };
  
      try {
        const newEntry = await weatherRepo.addWeather(weatherEntry);
        ctx.status = 201;
        ctx.body = { message: 'Weather entry added', data: newEntry };
      } catch (err) {
        console.error('Failed to insert weather data:', err);
        ctx.status = 500;
        ctx.body = { error: 'Failed to save weather data' };
      }
    }
  );
  
module.exports = router;
