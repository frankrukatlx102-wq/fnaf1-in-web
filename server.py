#!/usr/bin/env python3
"""
Custom HTTP preview server for Five Nights at Maler.
Provides static asset delivery with authenticated cryptographic save synchronization.
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
                default_vault = manage_save.create_vault_save(1, 0, False)
                with open(save_file, "w") as f:
                    f.write(default_vault + "\n")
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
            valid, reason, data = manage_save.verify_vault_save(body)
            if not valid:
                self.send_response(403)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(f'{{"error":"TAMPERING_DETECTED","reason":"{reason}"}}'.encode("utf-8"))
                print(f"[SECURITY ALERT] Rejected tampered save attempt: {reason}")
                return
            
            with open(manage_save.SAVE_FILE, "w") as f:
                f.write(body + "\n")
            print(f"[SECURITY] Successfully saved authenticated Night {data.get('night')} progress to .savedata")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"SAVED_AUTHENTICATED"}')
            return
        return super().do_POST()

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, FazbearRequestHandler)
    print(f"==========================================================")
    print(f"  FIVE NIGHTS AT MALER - HTTP SECURE PREVIEW SERVER       ")
    print(f"  Listening on: http://localhost:{PORT}/                 ")
    print(f"  Cryptographic Save Sync: ACTIVE (.savedata)             ")
    print(f"==========================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
