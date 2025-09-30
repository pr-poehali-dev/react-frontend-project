import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const Export = () => {
  const navigate = useNavigate();

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Экспорт</h1>
          <p className="text-muted-foreground mb-8">
            Экспортируйте результаты поиска в удобном формате
          </p>

          <div className="grid gap-4">
            <Card className="p-6 hover-scale cursor-pointer transition-all hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="FileJson" className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">JSON формат</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Экспорт данных в JSON для дальнейшей обработки
                  </p>
                  <Button variant="outline" size="sm">
                    <Icon name="Download" className="mr-2" size={16} />
                    Скачать JSON
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-scale cursor-pointer transition-all hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="FileSpreadsheet" className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">CSV формат</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Экспорт в таблицу для работы в Excel
                  </p>
                  <Button variant="outline" size="sm">
                    <Icon name="Download" className="mr-2" size={16} />
                    Скачать CSV
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-scale cursor-pointer transition-all hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Package" className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">ZIP архив</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Скачать все изображения одним архивом
                  </p>
                  <Button variant="outline" size="sm">
                    <Icon name="Download" className="mr-2" size={16} />
                    Скачать ZIP
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;