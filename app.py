import os
import json
from beaker.middleware import SessionMiddleware
from beaker.cache import CacheManager
from beaker.util import parse_cache_config_options

cache_opts = {
    'cache.type': 'memory',
    'cache.expire': 3600
}
cache = CacheManager(**parse_cache_config_options(cache_opts))

session_opts = {
    'session.type': 'file',
    'session.cookie_expires': True,
    'session.data_dir': '/tmp/sessions',
    'session.auto': True
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_HTML_PATH = os.path.join(BASE_DIR, 'index.html')

def get_mime_type(file_path):
    if file_path.endswith('.html'):
        return 'text/html'
    elif file_path.endswith('.css'):
        return 'text/css'
    elif file_path.endswith('.js'):
        return 'application/javascript'
    elif file_path.endswith('.json'):
        return 'application/json'
    elif file_path.endswith(('.jpg', '.jpeg')):
        return 'image/jpeg'
    elif file_path.endswith('.png'):
        return 'image/png'
    elif file_path.endswith('.ico'):
        return 'image/x-icon'
    else:
        return 'application/octet-stream' 

def application(environ, start_response):

    script_name = environ.get('SCRIPT_NAME', '') 
    path_info = environ.get('PATH_INFO', '') 

    full_path_requested = script_name + path_info

    session = environ['beaker.session'] 

    if 'visit_count' not in session:
        session['visit_count'] = 0
    session['visit_count'] += 1
    print(f"Sesión activa. Visitas: {session['visit_count']}")
    session.save() 
    
    relative_file_path = full_path_requested[len(script_name):]
    
    if relative_file_path == '/' or relative_file_path == '':
        file_to_serve = INDEX_HTML_PATH
    else:
        file_to_serve = os.path.join(BASE_DIR, relative_file_path.lstrip('/'))

    if relative_file_path == 'favicon.ico':
        file_to_serve = os.path.join(BASE_DIR, 'favicon.ico')

    if os.path.exists(file_to_serve) and os.path.isfile(file_to_serve):
        status = '200 OK'
        headers = [('Content-Type', get_mime_type(file_to_serve))]
        try:
            with open(file_to_serve, 'rb') as f:
                response_body = f.read()
            start_response(status, headers)
            return [response_body]
        except Exception as e:
            print(f"Error al leer el archivo {file_to_serve}: {e}")
            status = '500 Internal Server Error'
            headers = [('Content-Type', 'text/plain')]
            start_response(status, headers)
            return [b'Error interno del servidor al servir el archivo.']
    else:

        if path_info.startswith('/perfil/') or path_info == '':
            try:
                with open(INDEX_HTML_PATH, 'rb') as f:
                    response_body = f.read()
                status = '200 OK'
                headers = [('Content-Type', 'text/html')]
                start_response(status, headers)
                return [response_body]
            except FileNotFoundError:
                status = '404 Not Found'
                headers = [('Content-Type', 'text/plain')]
                start_response(status, headers)
                return [b'Error: index.html no encontrado.']

    status = '404 Not Found'
    headers = [('Content-Type', 'text/plain')]
    start_response(status, headers)
    return [b'Recurso no encontrado.']

application = SessionMiddleware(application, session_opts)
