"""Local dev server: python scripts/serve.py  (then open http://localhost:8000/)

Same as `python -m http.server`, but tells the browser never to cache, so edits to CSS/JS
show up on a normal reload. For local development only; GitHub Pages serves the real app.
"""
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("", PORT), partial(NoCacheHandler, directory=ROOT))
    print(f"Serving {ROOT} at http://localhost:{PORT}/ (no caching)")
    server.serve_forever()
