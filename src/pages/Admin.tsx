import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface RSVPResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  attendance: string;
  guests_count: number;
  dietary_restrictions: string[];
  other_dietary: string;
  message: string;
  created_at: string;
}

export default function Admin() {
  const { toast } = useToast();
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/df55c789-caa2-4966-8712-119b64b508ea', {
        method: 'GET',
        headers: {
          'X-Admin-Key': adminKey,
        },
      });

      const data = await response.json();

      if (response.ok && data.responses) {
        setIsAuthenticated(true);
        setResponses(data.responses);
        localStorage.setItem('adminKey', adminKey);
        toast({
          title: "Вход выполнен",
          description: "Добро пожаловать в админ-панель!",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Неверный ключ доступа",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось подключиться к серверу",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async () => {
    const savedKey = localStorage.getItem('adminKey');
    if (!savedKey) return;

    try {
      const response = await fetch('https://functions.poehali.dev/df55c789-caa2-4966-8712-119b64b508ea', {
        method: 'GET',
        headers: {
          'X-Admin-Key': savedKey,
        },
      });

      const data = await response.json();

      if (response.ok && data.responses) {
        setResponses(data.responses);
        setIsAuthenticated(true);
        setAdminKey(savedKey);
      }
    } catch (error) {
      console.error('Failed to load responses:', error);
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    setResponses([]);
    localStorage.removeItem('adminKey');
  };

  const getDietaryText = (restrictions: string[], other: string) => {
    if (!restrictions || restrictions.length === 0) return 'Нет ограничений';
    
    const labels: Record<string, string> = {
      'vegetarian': 'Вегетарианское меню',
      'vegan': 'Веганское меню',
      'gluten-free': 'Без глютена',
      'lactose-free': 'Без лактозы',
      'allergies': 'Аллергии'
    };

    const items = restrictions.map(r => labels[r] || r).join(', ');
    return other ? `${items} (${other})` : items;
  };

  const yesCount = responses.filter(r => r.attendance === 'yes').length;
  const noCount = responses.filter(r => r.attendance === 'no').length;
  const totalGuests = responses.filter(r => r.attendance === 'yes').reduce((sum, r) => sum + (r.guests_count || 1), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Админ-панель</CardTitle>
            <CardDescription className="text-center">Введите ключ доступа для просмотра откликов</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminKey">Ключ доступа</Label>
                <Input
                  id="adminKey"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Введите ключ"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Отклики гостей</h1>
            <p className="text-muted-foreground">Список подтверждений участия на свадьбе</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button onClick={loadResponses} variant="outline">
              <Icon name="RefreshCw" size={18} className="mr-2" />
              Обновить
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Подтвердили участие</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{yesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Не смогут присутствовать</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{noCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего гостей (включая +1)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalGuests}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {responses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Icon name="UserX" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Пока нет откликов</p>
              </CardContent>
            </Card>
          ) : (
            responses.map((response) => (
              <Card key={response.id} className={response.attendance === 'yes' ? 'border-green-200' : 'border-red-200'}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{response.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(response.created_at).toLocaleString('ru-RU')}
                      </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      response.attendance === 'yes' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {response.attendance === 'yes' ? 'Придёт' : 'Не придёт'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Mail" size={16} className="text-muted-foreground" />
                      <span>{response.email}</span>
                    </div>
                    {response.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Phone" size={16} className="text-muted-foreground" />
                        <span>{response.phone}</span>
                      </div>
                    )}
                  </div>

                  {response.attendance === 'yes' && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Users" size={16} className="text-muted-foreground" />
                        <span>Количество гостей: {response.guests_count || 1}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Icon name="UtensilsCrossed" size={16} className="text-muted-foreground mt-0.5" />
                        <span>{getDietaryText(response.dietary_restrictions, response.other_dietary)}</span>
                      </div>
                    </>
                  )}

                  {response.message && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium mb-1 text-muted-foreground">Пожелания:</p>
                      <p className="text-sm italic">{response.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
