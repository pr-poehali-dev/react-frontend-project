import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

  const mockHistory = [
    {
      id: 1,
      image: "https://v3.fal.media/files/penguin/SXvQQe0cPEXPM_ukcuPfI_output.png",
      date: "30 сентября 2025, 14:32",
      results: 12,
    },
    {
      id: 2,
      image: "https://v3.fal.media/files/penguin/SXvQQe0cPEXPM_ukcuPfI_output.png",
      date: "29 сентября 2025, 09:15",
      results: 8,
    },
    {
      id: 3,
      image: "https://v3.fal.media/files/penguin/SXvQQe0cPEXPM_ukcuPfI_output.png",
      date: "28 сентября 2025, 16:47",
      results: 15,
    },
  ];

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

          <div className="space-y-4">
            {mockHistory.map((item) => (
              <Card
                key={item.id}
                className="p-4 hover-scale cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt="Search query"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Найдено результатов: <span className="font-semibold text-foreground">{item.results}</span>
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Icon name="Search" className="mr-2" size={16} />
                    Повторить поиск
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {mockHistory.length === 0 && (
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