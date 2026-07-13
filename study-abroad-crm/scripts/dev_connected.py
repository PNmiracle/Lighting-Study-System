import os
import signal
import subprocess
from pathlib import Path
from http.server import ThreadingHTTPServer

from vika_api import Handler


def main():
    root = Path(__file__).resolve().parent.parent
    api = ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("VIKA_API_PORT", "4175"))), Handler)
    child_env = os.environ.copy()
    child_env.pop("VIKA_TOKEN", None)
    vite = subprocess.Popen(
        ["node", str(root / "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", os.environ.get("PORT", "4174")],
        cwd=root,
        env=child_env,
    )
    print("Vika API proxy listening on http://127.0.0.1:4175")
    print("CRM frontend listening on http://127.0.0.1:4174")
    try:
        api.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        api.server_close()
        vite.send_signal(signal.SIGTERM)
        vite.wait(timeout=5)


if __name__ == "__main__":
    main()
