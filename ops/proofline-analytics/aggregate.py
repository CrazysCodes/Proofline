#!/usr/bin/env python3
"""Incrementally aggregate Proofline page views from an Nginx JSON log."""

from __future__ import annotations

import argparse
import hashlib
import hmac
import html
import json
import os
import re
import secrets
import sqlite3
import tempfile
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any


DEFAULT_LOG_PATH = Path("/var/log/nginx/proofline-analytics.log")
DEFAULT_DATA_DIR = Path("/srv/services/data/proofline-analytics")

BOT_PATTERN = re.compile(
    r"bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headless|"
    r"curl|wget|python-requests|go-http-client|uptime|monitor|smoketest",
    re.IGNORECASE,
)
PAGE_PATTERN = re.compile(r"^/(?:writing|projects|tags)/[^/]+$")
PAGE_INDEXES = {
    "/",
    "/about",
    "/archive",
    "/projects",
    "/research",
    "/tags",
    "/writing",
}


def atomic_write(path: Path, content: str, mode: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", dir=path.parent, delete=False
    ) as handle:
        handle.write(content)
        temp_path = Path(handle.name)
    os.chmod(temp_path, mode)
    os.replace(temp_path, path)


def load_or_create_secret(data_dir: Path) -> bytes:
    path = data_dir / "visitor-secret"
    if path.exists():
        return path.read_bytes().strip()

    secret = secrets.token_hex(32).encode("ascii")
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "wb") as handle:
        handle.write(secret + b"\n")
    return secret


def normalize_page_path(raw_path: str) -> str | None:
    path = raw_path.strip()
    if not path.startswith("/") or "\x00" in path:
        return None
    if path != "/":
        path = path.rstrip("/")
    if path in PAGE_INDEXES or PAGE_PATTERN.fullmatch(path):
        return path
    return None


def parse_event(payload: dict[str, Any], secret: bytes) -> tuple[str, str, str, str] | None:
    if payload.get("method") != "GET":
        return None
    try:
        if int(payload.get("status", 0)) != 200:
            return None
    except (TypeError, ValueError):
        return None

    content_type = str(payload.get("content_type", "")).lower()
    if not content_type.startswith("text/html"):
        return None

    args = str(payload.get("args", ""))
    if payload.get("prefetch") == "1" or payload.get("rsc") == "1" or "_rsc=" in args:
        return None

    user_agent = str(payload.get("ua", ""))
    if not user_agent or BOT_PATTERN.search(user_agent):
        return None

    path = normalize_page_path(str(payload.get("uri", "")))
    if path is None:
        return None

    timestamp = str(payload.get("time", ""))
    try:
        observed_at = datetime.fromisoformat(timestamp)
    except ValueError:
        return None
    day = observed_at.date().isoformat()

    client_ip = str(payload.get("ip", ""))
    visitor_material = f"{day}\0{client_ip}\0{user_agent}".encode("utf-8")
    visitor_hash = hmac.new(secret, visitor_material, hashlib.sha256).hexdigest()
    return day, path, visitor_hash, timestamp


def initialize_database(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS page_daily (
            day TEXT NOT NULL,
            path TEXT NOT NULL,
            pv INTEGER NOT NULL DEFAULT 0,
            last_seen TEXT NOT NULL,
            PRIMARY KEY (day, path)
        );
        CREATE TABLE IF NOT EXISTS visitors (
            day TEXT NOT NULL,
            path TEXT NOT NULL,
            visitor_hash TEXT NOT NULL,
            PRIMARY KEY (day, path, visitor_hash)
        );
        CREATE TABLE IF NOT EXISTS metadata (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        """
    )


def metadata_value(connection: sqlite3.Connection, key: str) -> str | None:
    row = connection.execute(
        "SELECT value FROM metadata WHERE key = ?", (key,)
    ).fetchone()
    return None if row is None else str(row[0])


def set_metadata(connection: sqlite3.Connection, key: str, value: str) -> None:
    connection.execute(
        """
        INSERT INTO metadata (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """,
        (key, value),
    )


def process_log(
    connection: sqlite3.Connection, log_path: Path, secret: bytes
) -> tuple[int, int]:
    if not log_path.exists():
        return 0, 0

    stat = log_path.stat()
    previous_inode = metadata_value(connection, "log_inode")
    previous_offset = metadata_value(connection, "log_offset")
    offset = int(previous_offset or 0)
    if previous_inode != str(stat.st_ino) or offset > stat.st_size:
        offset = 0

    lines_read = 0
    accepted = 0
    with log_path.open("rb") as handle:
        handle.seek(offset)
        while True:
            line_start = handle.tell()
            raw_line = handle.readline()
            if not raw_line:
                break
            if not raw_line.endswith(b"\n"):
                handle.seek(line_start)
                break
            lines_read += 1
            try:
                payload = json.loads(raw_line.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                continue
            event = parse_event(payload, secret)
            if event is None:
                continue

            day, path, visitor_hash, timestamp = event
            connection.execute(
                """
                INSERT INTO page_daily (day, path, pv, last_seen)
                VALUES (?, ?, 1, ?)
                ON CONFLICT(day, path) DO UPDATE SET
                    pv = page_daily.pv + 1,
                    last_seen = excluded.last_seen
                """,
                (day, path, timestamp),
            )
            connection.execute(
                "INSERT OR IGNORE INTO visitors (day, path, visitor_hash) VALUES (?, ?, ?)",
                (day, path, visitor_hash),
            )
            accepted += 1

        new_offset = handle.tell()

    set_metadata(connection, "log_inode", str(stat.st_ino))
    set_metadata(connection, "log_offset", str(new_offset))
    return lines_read, accepted


def collect_report_data(connection: sqlite3.Connection) -> dict[str, Any]:
    today = date.today()
    today_text = today.isoformat()
    seven_days_ago = (today - timedelta(days=6)).isoformat()
    fourteen_days_ago = (today - timedelta(days=13)).isoformat()

    page_rows = connection.execute(
        """
        SELECT
            path,
            SUM(pv) AS pv_total,
            SUM(CASE WHEN day = ? THEN pv ELSE 0 END) AS pv_today,
            SUM(CASE WHEN day >= ? THEN pv ELSE 0 END) AS pv_7d,
            MAX(last_seen) AS last_seen
        FROM page_daily
        GROUP BY path
        ORDER BY pv_total DESC, path ASC
        """,
        (today_text, seven_days_ago),
    ).fetchall()

    visitor_rows = connection.execute(
        """
        SELECT
            path,
            COUNT(*) AS uv_daily_total,
            SUM(CASE WHEN day = ? THEN 1 ELSE 0 END) AS uv_today,
            SUM(CASE WHEN day >= ? THEN 1 ELSE 0 END) AS uv_7d
        FROM visitors
        GROUP BY path
        """,
        (today_text, seven_days_ago),
    ).fetchall()
    visitors_by_path = {
        str(row[0]): {
            "uvDailyTotal": int(row[1]),
            "uvToday": int(row[2]),
            "uv7d": int(row[3]),
        }
        for row in visitor_rows
    }

    pages = []
    for path, pv_total, pv_today, pv_7d, last_seen in page_rows:
        visitor_data = visitors_by_path.get(str(path), {})
        pages.append(
            {
                "path": str(path),
                "pvTotal": int(pv_total),
                "pvToday": int(pv_today),
                "pv7d": int(pv_7d),
                "uvDailyTotal": int(visitor_data.get("uvDailyTotal", 0)),
                "uvToday": int(visitor_data.get("uvToday", 0)),
                "uv7d": int(visitor_data.get("uv7d", 0)),
                "lastSeen": str(last_seen),
            }
        )

    daily_pv = {
        str(row[0]): int(row[1])
        for row in connection.execute(
            """
            SELECT day, SUM(pv)
            FROM page_daily
            WHERE day >= ?
            GROUP BY day
            """,
            (fourteen_days_ago,),
        ).fetchall()
    }
    daily_uv = {
        str(row[0]): int(row[1])
        for row in connection.execute(
            """
            SELECT day, COUNT(DISTINCT visitor_hash)
            FROM visitors
            WHERE day >= ?
            GROUP BY day
            """,
            (fourteen_days_ago,),
        ).fetchall()
    }
    daily = []
    for day_offset in range(13, -1, -1):
        day_text = (today - timedelta(days=day_offset)).isoformat()
        daily.append(
            {
                "day": day_text,
                "pv": daily_pv.get(day_text, 0),
                "uv": daily_uv.get(day_text, 0),
            }
        )

    total_pv = sum(page["pvTotal"] for page in pages)
    today_pv = sum(page["pvToday"] for page in pages)
    seven_day_pv = sum(page["pv7d"] for page in pages)
    today_uv_row = connection.execute(
        "SELECT COUNT(DISTINCT visitor_hash) FROM visitors WHERE day = ?",
        (today_text,),
    ).fetchone()

    return {
        "generatedAt": datetime.now().astimezone().isoformat(timespec="seconds"),
        "summary": {
            "trackedPages": len(pages),
            "pvTotal": total_pv,
            "pvToday": today_pv,
            "pv7d": seven_day_pv,
            "uvToday": int(today_uv_row[0] if today_uv_row else 0),
        },
        "pages": pages,
        "daily": daily,
    }


def render_report(data: dict[str, Any]) -> str:
    summary = data["summary"]
    page_rows = "".join(
        "<tr>"
        f"<td><code>{html.escape(page['path'])}</code></td>"
        f"<td>{page['pvTotal']}</td>"
        f"<td>{page['pvToday']}</td>"
        f"<td>{page['pv7d']}</td>"
        f"<td>{page['uvDailyTotal']}</td>"
        f"<td>{page['uvToday']}</td>"
        f"<td>{html.escape(page['lastSeen'])}</td>"
        "</tr>"
        for page in data["pages"]
    ) or '<tr><td colspan="7" class="empty">尚无符合条件的页面访问</td></tr>'

    daily_rows = "".join(
        f"<tr><td>{item['day']}</td><td>{item['pv']}</td><td>{item['uv']}</td></tr>"
        for item in reversed(data["daily"])
    )

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Proofline 访问统计</title>
  <style>
    :root {{ color-scheme: light dark; font-family: system-ui, sans-serif; }}
    body {{ max-width: 1180px; margin: 0 auto; padding: 32px 20px 64px; }}
    h1 {{ margin-bottom: 8px; }}
    .muted {{ color: #777; }}
    .cards {{ display: grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap: 12px; margin: 24px 0; }}
    .card {{ border: 1px solid #aaa6; border-radius: 10px; padding: 16px; }}
    .card strong {{ display: block; font-size: 1.7rem; margin-top: 6px; }}
    .table-wrap {{ overflow-x: auto; margin-bottom: 32px; }}
    table {{ width: 100%; border-collapse: collapse; }}
    th, td {{ padding: 10px 12px; border-bottom: 1px solid #aaa5; text-align: left; white-space: nowrap; }}
    th {{ font-size: .85rem; }}
    code {{ white-space: normal; }}
    .empty {{ text-align: center; padding: 32px; }}
  </style>
</head>
<body>
  <h1>Proofline 访问统计</h1>
  <div class="muted">生成时间：{html.escape(data['generatedAt'])}；统计从功能启用后开始。</div>
  <section class="cards">
    <div class="card">累计 PV<strong>{summary['pvTotal']}</strong></div>
    <div class="card">今日 PV<strong>{summary['pvToday']}</strong></div>
    <div class="card">近 7 天 PV<strong>{summary['pv7d']}</strong></div>
    <div class="card">今日 UV<strong>{summary['uvToday']}</strong></div>
    <div class="card">已访问页面<strong>{summary['trackedPages']}</strong></div>
  </section>
  <h2>页面访问量</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>页面</th><th>累计 PV</th><th>今日 PV</th><th>近 7 天 PV</th><th>累计日 UV</th><th>今日 UV</th><th>最近访问</th></tr></thead>
      <tbody>{page_rows}</tbody>
    </table>
  </div>
  <h2>最近 14 天</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>日期</th><th>PV</th><th>UV</th></tr></thead>
      <tbody>{daily_rows}</tbody>
    </table>
  </div>
  <p class="muted">UV 使用每日 HMAC 标识估算；爬虫、监控、静态资源、RSC 和预加载请求不计入。</p>
</body>
</html>
"""


def aggregate(log_path: Path, data_dir: Path) -> dict[str, int]:
    data_dir.mkdir(parents=True, exist_ok=True)
    # The www-data group receives traverse-only access to the data directory.
    # SQLite and the visitor secret remain 0600; only the standalone HTML report
    # and the limited public page-view feed are group-readable. The service runs
    # with www-data as its primary group so
    # atomic report replacements inherit the correct group without chown access.
    os.chmod(data_dir, 0o710)
    report_dir = data_dir / "report"
    report_dir.mkdir(parents=True, exist_ok=True)
    os.chmod(report_dir, 0o750)
    secret = load_or_create_secret(data_dir)

    database_path = data_dir / "analytics.sqlite3"
    connection = sqlite3.connect(database_path)
    try:
        initialize_database(connection)
        connection.execute("BEGIN IMMEDIATE")
        lines_read, accepted = process_log(connection, log_path, secret)
        connection.commit()
        data = collect_report_data(connection)
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
    os.chmod(database_path, 0o600)

    atomic_write(
        report_dir / "data.json",
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        0o600,
    )
    public_views = {
        "generatedAt": data["generatedAt"],
        "pages": {page["path"]: page["pvTotal"] for page in data["pages"]},
    }
    atomic_write(
        report_dir / "public-views.json",
        json.dumps(public_views, ensure_ascii=False, separators=(",", ":")) + "\n",
        0o640,
    )
    atomic_write(report_dir / "index.html", render_report(data), 0o640)
    return {"linesRead": lines_read, "pageViewsAdded": accepted}


def self_test() -> None:
    with tempfile.TemporaryDirectory() as temporary_directory:
        root = Path(temporary_directory)
        log_path = root / "access.log"
        human = "Mozilla/5.0 Test Browser"
        events = [
            {"time": "2026-09-06T10:00:00+08:00", "method": "GET", "uri": "/", "args": "", "status": 200, "content_type": "text/html; charset=utf-8", "ua": human, "ip": "192.0.2.1", "prefetch": "", "rsc": ""},
            {"time": "2026-09-06T10:01:00+08:00", "method": "GET", "uri": "/writing/example", "args": "", "status": 200, "content_type": "text/html; charset=utf-8", "ua": human, "ip": "192.0.2.1", "prefetch": "", "rsc": ""},
            {"time": "2026-09-06T10:02:00+08:00", "method": "GET", "uri": "/writing/example", "args": "_rsc=test", "status": 200, "content_type": "text/x-component", "ua": human, "ip": "192.0.2.1", "prefetch": "1", "rsc": "1"},
            {"time": "2026-09-06T10:03:00+08:00", "method": "GET", "uri": "/about", "args": "", "status": 200, "content_type": "text/html", "ua": "ProoflineAnalyticsSmokeTest", "ip": "192.0.2.2", "prefetch": "", "rsc": ""},
            {"time": "2026-09-06T10:04:00+08:00", "method": "GET", "uri": "/_next/static/app.js", "args": "", "status": 200, "content_type": "application/javascript", "ua": human, "ip": "192.0.2.1", "prefetch": "", "rsc": ""},
        ]
        log_path.write_text(
            "".join(json.dumps(event) + "\n" for event in events), encoding="utf-8"
        )
        result = aggregate(log_path, root / "data")
        report = json.loads((root / "data" / "report" / "data.json").read_text("utf-8"))
        assert result == {"linesRead": 5, "pageViewsAdded": 2}
        assert report["summary"]["pvTotal"] == 2
        assert {page["path"] for page in report["pages"]} == {"/", "/writing/example"}
        public_views = json.loads((root / "data" / "report" / "public-views.json").read_text("utf-8"))
        assert public_views["pages"] == {"/": 1, "/writing/example": 1}
        assert set(public_views) == {"generatedAt", "pages"}
    print("SELF_TEST_OK")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--log", type=Path, default=DEFAULT_LOG_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--self-test", action="store_true")
    arguments = parser.parse_args()
    if arguments.self_test:
        self_test()
        return
    result = aggregate(arguments.log, arguments.data_dir)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
