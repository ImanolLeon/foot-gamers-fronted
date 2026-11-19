import type { ReactNode } from 'react';
import { Button, Dialog } from '../LiveUI';

type GenerateCalendarDialogProps = {
  confirm: 'partidos/grupos' | 'llaves';
  busy: boolean;
  feedback: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmación antes de generar partidos de grupos o llaves. */
export function GenerateCalendarDialog({
  confirm,
  busy,
  feedback,
  onConfirm,
  onCancel,
}: GenerateCalendarDialogProps) {
  return (
    <Dialog title="Generar calendario" onClose={() => !busy && onCancel()}>
      <p>
        Se crearán los{' '}
        {confirm === 'llaves'
          ? 'partidos de eliminación directa'
          : 'partidos de grupos'}{' '}
        de este torneo. Comprueba que la fase previa esté completa.
      </p>
      {feedback}
      <div className="live-actions">
        <Button disabled={busy} onClick={onConfirm}>
          Confirmar generación
        </Button>
        <Button disabled={busy} onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </Dialog>
  );
}
