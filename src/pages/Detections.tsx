import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { imagesApi } from '@/api/images';

const Detections = () => {
  const navigate = useNavigate();
  const [minConfidence, setMinConfidence] = useState<number>(0);

  const { data: detections, isLoading } = useQuery({
    queryKey: ['detections', minConfidence],
    queryFn: () => imagesApi.getDetections({ minConfidence }),
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Все детекции</h1>
          <p className="text-muted-foreground">Объекты, обнаруженные на изображениях</p>
        </div>

        <div className="flex gap-4 mb-8">
          <Select value={minConfidence.toString()} onValueChange={(v) => setMinConfidence(Number(v))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Минимальная уверенность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Все детекции</SelectItem>
              <SelectItem value="0.5">≥ 50%</SelectItem>
              <SelectItem value="0.7">≥ 70%</SelectItem>
              <SelectItem value="0.9">≥ 90%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : detections && detections.length > 0 ? (
          <div className="space-y-4">
            {detections.map((detection: any) => (
              <Card
                key={detection.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/images/${detection.imageId}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={detection.imageUrl}
                      alt="Detection"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{detection.class}</h3>
                      <Badge variant={detection.confidence > 0.8 ? 'default' : 'secondary'}>
                        {(detection.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>

                    {detection.address && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="MapPin" size={14} />
                        <span>{detection.address}</span>
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm">
                    <Icon name="ExternalLink" size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Icon name="Target" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Нет детекций</h3>
              <p className="text-muted-foreground">
                Загрузите изображения, чтобы увидеть обнаруженные объекты
              </p>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Detections;