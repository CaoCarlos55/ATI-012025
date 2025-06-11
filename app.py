import os
import json
from beaker.middleware import SessionMiddleware
from beaker.cache import CacheManager
from beaker.util import parse_cache_config_options

# Configuración de la caché (opcional, pero útil para datos que no cambian a menudo)
cache_opts = {
    'cache.type': 'memory',
    'cache.expire': 3600  # 1 hora
}
cache = CacheManager(**parse_cache_config_options(cache_opts))

# Configuración de las sesiones
session_opts = {
    'session.type': 'file',
    'session.cookie_expires': True,
    'session.data_dir': '/tmp/sessions', # Asegúrate de que este directorio exista y sea escribible
    'session.auto': True
}

# Ruta base de la aplicación (donde se encuentran los archivos)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_FILE = os.path.join(BASE_DIR, 'index.html')

def application(environ, start_response):
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET')
    session = environ['beaker.session'] # Accede a la sesión

    # Definir el directorio de archivos estáticos
    static_dirs = {
        '/css/': os.path.join(BASE_DIR, 'css'),
        '/js/': os.path.join(BASE_DIR, 'js'),
        '/datos/': os.path.join(BASE_DIR, 'datos'),
        '/conf/': os.path.join(BASE_DIR, 'conf'),
        '/perfiles/': os.path.join(BASE_DIR, 'perfiles'),
        '/favicon.ico': os.path.join(BASE_DIR, 'favicon.ico')
    }

    # Intentar servir archivos estáticos (CSS, JS, imágenes, JSONs de datos/config)
    for prefix, static_dir_path in static_dirs.items():
        if path.startswith(prefix):
            file_path = os.path.join(static_dir_path, path[len(prefix):])
            
            # Si es favicon.ico y el path es exactamente ese, ajustarlo
            if path == '/favicon.ico':
                file_path = os.path.join(BASE_DIR, 'favicon.ico')

            if os.path.exists(file_path) and os.path.isfile(file_path):
                # Determinar el tipo de contenido (MIME type)
                if file_path.endswith('.css'):
                    content_type = 'text/css'
                elif file_path.endswith('.js'):
                    content_type = 'application/javascript'
                elif file_path.endswith('.json'):
                    content_type = 'application/json'
                elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
                    content_type = 'image/jpeg'
                elif file_path.endswith('.png'):
                    content_type = 'image/png'
                elif file_path.endswith('.ico'):
                    content_type = 'image/x-icon'
                else:
                    content_type = 'application/octet-stream' # Tipo genérico

                status = '200 OK'
                headers = [('Content-Type', content_type)]
                with open(file_path, 'rb') as f:
                    response_body = f.read()
                start_response(status, headers)
                return [response_body]

    # Lógica para la página principal (index.html)
    # Servir siempre index.html para la SPA, ya que el enrutamiento lo hace el JS
    if path == '/' or path.startswith('/perfil/'): # El JS manejará el enrutamiento SPA
        try:
            with open(HTML_FILE, 'rb') as f:
                response_body = f.read()
            status = '200 OK'
            headers = [('Content-Type', 'text/html')]
            
            # Ejemplo de cómo usar una cookie (establece una cookie simple)
            # Aunque tu JS ya maneja las cookies, esto es para demostrar la capacidad de Python
            if 'my_app_cookie' not in environ.get('HTTP_COOKIE', ''):
                headers.append(('Set-Cookie', 'my_app_cookie=bienvenido; Path=/'))
            
            start_response(status, headers)
            return [response_body]
        except FileNotFoundError:
            status = '404 Not Found'
            headers = [('Content-Type', 'text/plain')]
            start_response(status, headers)
            return [b'Error: index.html no encontrado.']

    # Si no se encuentra ninguna ruta, devolver 404
    status = '404 Not Found'
    headers = [('Content-Type', 'text/plain')]
    start_response(status, headers)
    return [b'No encontrado']

# Envuelve la aplicación WSGI con Beaker para las sesiones
application = SessionMiddleware(application, session_opts)