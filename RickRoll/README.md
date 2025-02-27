# Site Rick Roll

Un site web simple et responsive qui fait du Rick Roll. Fonctionne sur PC et mobile.

## Caractéristiques

- Design responsive (s'adapte aux écrans de PC et mobiles)
- Lecture automatique de la vidéo "Never Gonna Give You Up"
- Animation et effets visuels
- Bouton de partage
- Facile à déployer

## Comment déployer sur un serveur Ubuntu

### Prérequis

- Un serveur Ubuntu avec accès SSH
- Nginx ou Apache installé sur votre serveur
- Un nom de domaine (optionnel)

### Avec Nginx

1. Connectez-vous à votre serveur via SSH:
   ```
   ssh utilisateur@adresse_ip_du_serveur
   ```

2. Installer Nginx si ce n'est pas déjà fait:
   ```
   sudo apt update
   sudo apt install nginx
   ```

3. Créer un répertoire pour le site:
   ```
   sudo mkdir -p /var/www/rickroll
   ```

4. Copier les fichiers du site vers le serveur:
   ```
   # Depuis votre ordinateur local (pas sur le serveur)
   scp -r /chemin/vers/RickRoll/* utilisateur@adresse_ip_du_serveur:/var/www/rickroll/
   ```

5. Configurer Nginx:
   ```
   sudo nano /etc/nginx/sites-available/rickroll
   ```

6. Ajouter cette configuration:
   ```
   server {
       listen 80;
       server_name votre_domaine.com; # ou l'IP du serveur si pas de domaine

       root /var/www/rickroll;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

7. Activer le site:
   ```
   sudo ln -s /etc/nginx/sites-available/rickroll /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Avec Apache

1. Installer Apache si ce n'est pas déjà fait:
   ```
   sudo apt update
   sudo apt install apache2
   ```

2. Créer un répertoire pour le site:
   ```
   sudo mkdir -p /var/www/html/rickroll
   ```

3. Copier les fichiers du site vers le serveur:
   ```
   # Depuis votre ordinateur local (pas sur le serveur)
   scp -r /chemin/vers/RickRoll/* utilisateur@adresse_ip_du_serveur:/var/www/html/rickroll/
   ```

4. Configurer Apache:
   ```
   sudo nano /etc/apache2/sites-available/rickroll.conf
   ```

5. Ajouter cette configuration:
   ```
   <VirtualHost *:80>
       ServerName votre_domaine.com
       DocumentRoot /var/www/html/rickroll
       
       <Directory /var/www/html/rickroll>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

6. Activer le site:
   ```
   sudo a2ensite rickroll.conf
   sudo systemctl restart apache2
   ```

## Accéder au site

Après le déploiement, vous pouvez accéder au site en visitant:
- http://votre_domaine.com ou
- http://adresse_ip_du_serveur

## Personnalisation

Vous pouvez personnaliser le site en modifiant les fichiers suivants:
- `index.html` - Structure de la page
- `styles.css` - Style et apparence
- `script.js` - Fonctionnalités et animations
