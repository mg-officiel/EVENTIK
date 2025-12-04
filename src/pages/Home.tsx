import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon } from '@heroicons/react/24/solid';
import { Header} from '@/components/header';
import AIAssistant from './../components/aiAssistant';



function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* header section*/}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl font-poppins">
            <span className="block font-bold">Gérez vos événements</span>
            <span className="block text-indigo-600 dark:text-indigo-400">en toute simplicité</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Créez, gérez et suivez vos événements en temps réel avec notre plateforme tout-en-un.
            Inscrivez-vous dès maintenant pour commencer.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button asChild size="lg" className="w-full">
                <Link to="/register">
                  Commencer
                </Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" size="lg" className="w-full">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/*ai experience */}       
      <div className="col-span-1">
         <AIAssistant />
      </div>



      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center font-bold">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Une meilleure façon de gérer vos événements
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Création simplifiée',
                  description: 'Créez des événements en quelques clics et personnalisez-les selon vos besoins.',
                  icon: '',
                },
                {
                  name: 'Gestion des billets',
                  description: 'Gérez facilement les billets, les prix et les promotions pour chaque événement.',
                  icon: '',
                },
                {
                  name: 'Analyse en temps réel',
                  description: 'Suivez les inscriptions et les ventes en temps réel avec des tableaux de bord intuitifs.',
                  icon: '',
                },
                {
                  name: 'Support client',
                  description: 'Notre équipe est là pour vous aider à chaque étape de votre événement.',
                  icon: '',
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <span className="text-xl">{feature.icon}</span>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-bold">
            <span className="block">Prêt à commencer?</span>
            <span className="block text-indigo-600 dark:text-indigo-400">Créez votre premier événement dès aujourd'hui.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button asChild size="lg">
                <Link to="/register">
                  S'inscrire maintenant
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
