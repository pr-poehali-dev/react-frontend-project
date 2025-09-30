# Руководство разработчика

## Структура проекта

```
src/
├── api/                    # API клиенты и мок-данные
│   ├── auth.ts            # Авторизация
│   ├── images.ts          # Работа с изображениями
│   └── admin.ts           # Админ-функции
├── components/            # React компоненты
│   ├── layout/           # Компоненты макета
│   ├── ui/               # shadcn/ui компоненты
│   ├── FileUploader.tsx  # Загрузчик файлов
│   ├── ImageCard.tsx     # Карточка изображения
│   └── ProtectedRoute.tsx # Защищённые маршруты
├── context/              # React Context
│   └── AuthContext.tsx   # Контекст авторизации
├── pages/                # Страницы приложения
│   ├── Index.tsx        # Главная (поиск)
│   ├── Dashboard.tsx    # Панель управления
│   ├── Images.tsx       # Галерея
│   ├── ImageDetails.tsx # Детали изображения
│   ├── Detections.tsx   # Список детекций
│   ├── History.tsx      # История поиска
│   ├── Export.tsx       # Экспорт данных
│   ├── Profile.tsx      # Профиль
│   ├── Login.tsx        # Вход
│   └── Register.tsx     # Регистрация
├── App.tsx              # Главный компонент
└── main.tsx             # Точка входа
```

## Добавление новой страницы

1. Создайте компонент в `src/pages/`:

```typescript
// src/pages/NewPage.tsx
import { MainLayout } from '@/components/layout/MainLayout';

const NewPage = () => {
  return (
    <MainLayout>
      <div>Your content</div>
    </MainLayout>
  );
};

export default NewPage;
```

2. Добавьте маршрут в `src/App.tsx`:

```typescript
import NewPage from "./pages/NewPage";

// В Routes:
<Route path="/new-page" element={<NewPage />} />
```

3. Добавьте ссылку в навигацию `src/components/layout/Header.tsx`:

```typescript
<Link to="/new-page" className="text-sm font-medium hover:text-primary transition-colors">
  New Page
</Link>
```

## Работа с формами

Используем React Hook Form + Yup для валидации:

```typescript
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6).required('Required'),
});

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    // handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

## Работа с API через React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { imagesApi } from '@/api/images';

// GET запрос
const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['images'],
    queryFn: () => imagesApi.getImages(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return <div>{data.map(...)}</div>;
};

// POST/PUT/DELETE запрос
const MyComponent = () => {
  const mutation = useMutation({
    mutationFn: (file: File) => imagesApi.upload(file),
    onSuccess: () => {
      // invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  return (
    <Button onClick={() => mutation.mutate(file)}>
      Upload
    </Button>
  );
};
```

## Использование Toast уведомлений

```typescript
import { useToast } from '@/hooks/use-toast';

const MyComponent = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: 'Success',
      description: 'Action completed',
    });

    // Или для ошибки:
    toast({
      title: 'Error',
      description: 'Something went wrong',
      variant: 'destructive',
    });
  };

  return <Button onClick={handleAction}>Action</Button>;
};
```

## Работа с иконками

Используем lucide-react через компонент-обёртку:

```typescript
import Icon from '@/components/ui/icon';

<Icon name="Home" size={24} />
<Icon name="Settings" size={16} className="text-primary" />
<Icon name="CustomIcon" fallback="CircleAlert" size={20} />
```

## Стилизация с Tailwind CSS

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  condition && 'conditional-class',
  'hover:text-primary transition-colors'
)}>
  Content
</div>
```

## Защищённые маршруты

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/protected" 
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  } 
/>
```

## Переменные CSS

Все цвета определены в `src/index.css` как CSS переменные:

```css
--primary: 221 83% 53%;
--secondary: 210 40% 97.5%;
--accent: 221 83% 53%;
```

Используйте их в Tailwind:

```typescript
<div className="bg-primary text-primary-foreground">Content</div>
```

## Модальные окна и диалоги

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

## Тестирование в режиме разработки

Приложение работает с мок-данными, поэтому можно:

1. Загружать любые изображения
2. Использовать любой email/пароль для входа
3. Все данные сохраняются в localStorage
4. Моки возвращают задержанные Promise для имитации реальных запросов

## Production Build

```bash
# Сборка
npm run build

# Предпросмотр сборки
npm run preview
```

Результат будет в папке `dist/`.

## Рекомендации

1. **Компоненты**: Создавайте маленькие переиспользуемые компоненты
2. **Типизация**: Используйте TypeScript интерфейсы для API данных
3. **Состояние**: Предпочитайте React Query для серверного состояния
4. **Стили**: Используйте Tailwind классы вместо inline стилей
5. **Валидация**: Всегда валидируйте формы с Yup
6. **Ошибки**: Обрабатывайте ошибки с Toast уведомлениями
7. **Загрузка**: Показывайте loading состояния для асинхронных операций