import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  capacity: number;
};

function Dashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // Récupérer les événements depuis le serveur JSON
        const response = await fetch('http://localhost:3001/events');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }
        
        const events = await response.json();
        
        // Formater les événements pour correspondre au type attendu
        const formattedEvents = events.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(`${event.date}T${event.time}`).toISOString(),
          location: event.location,
          attendees: 0, // À implémenter si nécessaire
          capacity: event.capacity || 0,
          category: event.category,
          imageUrl: event.imageUrl
        }));

        const nowISO = new Date().toISOString();
        setUpcomingEvents(formattedEvents.filter((event: any) => event.date >= nowISO));
        setPastEvents(formattedEvents.filter((event: any) => event.date < nowISO));
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        // Afficher un message d'erreur à l'utilisateur
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les événements. Veuillez réessayer plus tard.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bonjour, {user?.name} ! Voici un aperçu de vos événements.
          </p>
        </div>
        <Button asChild>
          <Link to="/events/new">Créer un événement</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Événements à venir</TabsTrigger>
          <TabsTrigger value="past">Événements passés</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Aucun événement à venir</CardTitle>
                <CardDescription>
                  Vous n'avez pas d'événements à venir. Créez-en un nouveau pour commencer !
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                      <div className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {event.attendees}/{event.capacity}
                      </span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/events/${event.id}`}>Voir détails</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/events/${event.id}/edit`}>Modifier</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Aucun événement passé</CardTitle>
                <CardDescription>
                  Vos événements passés apparaîtront ici.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <Card key={event.id} className="opacity-70 hover:opacity-100 transition-opacity">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                      <div className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Participants:</span>
                      <span className="text-sm text-muted-foreground">{event.attendees} personnes</span>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/events/${event.id}/report`}>Voir le rapport</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
