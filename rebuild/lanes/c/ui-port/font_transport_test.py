#!/usr/bin/env python3
"""Focused transport proof for gate.py face_bytes; no page or external network."""
import asyncio
import base64
import importlib.util
import pathlib
import sys
import tempfile
import unittest

from playwright.async_api import async_playwright


ROOT = pathlib.Path(__file__).resolve().parents[4]
PACK = ROOT / 'rebuild' / 'm1' / 'approved-2026-09-18'
GATE_PATH = PACK / 'quality' / 'gate.py'
FONT_DIR = PACK / 'app' / 'fonts'


def load_gate():
    spec = importlib.util.spec_from_file_location('cui_font_transport_gate', GATE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


gate = load_gate()


class RequestOwner:
    def __init__(self, request):
        self.request = request


class FontTransportTest(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.playwright = await async_playwright().start()
        self.request = await self.playwright.request.new_context()
        self.owner = RequestOwner(self.request)

    async def asyncTearDown(self):
        await self.request.dispose()
        await self.playwright.stop()

    @staticmethod
    def data_url(payload):
        return 'data:font/woff2;base64,' + base64.b64encode(payload).decode('ascii')

    async def test_known_pinned_font_bytes_cross_data_transport(self):
        for family, filename in (('Earned Sans', 'earned-sans.woff2'),
                                 ('Earned Serif', 'earned-serif.woff2')):
            expected = (FONT_DIR / filename).read_bytes()
            actual = await gate.face_bytes(self.owner, self.data_url(expected))
            self.assertEqual(actual, expected, family + ' transport changed bytes')
            self.assertEqual(gate.sha256_bytes(actual), gate.PINNED_FONTS[family])

    async def test_altered_font_bytes_fail_the_pinned_hash(self):
        expected = (FONT_DIR / 'earned-sans.woff2').read_bytes()
        altered = expected[:-1] + bytes([expected[-1] ^ 1])
        actual = await gate.face_bytes(self.owner, self.data_url(altered))
        with self.assertRaisesRegex(AssertionError, 'font hash mismatch'):
            self.assertEqual(gate.sha256_bytes(actual), gate.PINNED_FONTS['Earned Sans'],
                             'font hash mismatch')

    async def test_malformed_base64_is_refused_by_name(self):
        with self.assertRaisesRegex(ValueError, 'malformed base64 font data URI'):
            await gate.face_bytes(self.owner, 'data:font/woff2;base64,%%%')

    async def test_non_base64_data_font_is_refused_by_name(self):
        with self.assertRaisesRegex(ValueError, 'font data URI must use base64'):
            await gate.face_bytes(self.owner, 'data:font/woff2,not-base64')

    async def test_file_transport_is_unchanged(self):
        payload = (FONT_DIR / 'earned-serif.woff2').read_bytes()
        with tempfile.TemporaryDirectory(prefix='earned-cui-font-file-') as folder:
            target = pathlib.Path(folder) / 'font.woff2'
            target.write_bytes(payload)
            self.assertEqual(await gate.face_bytes(self.owner, target.as_uri()), payload)

    async def test_loopback_http_transport_is_unchanged(self):
        payload = (FONT_DIR / 'earned-sans.woff2').read_bytes()

        async def respond(reader, writer):
            await reader.readuntil(b'\r\n\r\n')
            writer.write(b'HTTP/1.1 200 OK\r\nContent-Type: font/woff2\r\nContent-Length: '
                         + str(len(payload)).encode('ascii') + b'\r\nConnection: close\r\n\r\n' + payload)
            await writer.drain()
            writer.close()
            await writer.wait_closed()

        server = await asyncio.start_server(respond, '127.0.0.1', 0)
        try:
            port = server.sockets[0].getsockname()[1]
            actual = await gate.face_bytes(self.owner, f'http://127.0.0.1:{port}/font.woff2')
            self.assertEqual(actual, payload)
        finally:
            server.close()
            await server.wait_closed()


if __name__ == '__main__':
    unittest.main(verbosity=2)
