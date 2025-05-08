import type { Category, Product, User, Review, Favorite, Cart, AuthTokens, Order } from '../types/models';
import { OrderStatus } from '../types/models';

// Моковые категории
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Электроника',
    description: 'Компьютеры, ноутбуки, смартфоны и другие электронные устройства',
    image_url: 'https://via.placeholder.com/400x300?text=Электроника',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Одежда',
    description: 'Мужская и женская одежда, обувь, аксессуары',
    image_url: 'https://via.placeholder.com/400x300?text=Одежда',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Дом и сад',
    description: 'Мебель, декор, садовый инвентарь и техника для дома',
    image_url: 'https://via.placeholder.com/400x300?text=Дом+и+сад',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Книги',
    description: 'Художественная литература, учебники, научные издания',
    image_url: 'https://via.placeholder.com/400x300?text=Книги',
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
    image_url: 'https://via.placeholder.com/500x500?text=Смартфон',
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
    image_url: 'https://via.placeholder.com/500x500?text=Ноутбук',
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
    image_url: 'https://via.placeholder.com/500x500?text=Джинсы',
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
    image_url: 'https://via.placeholder.com/500x500?text=Футболка',
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
    image_url: 'https://via.placeholder.com/500x500?text=Диван',
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
    image_url: 'https://via.placeholder.com/500x500?text=Лампа',
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