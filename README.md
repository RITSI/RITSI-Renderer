# RITSI Renderer

Conversor de documentos en Markdown a LaTeX

## Instalación

### Python

Todo el desarrollo está siendo realizado en Python 3. La compatibilidad con Python 2 no está garantizada. Para instalar las dependencias, es necesario ejecutar: 

```
virtualenv -p python3 env
source env/bin/activate
pip install -r requirements.txt
```

El proyecto depende únicamente de [Tornado](http://tornadoweb.org/) y [markdown2latex](https://github.com/Alternhuman/markdown2latex)

### Frontend

La única dependencia a instalar es [font-awesome](http://fortawesome.github.io/Font-Awesome/icons/). Se incluye archivo `bower.json` con la versión adecuada.

## Ejecución

Arrancar el servicio es simple, únicamente es necesario ejecutar `python backend/service.py` y acceder en el navegador a `localhost:9000`.

## Licencia

    MIT License
    
    Copyright (c) [2016] [Asociación RITSI]
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
