import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input.tsx';
import { Button } from '../../components/common/Button.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import styles from './AuthPages.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear submit error when user makes any change
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      setSubmitError('Неверный email или пароль');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Вход в аккаунт</h1>
        
        {submitError && (
          <div className={styles.error}>{submitError}</div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <Input
            label="Пароль"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
          >
            Войти
          </Button>
        </form>
        
        <div className={styles.footer}>
          <p>
            Нет аккаунта? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
}; 