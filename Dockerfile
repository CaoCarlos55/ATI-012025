FROM ubuntu/apache2:latest
RUN apt-get update 
RUN apt-get install -y apache2
RUN rm var/www/html/index.html
COPY . /var/www/html/
CMD ["apache2ctl", "-D", "FOREGROUND"]