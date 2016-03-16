import tornado.ioloop
import tornado.web
import json
import os, sys

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
    def post(self):
        markdown_data = self.get_body_argument('text-input-area', '')
        self.write("Good")


app = tornado.web.Application([
    (r'/render/', RenderHandler),
    (r'/(.*)', tornado.web.StaticFileHandler, {"path": STATIC_DIR, "default_filename": "index.html"})
], debug=True)


if __name__ == "__main__":
    app.listen(PORT)
    tornado.ioloop.IOLoop.instance().start()
