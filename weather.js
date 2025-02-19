const db = require('../db')

async function create() {

  const data = require('../weather.json');

  for (const entry of data) {
    const { userId, grad, drzava, datum, vrijeme } = entry;
    await db('weather').insert({ userId, grad, drzava, datum, vrijeme });
  }

  return data;

}

module.exports = {
  create,
}