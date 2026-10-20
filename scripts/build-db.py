#!/usr/bin/env python3
"""Build the JSON database (public/data/*.json) from the generated TS sources.

The TS data files under src/data/ hold strict-JSON payloads, so we extract
them with a JSON decoder instead of evaluating TypeScript.

Outputs:
  public/data/*.json      — the live database the website fetches at runtime
  src/data/json/*.json    — mirror copy for repo browsing (kept in sync)

Run: python3 scripts/build-db.py
"""
import glob
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'src', 'data')


def extract_payload(path):
    """Return the JSON value assigned in a generated TS data file."""
    text = open(path, encoding='utf-8').read()
    m = re.search(r'export const \w+(?:: [^=]+)? = ', text)
    if not m:
        raise ValueError(f'no export payload in {path}')
    start = m.end()
    # First JSON opener at/after the assignment.
    idx = min(i for i in (text.find('[', start), text.find('{', start)) if i != -1)
    value, _ = json.JSONDecoder().raw_decode(text[idx:])
    return value


def merge_chunks(pattern):
    merged = {}
    for path in sorted(glob.glob(os.path.join(SRC, pattern)),
                       key=lambda p: int(re.search(r'-(\d+)\.ts$', p).group(1))):
        merged.update(extract_payload(path))
    return merged


def concat_chunks(pattern):
    merged = []
    for path in sorted(glob.glob(os.path.join(SRC, pattern)),
                       key=lambda p: int(re.search(r'-(\d+)\.ts$', p).group(1))):
        merged.extend(extract_payload(path))
    return merged


def main():
    db = {
        'tools.json': concat_chunks('tools-chunk-*.ts'),
        'tool-details.json': merge_chunks('tool-details-chunk-*.ts'),
        'agents.json': concat_chunks('agents-chunk-*.ts'),
        'agent-details.json': merge_chunks('agent-details-chunk-*.ts'),
        'tutorials.json': concat_chunks('tutorials-chunk-*.ts'),
        'categories.json': extract_payload(os.path.join(SRC, 'categories.ts')),
        'companies.json': extract_payload(os.path.join(SRC, 'companies.ts')),
        'company-details.json': extract_payload(os.path.join(SRC, 'companyDetails.ts')),
        'launches.json': [],
    }
    # Hand-written sources that already have valid JSON mirrors.
    mirror = os.path.join(SRC, 'json')
    for name in ('navigation.json', 'tool-videos.json'):
        with open(os.path.join(mirror, name), encoding='utf-8') as f:
            db[name] = json.load(f)

    for out_dir in (os.path.join(ROOT, 'public', 'data'), mirror):
        os.makedirs(out_dir, exist_ok=True)
        for name, data in db.items():
            # Mirror folder historically uses companyDetails.json naming.
            out_name = 'companyDetails.json' if (out_dir == mirror and name == 'company-details.json') else name
            with open(os.path.join(out_dir, out_name), 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False)
    for name, data in db.items():
        count = len(data) if isinstance(data, list) else len(data.keys())
        print(f'{name}: {count}')


if __name__ == '__main__':
    main()
