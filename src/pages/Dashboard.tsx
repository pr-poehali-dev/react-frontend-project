import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { imagesApi } from '@/api/images';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: images } = useQuery({
    queryKey: ['images'],
    queryFn: () => imagesApi.getImages(),
  });

  const { data: detections } = useQuery({
    queryKey: ['detections'],
    queryFn: () => imagesApi.getDetections(),
  });

  const stats = {
    totalImages: images?.length || 0,
    totalDetections: detections?.length || 0,
    processingImages: images?.filter(img => img.status === 'processing').length || 0,
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
          <p className="text-muted-foreground">Общая статистика и быстрые действия</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Icon name="Images" size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего изображений</p>
                <p className="text-3xl font-bold">{stats.totalImages}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Icon name="Target" size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Детекций</p>
                <p className="text-3xl font-bold">{stats.totalDetections}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Icon name="Clock" size={24} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">В обработке</p>
                <p className="text-3xl font-bold">{stats.processingImages}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Icon name="Upload" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Загрузить фото</h3>
              <p className="text-sm text-muted-foreground">
                Загрузите одно или несколько изображений
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/export')}>
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Icon name="Download" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Экспортировать</h3>
              <p className="text-sm text-muted-foreground">
                Скачайте данные в различных форматах
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/images')}>
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Icon name="Image" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Галерея</h3>
              <p className="text-sm text-muted-foreground">
                Просмотрите все загруженные изображения
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;