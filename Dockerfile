FROM ubuntu:22.04


ENV DEBIAN_FRONTEND=noninteractive \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=www-data \
    APACHE_LOG_DIR=/var/log/apache2 \
    APACHE_PID_FILE=/var/run/apache2/apache2.pid

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    apache2 \
    python3 \
    python3-pip \
    libapache2-mod-wsgi-py3 \
    git \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install beaker
RUN rm /var/www/html/index.html || true
RUN a2enmod wsgi rewrite && \
    a2dissite 000-default && \
    echo "Listen 80" > /etc/apache2/ports.conf
RUN echo "ServerName localhost" > /etc/apache2/conf-available/servername.conf
RUN a2enconf servername
RUN mkdir -p /var/www/ATI
WORKDIR /var/www/ATI
RUN mkdir -p /tmp/sessions && chmod 777 /tmp/sessions
COPY . /var/www/ATI/
RUN echo "<VirtualHost *:80>\n" \
         "    ServerAdmin webmaster@localhost\n\n" \
         "    # Activar el motor de reescritura para este VirtualHost\n" \
         "    RewriteEngine On\n\n" \
         "    # Redirigir la raíz del sitio (http://localhost:8080/) a /ATI/\n" \
         "    RewriteRule ^/$ /ATI/ [R=301,L]\n\n" \
         "    # Redirección permanente (301) de /ATI/index.py a /ATI/\n" \
         "    # Si el usuario intenta acceder a /ATI/index.py, será redirigido a /ATI/\n" \
         "    Redirect permanent /ATI/index.py /ATI/\n\n" \
         "    # Mapea todas las solicitudes que comienzan con /ATI a nuestra aplicación WSGI (app.py)\n" \
         "    # Esto significa que app.py manejará todas las peticiones bajo /ATI/\n" \
         "    WSGIScriptAlias /ATI /var/www/ATI/app.py\n\n" \
         "    # Configuración para el directorio donde reside app.py\n" \
         "    # Aunque WSGIScriptAlias ya lo maneja, estas directivas son buenas prácticas\n" \
         "    <Directory /var/www/ATI>\n" \
         "        WSGIProcessGroup your_app\n" \
         "        WSGIApplicationGroup %{GLOBAL}\n" \
         "        Require all granted\n" \
         "    </Directory>\n\n" \
         "    # Define el proceso Daemon de WSGI para la aplicación\n" \
         "    # 'your_app' es el nombre del proceso, corre como www-data con 5 hilos\n" \
         "    WSGIDaemonProcess your_app user=www-data group=www-data threads=5\n\n" \
         "    # Configuración de los archivos de log para errores y accesos\n" \
         "    ErrorLog \${APACHE_LOG_DIR}/error.log\n" \
         "    CustomLog \${APACHE_LOG_DIR}/access.log combined\n" \
         "</VirtualHost>" > /etc/apache2/sites-available/ati.conf


RUN a2ensite ati.conf
RUN chown -R www-data:www-data /var/www/ATI && \
    chmod -R 755 /var/www/ATI
EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]