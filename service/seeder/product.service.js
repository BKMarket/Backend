const { faker, setSeedFaker } = require('#config/faker.config.js');
const mongoose = require('#config/db/customMongoose.js');
const Account = require('#models/account.model.js');
const Product = require('#models/product.model.js');

const getAccounts = async () => {
  const accountIDs = await Account.find({ role: 'User' }).select('_id');

  return { accountIDs };
};

const seedProduct = async (accounts) => {
  const accountsAmount = accounts.length;

  return {
    approved: faker.datatype.boolean(),
    title:
      faker.commerce.productName() +
      ' ' +
      faker.commerce.productAdjective() +
      ' ' +
      faker.commerce.productMaterial() +
      ' ' +
      faker.commerce.product(),
    tag: faker.helpers.arrayElements(
      [
        'Thân thiện với môi trường',
        'Tự làm',
        'Hữu cơ',
        'Giảm giá',
        'Sản phẩm mới',
        'Phiên bản giới hạn',
        'Sang trọng',
        'Xu hướng',
        'Bán chạy nhất',
        'Đang giảm giá',
        'Ý tưởng quà tặng',
        'Mùa vụ',
        'Cổ điển',
        'Hạng sang',
        'Giá hợp lý',
        'Độc quyền',
        'Có thể tùy chỉnh',
        'Phải có',
        'Sáng tạo',
        'Thân thiện với gia đình',
        'Thuần chay',
        'Không có gluten',
        'Dành cho trẻ em',
        'Dành cho thú cưng',
        'Dụng cụ phiêu lưu',
        'Vật dụng gia đình',
        'Ngoài trời',
        'Nơi làm việc',
        'Công nghệ',
        'Thể thao'
      ],
      { min: 2, max: 5 }
    ),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 1, max: 1000, decimal: 0 }) * 1000,
    discountPercentage: faker.number.int({ min: 0, max: 60 }),
    stock: faker.number.int({ min: 10, max: 200 }),
    sold: faker.number.int({ min: 0, max: 100 }),
    thumbnail: faker.image.urlPicsumPhotos(),
    images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
      faker.image.urlPicsumPhotos()
    ),
    createdBy: new mongoose.Types.ObjectId(
      accounts[faker.number.int({ min: 0, max: accountsAmount - 1 })]
    ),
    createdAt: faker.date.past(),
    lastModifiedAt: faker.date.recent({ days: 30 })
  };
};

const dbSeedProduct = async ({ total, seed }) => {
  const accounts = await getAccounts();

  if (seed) {
    setSeedFaker(seed);
  }

  const productsPromises = Array.from({ length: total }).map(() => seedProduct(accounts));
  const products = (await Promise.all(productsPromises)).map((product) => new Product(product));

  try {
    await Product.bulkSave(products);
  } catch (err) {
    console.log(
      '\x1b[36m%s\x1b[0m', //cyan
      '[SEEDING] Seeding failed. Drop the collection/database and try again? Or try another seed value.'
    );
    throw err;
  }
  console.log(`Seeded ${total} products with seed ${seed}`);
};

module.exports = dbSeedProduct;
