# Usar imagen ligera de Ubuntu con Apache preinstalado
FROM ubuntu/apache2:latest

RUN apt-get update && \
    apt-get install -y apache2

# Copiar TODOS los archivos al servidor web
COPY . /var/www/html/

# Exponer el puerto 80 (HTTP)
EXPOSE 80

# Iniciar Apache automáticamente
CMD ["apache2ctl", "-D", "FOREGROUND"]