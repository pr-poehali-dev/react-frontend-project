import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { imagesApi } from "@/api/images";

const History = () => {
  const navigate = useNavigate();

  const { data: searchHistory, isLoading } = useQuery({
    queryKey: ['searchHistory'],
    queryFn: () => imagesApi.getSearchHistory(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Загрузка истории...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover-scale"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад
        </Button>

        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">История поиска</h1>
          <p className="text-muted-foreground mb-8">
            Все ваши предыдущие запросы
          </p>

          {searchHistory && searchHistory.length > 0 ? (
            <div className="space-y-4">
              {searchHistory.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 hover-scale cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt="Search query"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Найдено результатов: <span className="font-semibold text-foreground">{item.results.length}</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-32">
                      {item.results.slice(0, 2).map((result) => (
                        <img
                          key={result.id}
                          src={result.thumbnailUrl}
                          alt="result"
                          className="w-full h-12 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Icon name="History" className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-semibold mb-2">История пуста</h3>
              <p className="text-muted-foreground mb-4">
                Начните поиск изображений, чтобы увидеть историю
              </p>
              <Button onClick={() => navigate("/")}>
                Перейти к поиску
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;