export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ImageSearch. Все права защищены.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">О проекте</a>
            <a href="#" className="hover:text-primary transition-colors">Документация</a>
            <a href="#" className="hover:text-primary transition-colors">Поддержка</a>
          </div>
        </div>
      </div>
    </footer>
  );
};