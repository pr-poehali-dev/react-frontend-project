import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { imagesApi } from '@/api/images';

const ImageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: image, isLoading } = useQuery({
    queryKey: ['image', id],
    queryFn: () => imagesApi.getImage(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Загрузка изображения...</div>
        </div>
      </MainLayout>
    );
  }

  if (!image) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Изображение не найдено</h2>
          <Button onClick={() => navigate('/images')}>Вернуться к списку</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full rounded-lg"
                />
                
                <svg className="absolute inset-0 w-full h-full">
                  {image.detections.map((detection) => (
                    <g key={detection.id}>
                      <rect
                        x={detection.bbox.x}
                        y={detection.bbox.y}
                        width={detection.bbox.width}
                        height={detection.bbox.height}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                      />
                      <text
                        x={detection.bbox.x}
                        y={detection.bbox.y - 5}
                        fill="#22c55e"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {detection.class} ({(detection.confidence * 100).toFixed(0)}%)
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Информация</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Имя файла</p>
                  <p className="font-medium">{image.filename}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Статус</p>
                  <Badge>{image.status}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Загружено</p>
                  <p className="text-sm">{new Date(image.uploadedAt).toLocaleString('ru-RU')}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Источник</p>
                  <p className="text-sm">{image.source}</p>
                </div>

                {image.gps && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">GPS координаты</p>
                    <p className="text-sm font-mono">
                      {image.gps.lat.toFixed(6)}, {image.gps.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">
                Детекции ({image.detections.length})
              </h3>
              
              <div className="space-y-3">
                {image.detections.map((detection) => (
                  <div
                    key={detection.id}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{detection.class}</span>
                      <Badge variant="secondary">
                        {(detection.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    {detection.address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        {detection.address}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ImageDetails;