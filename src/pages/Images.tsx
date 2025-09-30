import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { imagesApi } from '@/api/images';

const Images = () => {
  const [source, setSource] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const { data: images, isLoading } = useQuery({
    queryKey: ['images', source, status],
    queryFn: () => imagesApi.getImages({
      source: source !== 'all' ? source : undefined,
      status: status !== 'all' ? status : undefined,
    }),
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Галерея изображений</h1>
          <p className="text-muted-foreground">Все загруженные изображения</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Поиск по имени файла..."
              className="w-full"
            />
          </div>

          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Источник" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все источники</SelectItem>
              <SelectItem value="upload">Загрузка</SelectItem>
              <SelectItem value="import">Импорт</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="done">Готово</SelectItem>
              <SelectItem value="processing">Обработка</SelectItem>
              <SelectItem value="queued">В очереди</SelectItem>
              <SelectItem value="failed">Ошибка</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Icon name="LayoutGrid" size={16} className="mr-2" />
            Сетка
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : images && images.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm">
                <Icon name="ChevronLeft" size={16} />
              </Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Icon name="ImageOff" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Нет изображений</h3>
            <p className="text-muted-foreground">Загрузите первое изображение для начала</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Images;