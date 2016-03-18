#!/usr/bin/env python3
import tornado.ioloop
import tornado.web
import json
import os, sys
import tempfile
from zipfile import ZipFile

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
STATIC_DIR = os.path.join(CURRENT_DIR, 'static')

PORT = 9000

class RenderHandler(tornado.web.RequestHandler):

    def post(self):
        markdown_data = self.get_body_argument('markdown-data', '')

        with tempfile.NamedTemporaryFile() as tmp_file_obj:
            zip_file = ZipFile(tmp_file_obj, mode='w')
            zip_file.writestr('render/markdown.tex', markdown_data)
            for key in self.request.files.keys():
                zip_file.writestr('render/images/%s' % key, self.request.files[key][0]['body'])
            zip_file.close()

            with open(tmp_file_obj.name, 'rb') as z:
                self.set_header('Content-Type', 'application/zip')
                self.write(z.read())
                self.finish()



app = tornado.web.Application([
    (r'/render/', RenderHandler),
    (r'/(.*)', tornado.web.StaticFileHandler, {"path": STATIC_DIR, "default_filename": "index.html"})
], debug=True)


if __name__ == "__main__":
    app.listen(PORT)
    print("Listening on port %s" % PORT)
    tornado.ioloop.IOLoop.instance().start()
