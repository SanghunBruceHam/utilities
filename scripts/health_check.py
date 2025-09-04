#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

HTML_REF_RE = re.compile(
    r"(?:href|src)\s*=\s*\"([^\"#?]+)\"|(?:href|src)\s*=\s*'([^'?#]+)'",
    re.IGNORECASE,
)


def is_external(url: str) -> bool:
    return url.startswith("http://") or url.startswith("https://") or url.startswith("mailto:") or url.startswith("tel:")


def normalize_path(base: Path, ref: str) -> Path:
    # Root-relative
    if ref.startswith('/'):
        return ROOT / ref.lstrip('/')
    # Anchors or empty
    if not ref or ref.startswith('#'):
        return None
    # Relative to the file
    return (base.parent / ref).resolve()


def collect_html_files(root: Path) -> list[Path]:
    html_files = []
    for p in root.rglob('*.html'):
        if any(seg in p.parts for seg in ('.git', 'node_modules', 'attached_assets')):
            continue
        html_files.append(p)
    return html_files


def scan_html_refs(html_files: list[Path]):
    missing = []
    refs = set()
    for f in html_files:
        try:
            content = f.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        for m in HTML_REF_RE.finditer(content):
            candidate = m.group(1) or m.group(2)
            if not candidate or is_external(candidate):
                continue
            # Skip data URIs
            if candidate.startswith('data:'):
                continue
            p = normalize_path(f, candidate)
            if p is None:
                continue
            refs.add((f, candidate, p))
            if not p.exists():
                missing.append((f, candidate))
    return refs, missing


def parse_sw_cache(sw_path: Path):
    urls = []
    if not sw_path.exists():
        return urls
    text = sw_path.read_text(encoding='utf-8', errors='ignore')
    # Naive parse of urlsToCache array
    m = re.search(r"urlsToCache\s*=\s*\[(.*?)\]", text, re.S)
    if not m:
        return urls
    arr = m.group(1)
    for s in re.findall(r"'([^']+)'|\"([^\"]+)\"", arr):
        candidate = s[0] or s[1]
        if candidate:
            urls.append(candidate)
    return urls


def main():
    failures = 0
    print("== Project Service Health Check ==")
    # 1) Required top-level files
    required = [
        ROOT / 'index.html',
        ROOT / 'robots.txt',
        ROOT / 'sitemap.xml',
        ROOT / 'sw.js',
        ROOT / 'CNAME',
    ]
    for p in required:
        if p.exists():
            print(f"[OK] {p.relative_to(ROOT)} present")
        else:
            print(f"[MISS] {p.relative_to(ROOT)} not found")
            failures += 1

    # 2) HTML references
    html_files = collect_html_files(ROOT)
    refs, missing = scan_html_refs(html_files)
    print(f"[INFO] HTML files scanned: {len(html_files)}; local refs: {len(refs)}")
    if missing:
        failures += len(missing)
        print(f"[FAIL] Missing referenced assets: {len(missing)}")
        for f, ref in sorted(missing)[:50]:
            rel = f.relative_to(ROOT)
            print(f"  - {rel} -> {ref}")
        if len(missing) > 50:
            print(f"  ... and {len(missing) - 50} more")
    else:
        print("[OK] No missing local asset references found")

    # 3) Service worker cache entries exist
    sw_urls = parse_sw_cache(ROOT / 'sw.js')
    if sw_urls:
        print(f"[INFO] Service worker cache entries: {len(sw_urls)}")
        sw_missing = []
        for u in sw_urls:
            path = (ROOT / u.lstrip('/')) if u != '/' else (ROOT / 'index.html')
            if not path.exists():
                sw_missing.append(u)
        if sw_missing:
            failures += len(sw_missing)
            print(f"[FAIL] SW cache references missing: {len(sw_missing)}")
            for u in sw_missing:
                print(f"  - {u}")
        else:
            print("[OK] All SW cached URLs exist")
    else:
        print("[WARN] No urlsToCache parsed from sw.js")

    # 4) Sitemap sanity: entries correspond to files
    site_urls = []
    sm_path = ROOT / 'sitemap.xml'
    if sm_path.exists():
        try:
            sm = sm_path.read_text(encoding='utf-8', errors='ignore')
            site_urls = re.findall(r"<loc>([^<]+)</loc>", sm)
        except Exception:
            pass
    sitemap_missing = []
    for url in site_urls:
        # map URL path to local path
        try:
            path_part = url.split('://', 1)[1]
            path = '/' + path_part.split('/', 1)[1]
        except Exception:
            continue
        local = ROOT / path.lstrip('/')
        if not local.exists():
            sitemap_missing.append(url)
    if sitemap_missing:
        failures += len(sitemap_missing)
        print(f"[WARN] Sitemap entries not found locally: {len(sitemap_missing)}")
        for u in sitemap_missing[:30]:
            print(f"  - {u}")
        if len(sitemap_missing) > 30:
            print(f"  ... and {len(sitemap_missing) - 30} more")
    else:
        print("[OK] Sitemap URLs map to local files")

    # 5) Environment hint for GSC submission
    print("[INFO] GSC submit requires env var: GSC_CREDENTIALS_BASE64")

    if failures:
        print(f"\nSUMMARY: Issues found: {failures}")
        sys.exit(1)
    else:
        print("\nSUMMARY: All checks passed")


if __name__ == '__main__':
    main()

