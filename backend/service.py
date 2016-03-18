#!/usr/bin/env python3
import tornado.ioloop
import tornado.web
import json
import os, sys
import tempfile
from zipfile import ZipFile

from io import StringIO ## TODO: Have a look at cStringIO

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
STATIC_DIR = os.path.join(CURRENT_DIR, 'static')


PORT = 9000
"""
class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        pass

    def post(self):
        pass

    def prepare(self):
        self.json_args = json.loads(self.request.body) \
            if self.request.headers["Content-Type"].startswidth("application/json") \
            else None

"""

class RenderHandler(tornado.web.RequestHandler):

    def get(self):
        zipfile_name = "/Users/martin/Desktop/demo.zip"
        with open(zipfile_name, 'rb') as z:
            self.set_header('Content-Type', 'application/zip')
            self.write(z.read())
            self.finish()


    def post(self):
        markdown_data = self.get_body_argument('markdown-data', '')

        zipfile_name = "/Users/martin/Desktop/demo.zip"
        zip_file = ZipFile(zipfile_name, mode='w')
        zip_file.writestr('dir/markdown.tex', markdown_data)
        for key in self.request.files.keys():
            zip_file.writestr('dir/images/%s' % key, self.request.files[key][0]['body'])

        zip_file.close()
        with open(zipfile_name, 'rb') as z:
            self.set_header('Content-Type', 'application/zip')
            #self.set_header("Content-Disposition", "attachment; filename=\"{$strFileName}\"");

            #self.set_header("Content-Transfer-Encoding", "binary");
            #z.seek(0, os.SEEK_END)
            #self.set_header("Content-Length", z.tell());

            self.write(z.read())

            self.finish()
        #self.write("OK")

        # markdown_data = self.get_body_argument('markdown-data', '')
        #
        # with tempfile.NamedTemporaryFile() as tmp_zip_file_obj:
        #
        #     zip_file = ZipFile(tmp_zip_file_obj.name, mode='w')
        #
        #     with tempfile.TemporaryDirectory() as tmpdirname:
        #         files = []
        #         for key in self.request.files.keys():
        #             fp = tempfile.NamedTemporaryFile(dir=tmpdirname)
        #             fp.write(self.request.files[key][0]['body'])
        #             fp.seek(0)
        #             files.append(fp)
        #             zip_file.writestr('images/%s' % key, fp.read())
        #
        #         #md_file = StringIO()
        #         #md_file.write(markdown_data)
        #         zip_file.writestr('markdown.tex', markdown_data)
        #         #md_file.close()
        #
        #
        #     self.set_header('Content-Type', 'application/zip')
        #     self.write(tmp_zip_file_obj.read())
        #     self.finish()#print(tmp_zip_file_obj.closed)
        # #self.write("Good")


app = tornado.web.Application([
    (r'/render/', RenderHandler),
    (r'/delete/(.*)', tornado.web.StaticFileHandler, {"path": "/Users/martin/Desktop"}),
    (r'/(.*)', tornado.web.StaticFileHandler, {"path": STATIC_DIR, "default_filename": "index.html"})
], debug=True)


if __name__ == "__main__":
    app.listen(PORT)
    print("Listening on port %s" % PORT)
    tornado.ioloop.IOLoop.instance().start()
