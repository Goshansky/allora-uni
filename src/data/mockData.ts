import type { Category, Product, User, Review, Favorite, Cart, AuthTokens, Order } from '../types/models';
import { OrderStatus } from '../types/models';

// Моковые категории
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Электроника',
    description: 'Компьютеры, ноутбуки, смартфоны и другие электронные устройства',
    image_url: 'https://worldoftrucks.ru/wp-content/uploads/2020/03/Festival_discount.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Одежда',
    description: 'Мужская и женская одежда, обувь, аксессуары',
    image_url: 'https://media.istockphoto.com/id/1341889105/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D1%8B%D0%B9-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%82-%D0%B7%D0%B8%D0%BC%D0%BD%D0%B5%D0%B9-%D0%BE%D0%B4%D0%B5%D0%B6%D0%B4%D1%8B-%D0%BF%D0%B0%D0%BB%D1%8C%D1%82%D0%BE-%D1%88%D0%B0%D0%BF%D0%BA%D0%B8-%D0%BF%D0%B5%D1%80%D1%87%D0%B0%D1%82%D0%BA%D0%B8-%D0%BE%D0%B1%D1%83%D0%B2%D1%8C-%D0%B8-%D0%BD%D0%BE%D1%81%D0%BA%D0%B8.jpg?s=612x612&w=0&k=20&c=A-lykxMMnrGoS9J_OjvUdvgGWJIJe2j1_74mvbSeUTU=',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Дом и сад',
    description: 'Мебель, декор, садовый инвентарь и техника для дома',
    image_url: 'https://png.pngtree.com/thumb_back/fh260/background/20190222/ourmid/pngtree-romantic-garden-house-advertising-background-backgroundgrasslandsmall-flowerhousesblue-skymountain-image_60725.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Книги',
    description: 'Художественная литература, учебники, научные издания',
    image_url: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg?semt=ais_hybrid&w=740',
    created_at: new Date().toISOString()
  }
];

// Моковые продукты
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Смартфон Супер X',
    description: 'Мощный смартфон с отличной камерой и производительностью',
    price: 29999,
    image_url: 'https://orp-ohrana.ru/upload/iblock/0b0/8tzh85ms5i4278ppv4msc0mytk8ff0ja.jpg',
    stock: 15,
    category_id: 1,
    category: mockCategories[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Ноутбук ProBook 5000',
    description: 'Профессиональный ноутбук для работы и развлечений',
    price: 59999,
    image_url: 'https://holod.ru/pics/clean/medium/26/587426_0.jpg',
    stock: 7,
    category_id: 1,
    category: mockCategories[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Джинсы Classic Fit',
    description: 'Классические джинсы прямого кроя',
    price: 2999,
    image_url: 'https://ir.ozone.ru/s3/multimedia-1-s/wc1000/7219952092.jpg',
    stock: 30,
    category_id: 2,
    category: mockCategories[1],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Футболка Basic',
    description: 'Базовая хлопковая футболка',
    price: 999,
    image_url: 'https://the-cave.ru/upload/resize_cache/iblock/56d/640_1492_1/b8n2naqtdyjgjng0bdrk9g15hv1il1le.jpg',
    stock: 50,
    category_id: 2,
    category: mockCategories[1],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Диван Modern',
    description: 'Современный диван для гостиной',
    price: 35999,
    image_url: 'https://imodern.ru/upload/iblock/96d/80tt02m8ow4exy3z847ghaigxyulkxp5.jpg',
    stock: 5,
    category_id: 3,
    category: mockCategories[2],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Настольная лампа Light Pro',
    description: 'Стильная настольная лампа с регулировкой яркости',
    price: 1599,
    image_url: 'https://basket-03.wbbasket.ru/vol360/part36093/36093779/images/big/1.webp',
    stock: 20,
    category_id: 3,
    category: mockCategories[2],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Роман "Великий Гэтсби"',
    description: 'Классический роман Ф.С. Фицджеральда',
    price: 599,
    image_url: 'https://via.placeholder.com/500x500?text=Книга',
    stock: 40,
    category_id: 4,
    category: mockCategories[3],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Учебник по программированию',
    description: 'Полное руководство по современному программированию',
    price: 1299,
    image_url: 'https://via.placeholder.com/500x500?text=Учебник',
    stock: 15,
    category_id: 4,
    category: mockCategories[3],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Моковые пользователи
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'user@example.com',
    username: 'user',
    is_active: true,
    is_admin: false,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    email: 'admin@example.com',
    username: 'admin',
    is_active: true,
    is_admin: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    email: 'ivan@example.com',
    username: 'ivan',
    is_active: true,
    is_admin: false,
    created_at: new Date().toISOString()
  }
];

// Для обратной совместимости
export const mockUser = mockUsers[0];

// Моковые токены авторизации
export const mockAuthTokens: Record<string, AuthTokens> = {
  'user': {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJ1c2VyIn0.token',
    refresh_token: 'refresh-token-user',
    token_type: 'bearer'
  },
  'admin': {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwidXNlcm5hbWUiOiJhZG1pbiJ9.token',
    refresh_token: 'refresh-token-admin',
    token_type: 'bearer'
  },
  'ivan': {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwidXNlcm5hbWUiOiJpdmFuIn0.token',
    refresh_token: 'refresh-token-ivan',
    token_type: 'bearer'
  }
};

// Моковые отзывы
export const mockReviews: Review[] = [
  {
    id: 1,
    product_id: 1,
    user_id: 1,
    user: mockUsers[0],
    rating: 5,
    comment: 'Отличный смартфон, очень доволен покупкой!',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    product_id: 2,
    user_id: 1,
    user: mockUsers[0],
    rating: 4,
    comment: 'Хороший ноутбук, но немного шумный при нагрузке.',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    product_id: 3,
    user_id: 1,
    user: mockUsers[0],
    rating: 5,
    comment: 'Идеально сидит, качество отличное.',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    product_id: 1,
    user_id: 3,
    user: mockUsers[2],
    rating: 4,
    comment: 'Хороший смартфон за свои деньги.',
    created_at: new Date().toISOString()
  }
];

// Моковые избранные товары
export const mockFavorites: Favorite[] = [
  {
    id: 1,
    product_id: 1,
    product: mockProducts[0],
    user_id: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    product_id: 3,
    product: mockProducts[2],
    user_id: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    product_id: 2,
    product: mockProducts[1],
    user_id: 3,
    created_at: new Date().toISOString()
  }
];

// Моковая корзина для обычного пользователя
export const mockCart: Cart = {
  items: [
    {
      id: 1,
      product_id: 1,
      product: mockProducts[0],
      quantity: 1,
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      product_id: 4,
      product: mockProducts[3],
      quantity: 2,
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  total: 29999 + (999 * 2)
};

// Моковые заказы
export const mockOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    status: OrderStatus.DELIVERED,
    total: 32997,
    items: [
      {
        id: 1,
        product_id: 1,
        product: mockProducts[0],
        quantity: 1,
        price: 29999,
        order_id: 1
      },
      {
        id: 2,
        product_id: 3,
        product: mockProducts[2],
        quantity: 1,
        price: 2999,
        order_id: 1
      }
    ],
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 дней назад
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()  // 25 дней назад
  },
  {
    id: 2,
    user_id: 1,
    status: OrderStatus.PROCESSING,
    total: 1299,
    items: [
      {
        id: 3,
        product_id: 8,
        product: mockProducts[7],
        quantity: 1,
        price: 1299,
        order_id: 2
      }
    ],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 дня назад
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
]; 