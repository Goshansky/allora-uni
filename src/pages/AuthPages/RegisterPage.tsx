import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input.tsx';
import { Button } from '../../components/common/Button.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import styles from './AuthPages.module.css';
import type { UserCreate } from '../../types/models.ts';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<UserCreate>({
    email: '',
    username: '',
    password: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
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
    
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно содержать не менее 3 символов';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }
    
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
      await register(formData);
      navigate('/login');
    } catch (error) {
      setSubmitError('Не удалось зарегистрироваться. Попробуйте другое имя пользователя или email.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Регистрация</h1>
        
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
            label="Имя пользователя"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
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
          
          <Input
            label="Подтверждение пароля"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
          >
            Зарегистрироваться
          </Button>
        </form>
        
        <div className={styles.footer}>
          <p>
            Уже есть аккаунт? <Link to="/login" className={styles.link}>Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}; 