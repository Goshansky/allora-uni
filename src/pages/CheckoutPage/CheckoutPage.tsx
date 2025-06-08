import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { cartService } from '../../services/cartService';
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
  const [orderError, setOrderError] = useState<string | null>(null);
  
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
  
  // If cart is empty, redirect to cart page
  if (!cart || cart.items.length === 0) {
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
    setOrderError(null);
    
    try {
      // Вызываем API для создания заказа
      await cartService.createOrder();
      
      // Очищаем корзину после успешного оформления заказа
      await clearCart();
      
      // Перенаправляем на страницу заказов
      navigate('/orders');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setOrderError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
      setIsProcessing(false);
    }
  };
  
  // Calculate delivery cost
  const deliveryCost = deliveryType === 'courier' ? 300 : 0;
  
  // Calculate total
  const totalCost = cart.total_price + deliveryCost;
  
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
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Комментарий к заказу
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Дополнительная информация по заказу"
                  />
                </label>
              </div>
              
              <div className={styles.formActions}>
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
              <h2 className={styles.sectionTitle}>Данные доставки</h2>
              
              <div className={styles.confirmationDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>ФИО:</span>
                  <span className={styles.detailValue}>{formData.fullName}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Телефон:</span>
                  <span className={styles.detailValue}>{formData.phone}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span className={styles.detailValue}>{formData.email}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Способ доставки:</span>
                  <span className={styles.detailValue}>
                    {deliveryType === 'courier' ? 'Курьером' : 'Самовывоз'}
                  </span>
                </div>
                
                {deliveryType === 'courier' && (
                  <>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Адрес:</span>
                      <span className={styles.detailValue}>{formData.address}</span>
                    </div>
                    
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Город:</span>
                      <span className={styles.detailValue}>{formData.city}</span>
                    </div>
                    
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Индекс:</span>
                      <span className={styles.detailValue}>{formData.postalCode}</span>
                    </div>
                  </>
                )}
                
                {formData.comment && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Комментарий:</span>
                    <span className={styles.detailValue}>{formData.comment}</span>
                  </div>
                )}
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
                    <span className={styles.optionTitle}>Банковской картой онлайн</span>
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
                  </div>
                </label>
              </div>
              
              {orderError && (
                <div className={styles.errorMessage}>
                  {orderError}
                </div>
              )}
              
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
        
        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Ваш заказ</h2>
          
          <div className={styles.orderItems}>
            {cart.items.map(item => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.itemImage}>
                  <img 
                    src={item.product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'} 
                    alt={item.product.title} 
                  />
                </div>
                
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{item.product.title}</div>
                  <div className={styles.itemQuantity}>{item.quantity} шт.</div>
                </div>
                
                <div className={styles.itemPrice}>
                  {(item.product.price * item.quantity).toLocaleString()} ₽
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Товары ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
              <span>{cart.total_price.toLocaleString()} ₽</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Доставка</span>
              <span>{deliveryCost > 0 ? `${deliveryCost} ₽` : 'Бесплатно'}</span>
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Итого:</span>
              <span>{totalCost.toLocaleString()} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 