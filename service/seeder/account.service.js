const { faker, setSeedFaker } = require('#config/faker.config.js');
const Account = require('#models/account.model.js');

const seedAccount = () => {
  const isActive = faker.datatype.boolean();

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: 'hcmut.edu.vn' }),
    password: '12345678',
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(['Admin', 'User']),
    status: isActive ? 'Active' : 'Inactive',
    deleted: false
  };
};

const dbSeedAccount = async ({ total, seed }) => {
  if (seed) {
    setSeedFaker(seed);
  }

  const accounts = Array.from({ length: total }, () => new Account(seedAccount()));
  try {
    await Account.bulkSave(accounts);
  } catch (err) {
    console.log(
      '\x1b[36m%s\x1b[0m', //cyan
      '[SEEDING] Seeding failed. Drop the collection/database and try again? Or try another seed value.'
    );
    throw err;
  }
  console.log(`Seeded ${total} accounts with seed ${seed}`);
};

module.exports = dbSeedAccount;
