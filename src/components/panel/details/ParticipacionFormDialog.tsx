import { mutate, resources, type Row } from '../../../lib/panel';
import { Dialog, Form } from '../LiveUI';

type ParticipacionFormDialogProps = {
  editing: Row | Partial<Row>;
  partidoId: number;
  onClose: () => void;
  onSaved: () => void;
};

/** Alta y edición de la participación de un jugador en el partido. */
export function ParticipacionFormDialog({
  editing,
  partidoId,
  onClose,
  onSaved,
}: ParticipacionFormDialogProps) {
  return (
    <Dialog title="Participación" onClose={onClose}>
      <Form
        fields={resources.participaciones.fields}
        initial={editing}
        onSave={async (body) => {
          if (body.partidoId !== partidoId)
            throw new Error(
              'El partido debe coincidir con el detalle abierto.',
            );
          await mutate(
            '/participaciones' + (editing.id ? '/' + editing.id : ''),
            editing.id ? 'PUT' : 'POST',
            body,
          );
          onClose();
          onSaved();
        }}
        onCancel={onClose}
      />
    </Dialog>
  );
}
