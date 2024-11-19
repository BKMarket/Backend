const { fakerVI: faker } = require('@faker-js/faker');

const setSeedFaker = (seed = 123) => {
  faker.seed(seed);
};

module.exports = {
  faker,
  setSeedFaker
};
