# ATI-012025
Estudiante: Carlos Cao 
C.I.: 28655925

Repositorio hecho para entregar los laboratorios de la asignatura Aplicaciones con Tecnologia Internet

# Pasos para ejecutar la web en docker

#### REQUISITOS PREVIOS

Es necesario tener Docker instalado en el sistema.

### 1. Preparar el entorno para ejecutar

Para ejecutar el proyecto en una web, es necesario descargar o clonar el repositorio en su PC. Luego desde la terminal navegar hasta la carpeta donde se encuentra el proyecto y el dockerfile.

### 2. Construir la imagen del Docker

Una vez ubicado en la carpeta del proyecto que contiene el dockerfile, ejecutamos el siguiente comando:

```bash
docker build -t proyecto-ati-28655925 .
```
Este comando construira una imagen Dcoker con el nombre `proyecto-ati-28655925`. Si quieres visualizar que en efecto se haya construido la imagen Docker, puedes utilizar el comando `docker images` para visualizar todas las imagenes.

### 3. Ejecutar el contenedor

Despues de construir la imagen, podemos iniciar un contenedor basado en la imagen con el siguiente comando:

```bash
docker run -tid --name servidor-web-28655925 -p 8080:80 proyecto-ati-28655925
```

Este comando, inicia el contenedor en segundo plano, asignandole el nombre `servidor-web-28655925` y exponiendo el puerto 80 del contenedor en el puerto 8080 de nuestra maquina local.

### 4. Acceder a la web

Despues de ejecutar el contenedor, ya se encontrara disponible el acceso la web con las siguiente direcciones:

##### 4.1 Web por defecto: http://localhost:8080 

##### 4.2 http://localhost:8080/ATI

##### 4.3 http://localhost:8080/ATI/index.py redirige a la pagina index.html

### 5. Comando extras:

Algunos comandos extras que nos ayudan controlar la ejecución en el docker.

##### 5.1 Detener el contenedor

Si deseas detener el contenedor en ejecución, utilizamos el siguiente comando:

```bash
docker stop servidor-web-28655925
```

##### 5.2 Reiniciar el contenedor

Si deseas volver a iniciar el contenedor, utilizamos el siguiente comando:

```bash
docker start servidor-web-28655925
```
##### 5.3 Eliminar el contenedor

Si deseas eliminar el contenedor, utilizamos el siguiente comando:

```bash
docker rm servidor-web-28655925
```
##### 5.4 Eliminar la imagen

Si deseas eliminar la imagen, utilizamos el siguiente comando:

```bash
docker rmi proyecto-ati-28655925
```
