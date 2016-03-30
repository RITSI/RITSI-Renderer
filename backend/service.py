#!/usr/bin/env python3
import tornado.ioloop
import tornado.web
import tornado.gen

import json
import os, sys
import tempfile
from zipfile import ZipFile
from mdx_latex import LaTeXExtension
from markdown import Markdown

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
STATIC_DIR = os.path.join(CURRENT_DIR, 'static')

# Folders within the zip file. Make sure that they are the same as in the Frontend
IMAGES_DIR = 'images'
DATA_DIR = 'data'

PORT = 9000
DEBUG = True

class RenderHandler(tornado.web.RequestHandler):
    """
    Handles petitions for rendering
    """

    def initialize(self):
        """
        Creates the local Markdown object and patches it to use the LaTeX Plugin
        """
        self.md = Markdown()
        mkdn2latex = LaTeXExtension(configs={}, maketitle=True)
        mkdn2latex.extendMarkdown(self.md, Markdown.__dict__)

    @tornado.web.asynchronous
    def post(self):
        """
        Receives the markdown data and transforms it to LaTeX.
        The data is received as a multipart form, with the keys `markdown-data`, `settings` and the file objects
        """
        markdown_data = self.get_body_argument('markdown-data', '')

        processed_latex = self.md.convert(markdown_data)

        # File POST data is added to a zip file, which is created as a temporary file
        # TODO: This could be of help: https://docs.python.org/3.5/library/tempfile.html#tempfile.SpooledTemporaryFile
        with tempfile.NamedTemporaryFile() as tmp_file_obj:
            # Creation of the zip file
            zip_file = ZipFile(tmp_file_obj, mode='w')
            # Adds transpiled LaTeX data
            zip_file.writestr('render/markdown.tex', processed_latex)
            # Adds all the images to a folder inside the file
            # TODO: Check for files with the same name
            for key in self.request.files.keys():
                zip_file.writestr('render/images/%s' % key, self.request.files[key][0]['body'])
            # It is required to close the file before sending it, otherwise it causes conflict with tmp_file_obj
            zip_file.close()

            with open(tmp_file_obj.name, 'rb') as z:
                # Sends the data
                self.set_header('Content-Type', 'application/zip')
                self.write(z.read())
                self.finish()


# Web application routes
app = tornado.web.Application([
    (r'/render/', RenderHandler), # API endpoint for rendering
    (r'/(.*)',
        tornado.web.StaticFileHandler,
        {"path": STATIC_DIR,
         "default_filename": "index.html"}) # Static file server for frontend
], debug=DEBUG)


if __name__ == "__main__":
    app.listen(PORT)
    print("Listening on port %s" % PORT)
    tornado.ioloop.IOLoop.instance().start()
