const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Connexion au serveur MySQL (sans préciser la database pour pouvoir la créer)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true // Permet d'exécuter plusieurs requêtes SQL en une fois
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion au serveur MySQL:', err);
    return;
  }
  console.log('Connecté au serveur MySQL');

  // Lire le fichier seeds.sql
  const sqlPath = path.join(__dirname, 'sql', 'seeds.sql');
  
  fs.readFile(sqlPath, 'utf8', (err, sql) => {
    if (err) {
      console.error('Erreur de lecture du fichier seeds.sql:', err);
      db.end();
      return;
    }

    // Exécuter le script SQL
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'initialisation de la base de données:', err);
      } else {
        console.log('Base de données "eventik" créée et tables initialisées avec succès !');
      }
      db.end();
    });
  });
});