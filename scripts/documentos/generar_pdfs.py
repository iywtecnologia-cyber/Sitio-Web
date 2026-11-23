"""Genera los PDF legales de la web a partir de los HTML de esta carpeta.

Uso (desde la raíz del repo):
    python3 scripts/documentos/generar_pdfs.py

Para cambiar un texto: editá contrato-de-servicios.html o politica-de-privacidad.html y volvé a correr esto.
Necesita Playwright con Chromium (pip install playwright && playwright install chromium).
"""
import asyncio
import pathlib

from playwright.async_api import async_playwright

AQUI = pathlib.Path(__file__).resolve().parent
PUBLIC = AQUI.parent.parent / 'public'
DOCUMENTOS = ['contrato-de-servicios', 'politica-de-privacidad']


async def main() -> None:
    async with async_playwright() as p:
        navegador = await p.chromium.launch()
        pagina = await navegador.new_page()
        for nombre in DOCUMENTOS:
            await pagina.goto((AQUI / f'{nombre}.html').as_uri())
            await pagina.pdf(path=str(PUBLIC / f'{nombre}.pdf'), format='A4', print_background=True, prefer_css_page_size=True)
            print('listo:', PUBLIC / f'{nombre}.pdf')
        await navegador.close()


asyncio.run(main())
