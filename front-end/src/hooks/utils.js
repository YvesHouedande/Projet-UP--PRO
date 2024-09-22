// Fonction utilitaire pour calculer le temps écoulé
function getTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / 60000); // Convertit la différence en minutes

    if (diffInMinutes < 1) {
        return "à l'instant";
    } else if (diffInMinutes < 60) {
        return `il y a ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) { // Moins de 24 heures
        return `il y a ${Math.floor(diffInMinutes / 60)} heure${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
    } else {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'short', // Exemple : "lun."
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}


// Fonction utilitaire pour déterminer l'état de l'événement et formater la date
function getStateTime(eventDate) {
    const now = new Date();
    const eventMoment = new Date(eventDate);

    // Vérifie si l'événement est en cours, passé ou à venir
    let status;
    if (eventMoment < now) {
        status = "passé"; // L'événement est passé
    } else if (eventMoment.toDateString() === now.toDateString()) {
        status = "en cours"; // L'événement est aujourd'hui
    } else {
        status = "à venir"; // L'événement est à venir
    }

    // Formatage de la date
    const formattedDate = eventMoment.toLocaleDateString('fr-FR', {
        weekday: 'long', // Exemple : "lundi"
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    // Retourne l'état de l'événement avec la date formatée
    return {
        status,
        formattedDate,
    };
}

export {
    getStateTime,
    getTimeAgo
}
