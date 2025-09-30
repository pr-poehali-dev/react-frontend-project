import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export const FileUploader = ({ 
  onFileSelect, 
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize = 10 * 1024 * 1024,
  className 
}: FileUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg transition-all cursor-pointer',
        'hover:border-primary hover:bg-accent/50',
        isDragActive && 'border-primary bg-accent/50 scale-105',
        className
      )}
    >
      <input {...getInputProps()} />
      
      {preview ? (
        <div className="relative w-full h-full">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <p className="text-white text-sm font-medium">Нажмите или перетащите для замены</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
          <div className="p-4 rounded-full bg-primary/10">
            <Icon name="Upload" size={48} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium mb-1">
              {isDragActive ? 'Отпустите файл' : 'Перетащите изображение'}
            </p>
            <p className="text-sm text-muted-foreground">
              или нажмите для выбора файла
            </p>
          </div>
        </div>
      )}
    </div>
  );
};