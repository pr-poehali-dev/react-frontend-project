import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <Icon name="Image" size={24} />
          <span>ImageSearch</span>
        </Link>

        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Поиск
              </Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/images" className="text-sm font-medium hover:text-primary transition-colors">
                Галерея
              </Link>
              <Link to="/detections" className="text-sm font-medium hover:text-primary transition-colors">
                Детекции
              </Link>
              <Link to="/history" className="text-sm font-medium hover:text-primary transition-colors">
                История
              </Link>
              <Link to="/export" className="text-sm font-medium hover:text-primary transition-colors">
                Экспорт
              </Link>
              <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                Профиль
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выход
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Вход</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};