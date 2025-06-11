FROM ubuntu:22.04

# Configuración de entorno
ENV DEBIAN_FRONTEND=noninteractive \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=www-data \
    APACHE_LOG_DIR=/var/log/apache2 \
    APACHE_PID_FILE=/var/run/apache2/apache2.pid

# Instalar dependencias y limpiar
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    apache2 \
    python3 \
    python3-pip \
    libapache2-mod-wsgi-py3 \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Eliminar la página de bienvenida por defecto de Apache
RUN rm /var/www/html/index.html

# Configurar Apache
RUN a2enmod wsgi rewrite && \
    a2dissite 000-default && \
    echo "Listen 80" > /etc/apache2/ports.conf

# Crear directorio para la aplicación ATI
RUN mkdir -p /var/www/ATI
WORKDIR /var/www/ATI

# Copiar contenido actual (para construcción local)
COPY . .

# Configurar virtual host unificado para /ATI
RUN echo "<VirtualHost *:80>\n" \
         "    ServerName localhost\n\n" \
         "    # Activar el motor de reescritura para el VirtualHost\n" \
         "    RewriteEngine On\n\n" \
         "    # --- NUEVA REGLA ---\n" \
         "    # Redirigir la raíz del sitio (/) a /ATI/\n" \
         "    RewriteRule ^/$ /ATI/ [R=301,L]\n\n" \
         "    # Redirección permanente (301) de index.py a la raíz de la app\n" \
         "    Redirect permanent /ATI/index.py /ATI/\n\n" \
         "    # Mapea la URL /ATI al directorio de la aplicación\n" \
         "    Alias /ATI /var/www/ATI\n\n" \
         "    # Configuración para el directorio de la aplicación (incluyendo la SPA)\n" \
         "    <Directory /var/www/ATI>\n" \
         "        # Aquí no necesitamos RewriteEngine On de nuevo, pero sí las reglas\n" \
         "        Options Indexes FollowSymLinks\n" \
         "        AllowOverride All\n" \
         "        Require all granted\n\n" \
         "        RewriteBase /ATI/\n\n" \
         "        RewriteCond %{REQUEST_FILENAME} !-f\n" \
         "        RewriteCond %{REQUEST_FILENAME} !-d\n\n" \
         "        RewriteRule . /ATI/index.html [L]\n" \
         "    </Directory>\n\n" \
         "    ErrorLog \${APACHE_LOG_DIR}/error.log\n" \
         "    CustomLog \${APACHE_LOG_DIR}/access.log combined\n" \
         "</VirtualHost>" > /etc/apache2/sites-available/ati.conf

# Habilitar sitio
RUN a2ensite ati.conf

# Configurar permisos
RUN chown -R www-data:www-data /var/www/ATI && \
    chmod -R 755 /var/www/ATI

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Apache
CMD ["apache2ctl", "-D", "FOREGROUND"]