const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile'));

describe('Weather routes', function () {
  let token;

  before(function () {
    // Generiraj testni JWT token (prilagodi ključ prema authMiddleware-u)
    token = jwt.sign({ id: 1, role: 'user' }, 'test-secret', { expiresIn: '1h' });
  });

  describe('GET /weather-json', function () {
    it('should fetch data by weather', async function () {
      const resp = await global.api.get('/weather-json?vrijeme=kišovito')
        .expect(200);
      expect(resp.body.length > 0).to.be.true;
    });
  });

  describe('GET /weather-json', function () {
    it('should fetch data by country', async function () {
      const resp = await global.api.get('/weather-json?drzava=hrvatska')
        .expect(200);
      expect(resp.body.length > 0).to.be.true;
    });
  });

  describe('POST /weather', function () {
    it('should return 401 if no token is provided', async function () {
      const newWeather = {
        grad: 'Zagreb',
        drzava: 'Hrvatska',
        datum: '2023-10-25',
        temperatura: { min: 8, max: 15 },
        vrijeme: 'oblacno'
      };

      await global.api.post('/weather').send(newWeather).expect(401);
    });
  });
});
