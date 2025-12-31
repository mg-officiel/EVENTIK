const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Vérifiez que c'est le bon utilisateur (souvent 'root' sous XAMPP/WAMP)
  password: '',      // Vérifiez que c'est le bon mot de passe (souvent vide sous XAMPP)
  database: 'eventik'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Route d'inscription
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Un compte avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// Route de connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Retourner les infos de l'utilisateur (sans le mot de passe)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

// Route pour récupérer les événements (avec filtre optionnel par userId)
app.get('/events', async (req, res) => {
  const userId = req.query.userId;
  const search = req.query.search;
  
  try {
    let query = 'SELECT e.*, COUNT(t.id) as tickets_sold FROM events e LEFT JOIN tickets t ON e.id = t.event_id';
    const params = [];
    const conditions = [];
    
    if (userId) {
      conditions.push('e.user_id = ?');
      params.push(userId);
    }

    if (search) {
      conditions.push('(e.title LIKE ? OR e.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY e.id ORDER BY e.event_date ASC';
    
    const [events] = await db.promise().query(query, params);
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
});

// Route de création d'événement
app.post('/events', async (req, res) => {
  const { user_id, title, description, location, event_date, capacity } = req.body;

  if (!user_id || !title || !event_date || !location) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    // Génération simple d'un slug unique (titre-timestamp)
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const [result] = await db.promise().query(
      `INSERT INTO events 
      (user_id, title, description, location, event_date, capacity, slug) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, location, event_date, capacity, slug]
    );

    res.status(201).json({ 
      message: 'Événement créé avec succès', 
      eventId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'événement' });
  }
});

// Route pour mettre à jour un utilisateur
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Le nom et l\'email sont requis' });
  }

  try {
    // Vérifier si le nouvel email est déjà pris par un autre utilisateur
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ? AND id != ?', [email, id]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé par un autre compte' });
    }

    let query = 'UPDATE users SET name = ?, email = ?';
    const params = [name, email];

    // Si un nouveau mot de passe est fourni, le hasher et l'ajouter à la requête
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.promise().query(query, params);

    // Récupérer les informations mises à jour de l'utilisateur pour les renvoyer
    const [[updatedUser]] = await db.promise().query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
  }
});

// Route pour les statistiques du tableau de bord (Ventes des 6 derniers mois)
app.get('/dashboard/stats', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'UserId requis' });
  }

  try {
    // Récupère le nombre de tickets créés par mois pour les événements de l'utilisateur
    // Utilise DATE_FORMAT pour grouper par mois (YYYY-MM)
    const query = `
      SELECT 
        DATE_FORMAT(t.created_at, '%Y-%m') as month, 
        COUNT(t.id) as count 
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE e.user_id = ? 
      AND t.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `;

    const [results] = await db.promise().query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});