import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon } from '@heroicons/react/24/solid';
import { Header } from '@/components/header';

function Abonnement() {
    return (
        <div>
            <Header/>
            <div className="container mx-auto py-12">
                <h1 className="text-3xl font-bold text-center">Nos Plans d'Abonnement</h1>
                <p className="text-center mt-2 text-gray-600 dark:text-gray-400">Choisissez le plan qui vous convient.</p>
                {/* Le contenu de la page des abonnements sera ajouté ici */}
            </div>
        </div>
    );
}

export default Abonnement;
