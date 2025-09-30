import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const profileSchema = yup.object().shape({
  name: yup.string().required('Имя обязательно'),
  email: yup.string().email('Некорректный email').required('Email обязателен'),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Текущий пароль обязателен'),
  newPassword: yup.string().min(6, 'Минимум 6 символов').required('Новый пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Пароли не совпадают')
    .required('Подтвердите пароль'),
});

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({
      title: 'Профиль обновлен',
      description: 'Ваши данные успешно сохранены',
    });
  };

  const onPasswordSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({
      title: 'Пароль изменен',
      description: 'Ваш пароль успешно обновлен',
    });
    resetPassword();
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Профиль</h1>
          <p className="text-muted-foreground">Управление вашим аккаунтом</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Роль: {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <h4 className="font-semibold mb-4">Личные данные</h4>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Имя</label>
                <Input
                  {...registerProfile('name')}
                  placeholder="Ваше имя"
                  className={profileErrors.name ? 'border-red-500' : ''}
                />
                {profileErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{profileErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  {...registerProfile('email')}
                  type="email"
                  placeholder="your@email.com"
                  className={profileErrors.email ? 'border-red-500' : ''}
                />
                {profileErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{profileErrors.email.message}</p>
                )}
              </div>

              <Button type="submit">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить изменения
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-4">Изменить пароль</h4>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Текущий пароль</label>
                <Input
                  {...registerPassword('currentPassword')}
                  type="password"
                  placeholder="••••••••"
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Новый пароль</label>
                <Input
                  {...registerPassword('newPassword')}
                  type="password"
                  placeholder="••••••••"
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Подтвердите новый пароль</label>
                <Input
                  {...registerPassword('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" variant="outline">
                <Icon name="Lock" size={16} className="mr-2" />
                Изменить пароль
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;