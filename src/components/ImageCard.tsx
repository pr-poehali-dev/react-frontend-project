import { Link } from 'react-router-dom';
import { ImageMetadata } from '@/api/images';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ImageCardProps {
  image: ImageMetadata;
}

export const ImageCard = ({ image }: ImageCardProps) => {
  const statusColors = {
    queued: 'bg-yellow-500/10 text-yellow-500',
    processing: 'bg-blue-500/10 text-blue-500',
    done: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
  };

  return (
    <Link to={`/images/${image.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={image.thumbnailUrl}
            alt={image.filename}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge className={`absolute top-2 right-2 ${statusColors[image.status]}`}>
            {image.status}
          </Badge>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium truncate mb-2">{image.filename}</h3>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Icon name="Calendar" size={12} />
              {new Date(image.uploadedAt).toLocaleDateString('ru-RU')}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Tag" size={12} />
              {image.detections.length} детекций
            </span>
          </div>

          {image.gps && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="MapPin" size={12} />
              <span>{image.gps.lat.toFixed(4)}, {image.gps.lng.toFixed(4)}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};