#!/usr/bin/env python3
"""Generate public/sitemap.xml from the JSON database in public/data/.

Base URL comes from src/data/site.ts (siteUrl) so there is one place to
change at launch. Run after scripts/build-db.py:  python3 scripts/gen-sitemap.py
"""
import json
import os
import re
from datetime import date

ROOT = os.path.join(os.path.dirname(__file__), '..')
DATA = os.path.join(ROOT, 'public', 'data')

site_ts = open(os.path.join(ROOT, 'src', 'data', 'site.ts'), encoding='utf-8').read()
base = re.search(r"siteUrl = '([^']+)'", site_ts).group(1).rstrip('/')

def load(name):
    with open(os.path.join(DATA, name), encoding='utf-8') as f:
        return json.load(f)

today = date.today().isoformat()
urls = []  # (path, priority, changefreq)

for path, prio, freq in [
    ('/', '1.0', 'daily'),
    ('/categories', '0.9', 'weekly'),
    ('/agents', '0.9', 'weekly'),
    ('/companies', '0.8', 'weekly'),
    ('/tutorials', '0.8', 'weekly'),
    ('/new', '0.7', 'daily'),
    ('/search', '0.5', 'monthly'),
]:
    urls.append((path, prio, freq))

for c in load('categories.json'):
    urls.append((f"/category/{c['slug']}", '0.8', 'weekly'))
for t in load('tools.json'):
    urls.append((f"/tool/{t['slug']}", '0.6', 'monthly'))
for a in load('agents.json'):
    urls.append((f"/agent/{a['slug']}", '0.6', 'monthly'))
for c in load('companies.json'):
    urls.append((f"/company/{c['slug']}", '0.5', 'monthly'))
for t in load('tutorials.json'):
    urls.append((f"/tutorial/{t['slug']}", '0.7', 'monthly'))

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path, prio, freq in urls:
    lines.append('  <url>')
    lines.append(f'    <loc>{base}{path}</loc>')
    lines.append(f'    <lastmod>{today}</lastmod>')
    lines.append(f'    <changefreq>{freq}</changefreq>')
    lines.append(f'    <priority>{prio}</priority>')
    lines.append('  </url>')
lines.append('</urlset>')

out = os.path.join(ROOT, 'public', 'sitemap.xml')
with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print(f'sitemap.xml: {len(urls)} URLs (base {base})')
