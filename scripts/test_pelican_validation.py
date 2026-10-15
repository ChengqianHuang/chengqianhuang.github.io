import hashlib
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from validate_pelican import ROOT, validate

class SubmissionValidation(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for directory in ('schemas', 'pelican-results', 'pelican-assets'):
            shutil.copytree(ROOT / directory, self.root / directory)
        for file in ('pelican.json', 'pelican-test.json', 'pelican-test-animated.json'):
            shutil.copy(ROOT / file, self.root / file)
        references = json.loads((self.root / 'pelican.json').read_text())['results']
        reference = next(ref for ref in references if json.loads((self.root / ref).read_text())['testId'] == 'pelican-riding-bicycle-animated-svg-v1')
        self.record_path = self.root / reference
        self.record = json.loads(self.record_path.read_text())
    def tearDown(self):
        self.temp.cleanup()
    def save(self):
        self.record_path.write_text(json.dumps(self.record))
    def test_real_submission_passes(self):
        self.assertEqual(validate(self.root), [])
    def test_animation_requires_poster(self):
        del self.record['poster']; self.save()
        self.assertTrue(validate(self.root))
    def test_animation_cannot_be_classified_static(self):
        self.record['testId'] = 'pelican-riding-bicycle-svg-v1'
        self.record['run']['prompt'] = 'Draw an SVG of a pelican riding a bicycle.'
        self.save()
        self.assertTrue(validate(self.root))
    def test_missing_harness_rejected(self):
        del self.record['harness']; self.save()
        self.assertTrue(validate(self.root))
    def test_changed_image_bytes_rejected(self):
        path = self.root / self.record['artifact']['path']
        path.write_bytes(path.read_bytes() + b'\n')
        self.assertIn('SHA-256 mismatch', '\n'.join(validate(self.root)))
    def test_false_first_attempt_rejected(self):
        self.record['run']['selection'] = 'first'
        self.record['run']['totalAttempts'] = 3; self.save()
        self.assertIn('first requires one attempt', '\n'.join(validate(self.root)))
    def test_wrong_prompt_rejected(self):
        self.record['run']['prompt'] += ' Make it beautiful.'; self.save()
        self.assertIn('prompt', '\n'.join(validate(self.root)))
    def test_script_in_svg_rejected_even_with_matching_hash(self):
        path = self.root / self.record['artifact']['path']
        content = path.read_bytes().replace(b'</svg>', b'<script>alert(1)</script></svg>')
        path.write_bytes(content)
        self.record['artifact']['sha256'] = hashlib.sha256(content).hexdigest(); self.save()
        self.assertIn('unsupported active', '\n'.join(validate(self.root)))
    def test_wrong_dimensions_rejected(self):
        self.record['artifact']['width'] += 1; self.save()
        self.assertIn('dimensions do not match', '\n'.join(validate(self.root)))
    def test_edited_result_requires_original(self):
        self.record['run']['postProcessing'] = 'edited'; self.save()
        self.assertIn('preserve original', '\n'.join(validate(self.root)))

if __name__ == '__main__':
    unittest.main()
