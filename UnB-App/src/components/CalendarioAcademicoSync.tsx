import { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { sincronizarCalendarioAcademicoOnline } from '@/utils/calendarioAcademicoSync';

export function CalendarioAcademicoSync() {
  const db = useSQLiteContext();

  useEffect(() => {
    let isMounted = true;

    async function sync() {
      try {
        const resultado = await sincronizarCalendarioAcademicoOnline(db);
        if (isMounted && resultado.sincronizado) {
          console.log('Calendario academico atualizado:', resultado);
        }
      } catch (error) {
        console.log('Erro ao sincronizar calendario academico:', error);
      }
    }

    sync();

    return () => {
      isMounted = false;
    };
  }, [db]);

  return null;
}
