import { type SQLiteDatabase } from 'expo-sqlite';
import * as Network from 'expo-network';
import * as FileSystem from 'expo-file-system/legacy';
import {
  deveSincronizarCalendarioAcademico,
  extrairEventosCalendarioDeTexto,
  sincronizarCalendarioAcademico,
  sincronizarCalendarioAcademicoComEventos,
} from '../../database/queries/calendarioQueries';

const CALENDARIOS_SAA_URL = 'https://saa.unb.br/graduacao/calendarios/';

function encontrarPdfCalendarioAtividades(html: string, ano: number, periodo: number) {
  const linkRegex = /href=["']([^"']+\.pdf)["'][^>]*>([^<]*)/gi;
  const periodoRegex = new RegExp(`${ano}[_\\s.-]*${periodo}`, 'i');
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1].replace(/&amp;/g, '&');
    const label = match[2].replace(/\s+/g, ' ');
    const target = `${href} ${label}`;

    if (/Calend_Ativ_Grad/i.test(target) && periodoRegex.test(target)) {
      return href.startsWith('http') ? href : new URL(href, CALENDARIOS_SAA_URL).toString();
    }
  }

  return null;
}

async function baixarEExtrairTextoPdf(url: string, ano: number, periodo: number) {
  const destino = `${FileSystem.cacheDirectory}calendario-academico-${ano}-${periodo}.pdf`;
  const download = await FileSystem.downloadAsync(url, destino);
  const { extractTextWithInfo } = await import('expo-pdf-text-extract');
  const extractResult = await extractTextWithInfo(download.uri);

  try {
    await FileSystem.deleteAsync(download.uri, { idempotent: true });
  } catch (error) {
    console.log('Nao foi possivel remover PDF temporario do calendario:', error);
  }

  if (!extractResult.success) {
    throw new Error(extractResult.error || 'Nao foi possivel extrair texto do PDF do calendario.');
  }

  return extractResult.text;
}

export async function sincronizarCalendarioAcademicoOnline(db: SQLiteDatabase, force = false) {
  const { ano, periodo, shouldSync } = await deveSincronizarCalendarioAcademico(db, force);

  if (!shouldSync) {
    return sincronizarCalendarioAcademico(db);
  }

  const networkState = await Network.getNetworkStateAsync();

  if (networkState.isConnected && networkState.isInternetReachable !== false) {
    try {
      const response = await fetch(CALENDARIOS_SAA_URL);
      const html = await response.text();
      const pdfUrl = encontrarPdfCalendarioAtividades(html, ano, periodo);

      if (pdfUrl) {
        const textoPdf = await baixarEExtrairTextoPdf(pdfUrl, ano, periodo);
        const eventos = extrairEventosCalendarioDeTexto(textoPdf, ano, periodo, pdfUrl);

        return sincronizarCalendarioAcademicoComEventos(
          db,
          eventos,
          pdfUrl,
          ano,
          periodo
        );
      }
    } catch (error) {
      console.log('Falha ao buscar calendario academico online:', error);
    }
  }

  return sincronizarCalendarioAcademico(db, true);
}
