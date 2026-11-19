import type { ReactNode } from 'react';
import type { Row } from '../../../lib/panel';
import { Button, Dialog } from '../LiveUI';

type DeleteParticipacionDialogProps = {
  row: Row;
  busy: boolean;
  feedback: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmación para quitar una participación del partido. */
export function DeleteParticipacionDialog({
  row,
  busy,
  feedback,
  onConfirm,
  onCancel,
}: DeleteParticipacionDialogProps) {
  return (
    <Dialog title="Quitar participación" onClose={onCancel}>
      <p>¿Quitar a {String(row.usernameJugador)} de este partido?</p>
      {feedback}
      <Button disabled={busy} onClick={onConfirm}>
        Confirmar
      </Button>
      <Button disabled={busy} onClick={onCancel}>
        Cancelar
      </Button>
    </Dialog>
  );
}
