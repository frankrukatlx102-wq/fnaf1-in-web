#!/usr/bin/env python3
"""
HTTP preview server for Five Nights at Freddy's.
Provides static asset delivery and save data synchronization (.savedata).
"""
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import manage_save

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class FazbearRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == "/api/save":
            save_file = manage_save.SAVE_FILE
            if not os.path.exists(save_file):
                default_save = manage_save.create_save_data(1, 0, False)
                with open(save_file, "w") as f:
                    f.write(default_save + "\n")
            with open(save_file, "r") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(content.encode("utf-8"))
            return
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/save":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8")
            valid, reason, data = manage_save.verify_save_data(body)
            if not valid:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(f'{{"error":"INVALID_SAVE_DATA","reason":"{reason}"}}'.encode("utf-8"))
                print(f"[SAVE] Rejected invalid save payload: {reason}")
                return

            with open(manage_save.SAVE_FILE, "w") as f:
                f.write(body + "\n")
            print(f"[SAVE] Progress synced: Night {data.get('night')} (Stars: {data.get('stars')}) -> .savedata")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"SAVED"}')
            return
        return super().do_POST()

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, FazbearRequestHandler)
    print(f"Five Nights at Freddy's preview server running on http://localhost:{PORT}/")
    print(f"Save synchronization active (.savedata)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
