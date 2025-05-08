import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { mockCart } from '../../data/mockData';
import styles from './CheckoutPage.module.css';

interface DeliveryFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  comment: string;
}

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, clearCart, isLoading: cartLoading } = useCart();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [deliveryType, setDeliveryType] = useState<'courier' | 'pickup'>('courier');
  
  const [formData, setFormData] = useState<DeliveryFormData>({
    fullName: user?.username || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    comment: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (authLoading || cartLoading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }
  
  // Use cart from context or mock data
  const cartData = cart || mockCart;
  
  // If cart is empty, redirect to cart page
  if (!cartData || cartData.items.length === 0) {
    return <Navigate to="/cart" />;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите ФИО';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^\+?[0-9\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    if (deliveryType === 'courier') {
      if (!formData.address.trim()) {
        newErrors.address = 'Введите адрес доставки';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'Введите город';
      }
      
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Введите почтовый индекс';
      } else if (!/^\d{6}$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Некорректный почтовый индекс';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateForm()) {
      setStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call to create order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart
      await clearCart();
      
      // Redirect to success page or orders page
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      setIsProcessing(false);
    }
  };
  
  // Calculate delivery cost
  const deliveryCost = deliveryType === 'courier' ? 300 : 0;
  
  // Calculate total
  const totalCost = cartData.total + deliveryCost;
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Оформление заказа</h1>
      
      <div className={styles.steps}>
        <div className={`${styles.step} ${step === 1 ? styles.activeStep : ''} ${step > 1 ? styles.completedStep : ''}`}>
          1. Данные доставки
        </div>
        <div className={`${styles.step} ${step === 2 ? styles.activeStep : ''}`}>
          2. Подтверждение и оплата
        </div>
      </div>
      
      <div className={styles.checkout}>
        <div className={styles.checkoutForm}>
          {step === 1 ? (
            <div className={styles.deliveryForm}>
              <h2 className={styles.sectionTitle}>Контактная информация</h2>
              
              <div className={styles.formGroup}>
                <Input
                  label="ФИО"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
                
                <Input
                  label="Телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
              </div>
              
              <h2 className={styles.sectionTitle}>Способ доставки</h2>
              
              <div className={styles.deliveryOptions}>
                <label className={`${styles.option} ${deliveryType === 'courier' ? styles.selectedOption : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="courier"
                    checked={deliveryType === 'courier'}
                    onChange={() => setDeliveryType('courier')}
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionTitle}>Курьером</span>
                    <span className={styles.optionPrice}>300 ₽</span>
                  </div>
                </label>
                
                <label className={`${styles.option} ${deliveryType === 'pickup' ? styles.selectedOption : ''}`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={() => setDeliveryType('pickup')}
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionTitle}>Самовывоз</span>
                    <span className={styles.optionPrice}>Бесплатно</span>
                  </div>
                </label>
              </div>
              
              {deliveryType === 'courier' && (
                <div className={styles.addressFields}>
                  <Input
                    label="Адрес"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    required
                  />
                  
                  <div className={styles.row}>
                    <Input
                      label="Город"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      required
                    />
                    
                    <Input
                      label="Почтовый индекс"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      error={errors.postalCode}
                      required
                    />
                  </div>
                </div>
              )}
              
              {deliveryType === 'pickup' && (
                <div className={styles.pickupInfo}>
                  <p>Вы можете забрать заказ по адресу:</p>
                  <p className={styles.pickupAddress}>г. Москва, ул. Примерная, д. 123</p>
                  <p>Режим работы: Пн-Пт с 10:00 до 20:00, Сб-Вс с 11:00 до 18:00</p>
                </div>
              )}
              
              <div className={styles.commentField}>
                <label className={styles.commentLabel}>
                  Комментарий к заказу:
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className={styles.comment}
                    rows={3}
                  />
                </label>
              </div>
              
              <div className={styles.formActions}>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/cart')}
                >
                  Вернуться в корзину
                </Button>
                
                <Button 
                  variant="primary" 
                  onClick={handleNextStep}
                >
                  Продолжить
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.confirmationForm}>
              <h2 className={styles.sectionTitle}>Подтверждение заказа</h2>
              
              <div className={styles.orderSummary}>
                <h3 className={styles.summaryTitle}>Ваш заказ</h3>
                
                <div className={styles.orderItems}>
                  {cartData.items.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.itemName}>
                        {item.product.name}
                        <span className={styles.itemQuantity}>× {item.quantity}</span>
                      </div>
                      <div className={styles.itemTotal}>
                        {(item.product.price * item.quantity).toLocaleString()} ₽
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.orderTotals}>
                  <div className={styles.totalRow}>
                    <span>Сумма заказа:</span>
                    <span>{cartData.total.toLocaleString()} ₽</span>
                  </div>
                  
                  <div className={styles.totalRow}>
                    <span>Доставка:</span>
                    <span>{deliveryType === 'courier' ? '300 ₽' : 'Бесплатно'}</span>
                  </div>
                  
                  <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                    <span>Итого к оплате:</span>
                    <span>{totalCost.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.deliverySummary}>
                <h3 className={styles.summaryTitle}>Данные доставки</h3>
                
                <div className={styles.summaryInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ФИО:</span>
                    <span className={styles.infoValue}>{formData.fullName}</span>
                  </div>
                  
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Телефон:</span>
                    <span className={styles.infoValue}>{formData.phone}</span>
                  </div>
                  
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{formData.email}</span>
                  </div>
                  
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Способ доставки:</span>
                    <span className={styles.infoValue}>
                      {deliveryType === 'courier' ? 'Курьером' : 'Самовывоз'}
                    </span>
                  </div>
                  
                  {deliveryType === 'courier' && (
                    <>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Адрес:</span>
                        <span className={styles.infoValue}>{formData.address}</span>
                      </div>
                      
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Город:</span>
                        <span className={styles.infoValue}>{formData.city}</span>
                      </div>
                      
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Индекс:</span>
                        <span className={styles.infoValue}>{formData.postalCode}</span>
                      </div>
                    </>
                  )}
                  
                  {formData.comment && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Комментарий:</span>
                      <span className={styles.infoValue}>{formData.comment}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <h2 className={styles.sectionTitle}>Способ оплаты</h2>
              
              <div className={styles.paymentOptions}>
                <label className={`${styles.option} ${paymentMethod === 'card' ? styles.selectedOption : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionTitle}>Банковской картой</span>
                    <span className={styles.optionDescription}>Visa, MasterCard, МИР</span>
                  </div>
                </label>
                
                <label className={`${styles.option} ${paymentMethod === 'cash' ? styles.selectedOption : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                  <div className={styles.optionContent}>
                    <span className={styles.optionTitle}>Наличными при получении</span>
                    <span className={styles.optionDescription}>Оплата курьеру или в пункте выдачи</span>
                  </div>
                </label>
              </div>
              
              <div className={styles.formActions}>
                <Button 
                  variant="secondary" 
                  onClick={handlePrevStep}
                >
                  Назад
                </Button>
                
                <Button 
                  variant="primary" 
                  onClick={handleSubmitOrder}
                  isLoading={isProcessing}
                >
                  Оформить заказ
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.orderSummaryCard}>
          <h2 className={styles.summaryTitle}>Ваш заказ</h2>
          
          <div className={styles.summaryContent}>
            <div className={styles.summaryItems}>
              {cartData.items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
            
            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Товары ({cartData.items.reduce((sum, item) => sum + item.quantity, 0)} шт.):</span>
                <span>{cartData.total.toLocaleString()} ₽</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Доставка:</span>
                <span>{deliveryType === 'courier' ? '300 ₽' : 'Бесплатно'}</span>
              </div>
              
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Итого:</span>
                <span>{totalCost.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 