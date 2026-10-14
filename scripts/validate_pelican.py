#!/usr/bin/env python3
"""Validate submission schema, references, SVG dimensions and content hashes."""
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]

def load(path):
    return json.loads(path.read_text(encoding='utf-8'))

def svg_check(root, item, display=True):
    path = (root / item['path']).resolve()
    if not path.is_relative_to((root / 'pelican-assets').resolve()):
        raise ValueError('asset path escapes pelican-assets')
    content = path.read_bytes()
    if hashlib.sha256(content).hexdigest() != item['sha256']:
        raise ValueError(f'{item["path"]}: SHA-256 mismatch')
    text = content.decode('utf-8')
    if re.search(r'<!\s*(DOCTYPE|ENTITY)', text, re.I):
        raise ValueError('DTD/entity declarations are not allowed')
    svg = ET.fromstring(text)
    if svg.tag != '{http://www.w3.org/2000/svg}svg':
        raise ValueError('root element must be an SVG in the SVG namespace')
    for node in svg.iter():
        tag = node.tag.split('}')[-1]
        if display and tag.lower() in ('script', 'foreignobject', 'image', 'animate', 'animatetransform', 'set'):
            raise ValueError(f'unsupported active/embedded SVG element: {tag}')
        for key, value in node.attrib.items():
            name = key.split('}')[-1].lower()
            if display and (name.startswith('on') or (name == 'href' and not value.startswith('#'))):
                raise ValueError(f'unsupported event or external reference: {name}')
    if display and re.search(r'@import|url\(\s*[\'"]?(?!#)[^\s\)\'"]', text, re.I):
        raise ValueError('external CSS resources are not allowed')
    viewbox = [float(v) for v in re.split(r'[\s,]+', svg.get('viewBox', '').strip()) if v]
    def dimension(key, fallback):
        raw = svg.get(key)
        if raw is None or raw.endswith('%'):
            return fallback
        if not re.fullmatch(r'\d+(?:\.\d+)?(?:px)?', raw):
            raise ValueError(f'unsupported SVG {key} unit; use pixels')
        return float(raw.removesuffix('px'))
    w = dimension('width', viewbox[2] if len(viewbox) == 4 else None)
    h = dimension('height', viewbox[3] if len(viewbox) == 4 else None)
    if w != item['width'] or h != item['height']:
        raise ValueError(f'{item["path"]}: declared dimensions do not match SVG')

def validate(root=ROOT):
    errors = []
    root = Path(root).resolve()
    try:
        manifest = load(root / 'pelican.json')
        protocol = load(root / 'pelican-test.json')
        schemas = {name: load(root / 'schemas' / f'pelican-{name}.schema.json') for name in ('manifest', 'result')}
        for schema in schemas.values():
            Draft202012Validator.check_schema(schema)
        validators = {name: Draft202012Validator(schema, format_checker=FormatChecker()) for name, schema in schemas.items()}
        validators['manifest'].validate(manifest)
        if manifest['testId'] != protocol['id'] or manifest['prompt'] != protocol['prompt']:
            raise ValueError('manifest and protocol disagree')
        ids = set()
        for reference in manifest['results']:
            try:
                record = load(root / reference)
                validators['result'].validate(record)
                if record['id'] in ids:
                    raise ValueError('duplicate result id')
                ids.add(record['id'])
                if Path(reference).stem != record['id']:
                    raise ValueError('filename must match result id')
                if record['testId'] != manifest['testId']:
                    raise ValueError('wrong testId')
                if record['run']['prompt'] != protocol['prompt']:
                    raise ValueError('this testId requires the exact protocol prompt; use another protocol for a different prompt')
                run = record['run']
                if run['attempt'] > run['totalAttempts']:
                    raise ValueError('attempt exceeds totalAttempts')
                if run['selection'] == 'first' and (run['attempt'] != 1 or run['totalAttempts'] != 1):
                    raise ValueError('first requires one attempt; otherwise report all or best-of-n')
                if run['postProcessing'] != 'none' and record['source'] is None:
                    raise ValueError('modified results must preserve original source')
                if run['postProcessing'] != 'none' and record['source']['path'] == record['artifact']['path']:
                    raise ValueError('original source must be a separate preserved file')
                svg_check(root, record['artifact'])
                if record['source'] is not None:
                    svg_check(root, record['source'], display=False)
            except Exception as exc:
                errors.append(f'{reference}: {exc}')
        referenced = set(manifest['results'])
        for path in (root / 'pelican-results').glob('*.json'):
            if path.relative_to(root).as_posix() not in referenced:
                errors.append(f'{path.name}: unlisted submission')
    except Exception as exc:
        errors.append(str(exc))
    return errors

if __name__ == '__main__':
    problems = validate()
    if problems:
        print('\n'.join(problems), file=sys.stderr)
        sys.exit(1)
    print('Pelican submissions validated successfully.')
