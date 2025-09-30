import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { imagesApi } from "@/api/images";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        toast({
          title: "Изображение загружено",
          description: "Теперь можно начать поиск",
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, загрузите изображение",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        toast({
          title: "Изображение загружено",
          description: "Теперь можно начать поиск",
        });
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!uploadedImage) {
      toast({
        title: "Загрузите изображение",
        description: "Сначала загрузите изображение для поиска",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const blob = await fetch(uploadedImage).then(r => r.blob());
      const file = new File([blob], 'search.jpg', { type: 'image/jpeg' });
      
      const response = await imagesApi.searchByImage(file);
      setSearchResults(response.results.map(r => r.thumbnailUrl));
      
      toast({
        title: "Поиск завершен",
        description: `Найдено ${response.total} похожих изображения`,
      });
    } catch (error) {
      toast({
        title: "Ошибка поиска",
        description: "Не удалось выполнить поиск",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [uploadedImage, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-3">IMAGE SEARCH</h1>
          <p className="text-muted-foreground text-lg">
            Поиск похожих изображений за секунды
          </p>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6 max-w-7xl mx-auto">
          <Card
            className={`p-8 transition-all duration-300 animate-scale-in ${
              isDragging ? "border-primary border-2 shadow-xl" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="aspect-[4/3] border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center relative overflow-hidden bg-muted/30">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <Icon
                    name="Image"
                    size={64}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Перетащите изображение сюда
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    или нажмите для выбора файла
                  </p>
                  <label htmlFor="file-input">
                    <Button variant="default" size="lg" className="cursor-pointer" asChild>
                      <span>
                        <Icon name="Upload" className="mr-2" size={20} />
                        Выбрать файл
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              )}
            </div>
            {uploadedImage && (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setUploadedImage(null)}
              >
                <Icon name="X" className="mr-2" size={16} />
                Удалить изображение
              </Button>
            )}
          </Card>

          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/export")}
                className="hover-scale h-20 flex-col"
              >
                <Icon name="Download" size={24} className="mb-2" />
                <span className="text-sm">Экспорт</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/history")}
                className="hover-scale h-20 flex-col"
              >
                <Icon name="History" size={24} className="mb-2" />
                <span className="text-sm">История</span>
              </Button>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Icon name="Search" size={20} />
                Результаты поиска
              </h3>
              <div className="space-y-3 mb-4 min-h-[300px]">
                {isSearching ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-muted-foreground">
                      Поиск изображений...
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden hover-scale cursor-pointer"
                      >
                        <img
                          src={result}
                          alt={`Result ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Icon
                      name="ImageOff"
                      size={48}
                      className="text-muted-foreground mb-3"
                    />
                    <p className="text-sm text-muted-foreground">
                      Загрузите изображение и нажмите "Поиск"
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={handleSearch}
                disabled={!uploadedImage || isSearching}
              >
                <Icon name="Search" className="mr-2" size={20} />
                {isSearching ? "Поиск..." : "Начать поиск"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;