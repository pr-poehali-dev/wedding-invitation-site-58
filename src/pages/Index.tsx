import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attendance: '',
    guestsCount: '1',
    dietaryRestrictions: [] as string[],
    otherDietary: '',
    musicPreferences: '',
    returnTransfer: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/df55c789-caa2-4966-8712-119b64b508ea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Спасибо за ответ! 💕",
          description: "Мы получили вашу информацию и очень ждём вас на нашем празднике!",
        });
        setFormData({
          name: '',
          phone: '',
          attendance: '',
          guestsCount: '1',
          dietaryRestrictions: [],
          otherDietary: '',
          musicPreferences: '',
          returnTransfer: '',
          message: ''
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить ответ. Попробуйте снова.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить ответ. Проверьте подключение к интернету.",
        variant: "destructive"
      });
    }
  };

  const toggleDietary = (value: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(value)
        ? prev.dietaryRestrictions.filter(item => item !== value)
        : [...prev.dietaryRestrictions, value]
    }));
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const weddingDate = new Date('2026-07-04T14:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Eucalyptus decorations */}
        <div className="absolute top-0 left-0 w-[55vw] md:w-[43vw] aspect-square bg-[url('https://cdn.poehali.dev/projects/1a403886-d3ca-4c34-bac1-0cca7bf0cb31/bucket/eucalyptus-branch-1.png')] bg-contain bg-no-repeat opacity-60 animate-fade-in"></div>
        <div className="absolute bottom-0 right-0 w-[50vw] md:w-[38vw] aspect-square bg-[url('https://cdn.poehali.dev/projects/1a403886-d3ca-4c34-bac1-0cca7bf0cb31/bucket/eucalyptus-branch-2.png')] bg-contain bg-no-repeat opacity-60 animate-fade-in" style={{ animationDelay: '0.2s' }}></div>
        
        <div className="relative z-10 text-center max-w-4xl animate-fade-in">
          <div className="mb-8">
            <Icon name="Heart" size={48} className="mx-auto text-primary mb-6" />
          </div>
          <h1 className="text-6xl md:text-7xl font-light text-foreground mb-8">
            Алексей <span className="text-5xl md:text-6xl text-muted-foreground">и</span> Мария
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-24 bg-primary/30"></div>
            <p className="text-2xl md:text-3xl text-muted-foreground font-light">
              4 июля 2026
            </p>
            <div className="h-px w-24 bg-primary/30"></div>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light">
            Приглашаем вас разделить с нами самый важный день нашей жизни
          </p>
          
          {/* Countdown Timer */}
          <div className="mb-12 animate-scale-in">
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-6 border-2 border-primary/20">
                <div className="text-2xl md:text-5xl font-bold text-primary mb-1 md:mb-2">
                  {timeLeft.days}
                </div>
                <div className="text-xs md:text-base text-muted-foreground">дней</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-6 border-2 border-primary/20">
                <div className="text-2xl md:text-5xl font-bold text-primary mb-1 md:mb-2">
                  {timeLeft.hours}
                </div>
                <div className="text-xs md:text-base text-muted-foreground">часов</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-6 border-2 border-primary/20">
                <div className="text-2xl md:text-5xl font-bold text-primary mb-1 md:mb-2">
                  {timeLeft.minutes}
                </div>
                <div className="text-xs md:text-base text-muted-foreground">минут</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-6 border-2 border-primary/20">
                <div className="text-2xl md:text-5xl font-bold text-primary mb-1 md:mb-2">
                  {timeLeft.seconds}
                </div>
                <div className="text-xs md:text-base text-muted-foreground">секунд</div>
              </div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Подтвердить участие
          </Button>
        </div>
      </section>

      {/* Details Section */}
      <section className="relative py-20 px-4 bg-secondary/30">
        {/* Decorative branch */}
        <div className="absolute top-0 left-0 w-[40vw] md:w-[30vw] aspect-square bg-[url('https://cdn.poehali.dev/projects/1a403886-d3ca-4c34-bac1-0cca7bf0cb31/bucket/eucalyptus-branch-2.png')] bg-contain bg-no-repeat opacity-60 rotate-180"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl text-center mb-16 animate-fade-in-up">
            О торжестве
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ceremony */}
            <Card className="animate-scale-in border-2 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Icon name="Church" size={40} className="text-primary" />
                </div>
                <CardTitle className="text-3xl">Церемония</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="text-lg font-medium text-muted-foreground">4 июля 2026</p>
                  <p className="text-2xl font-semibold mt-2">13:00</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-lg text-muted-foreground mb-4">Центр семьи "Казан"</p>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="text-sm text-muted-foreground text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Icon name="Clock" size={18} className="mr-2" />
                        <span>Ждём вас ко времени, указанном в приглашении</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reception */}
            <Card className="animate-scale-in border-2 hover:shadow-xl transition-shadow" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Icon name="Wine" size={40} className="text-primary" />
                </div>
                <CardTitle className="text-3xl">Праздник</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="text-lg font-medium text-muted-foreground">4 июля 2026</p>
                  <p className="text-2xl font-semibold mt-2">15:00</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-lg text-muted-foreground mb-4">Поляна невест</p>
                  <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center justify-center">
                      <Icon name="Car" size={18} className="mr-2" />
                      Есть парковка
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center justify-center">
                      <Icon name="Bus" size={18} className="mr-2" />
                      Трансфер от Центра семьи "Казан" отходит в 13:45
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <Icon name="Shirt" size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-5xl md:text-6xl mb-8">Дресс-код</h2>
          <Card className="border-2">
            <CardContent className="pt-6">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Приходите так, как вам будет удобно гулять по летнему полю. Каблучкам можно дать выходной.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="relative py-20 px-4">
        {/* Decorative branch */}
        <div className="absolute top-0 left-0 w-[40vw] md:w-[30vw] aspect-square bg-[url('https://cdn.poehali.dev/projects/1a403886-d3ca-4c34-bac1-0cca7bf0cb31/bucket/eucalyptus-branch-2.png')] bg-contain bg-no-repeat opacity-60 rotate-180"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Icon name="Mail" size={48} className="mx-auto text-primary mb-6" />
            <h2 className="text-5xl md:text-6xl mb-4">Подтверждение участия</h2>
            <p className="text-lg text-muted-foreground">
              Пожалуйста, сообщите нам о своём решении до 20 июня 2026
            </p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Сможете ли вы присутствовать? *</Label>
                  <RadioGroup
                    required
                    value={formData.attendance}
                    onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="font-normal cursor-pointer">
                        Да, с радостью буду!
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="font-normal cursor-pointer">
                        К сожалению, не смогу
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.attendance === 'yes' && (
                  <>
                    <div className="space-y-3">
                      <Label>Количество гостей</Label>
                      <RadioGroup
                        value={formData.guestsCount}
                        onValueChange={(value) => setFormData({ ...formData, guestsCount: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="guest1" />
                          <Label htmlFor="guest1" className="font-normal cursor-pointer">
                            1 человек (только я)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" id="guest2" />
                          <Label htmlFor="guest2" className="font-normal cursor-pointer">
                            2 человека (я +1)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label>Пищевые предпочтения</Label>
                      <div className="space-y-3">
                        {[
                          { id: 'vegetarian', label: 'Вегетарианское меню' },
                          { id: 'meat', label: 'Предпочитаю мясо' },
                          { id: 'fish', label: 'Предпочитаю рыбу' },
                          { id: 'allergies', label: 'Аллергии (укажите ниже)' }
                        ].map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={item.id}
                              checked={formData.dietaryRestrictions.includes(item.id)}
                              onCheckedChange={() => toggleDietary(item.id)}
                            />
                            <Label htmlFor={item.id} className="font-normal cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {formData.dietaryRestrictions.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="otherDietary">Дополнительная информация</Label>
                          <Textarea
                            id="otherDietary"
                            value={formData.otherDietary}
                            onChange={(e) => setFormData({ ...formData, otherDietary: e.target.value })}
                            placeholder="Пожалуйста, укажите детали (например, конкретные аллергены)"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="musicPreferences">Музыкальные предпочтения</Label>
                      <p className="text-sm text-muted-foreground">Если у вас есть свои любимые мелодии, то можете предложить их для нашего плейлиста</p>
                      <Textarea
                        id="musicPreferences"
                        value={formData.musicPreferences}
                        onChange={(e) => setFormData({ ...formData, musicPreferences: e.target.value })}
                        placeholder="Название песен или исполнителей..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnTransfer">Обратный трансфер</Label>
                      <p className="text-sm text-muted-foreground">Укажите район или улицу в Казани, куда вы собираетесь отправиться после праздника, чтобы мы смогли подобрать наиболее удобные точки для остановки обратного трансфера</p>
                      <Input
                        id="returnTransfer"
                        value={formData.returnTransfer}
                        onChange={(e) => setFormData({ ...formData, returnTransfer: e.target.value })}
                        placeholder="Например: Вахитовский район, ул. Баумана..."
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Пожелания молодожёнам</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ваши тёплые слова..."
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg py-6">
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить ответ
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <Icon name="Phone" size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-5xl md:text-6xl mb-8">Контакты</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Если у вас есть вопросы, мы всегда на связи
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Мария</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="Phone" size={18} />
                  <a href="tel:+79872919070" className="hover:text-primary transition-colors">
                    +7 (987) 291-90-70
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="Mail" size={18} />
                  <a href="mailto:zatula.mariavl@gmail.com" className="hover:text-primary transition-colors">
                    zatula.mariavl@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Алексей</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="Phone" size={18} />
                  <a href="tel:+79518973039" className="hover:text-primary transition-colors">
                    +7 (951) 897-30-39
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="Mail" size={18} />
                  <a href="mailto:alexei.erepov@gmail.com" className="hover:text-primary transition-colors">
                    alexei.erepov@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 text-center">
        {/* Decorative branch at bottom right */}
        <div className="absolute bottom-0 right-0 w-[48vw] md:w-[35vw] aspect-square bg-[url('https://cdn.poehali.dev/projects/1a403886-d3ca-4c34-bac1-0cca7bf0cb31/bucket/eucalyptus-branch-1.png')] bg-contain bg-no-repeat opacity-60 rotate-180"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <Icon name="Heart" size={32} className="mx-auto text-primary mb-4" />
          <p className="text-lg text-muted-foreground mb-2">
            С любовью, Алексей и Мария
          </p>
          <p className="text-sm text-muted-foreground">
            4 июля 2026
          </p>
        </div>
      </footer>
    </div>
  );
}