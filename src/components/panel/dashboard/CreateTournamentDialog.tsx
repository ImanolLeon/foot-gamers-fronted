import { resources } from '../../../lib/panel';
import { Dialog, Form } from '../LiveUI';

type CreateTournamentDialogProps = {
  onClose: () => void;
  onSave: (body: Record<string, unknown>) => Promise<void>;
};

/** Diálogo de creación de torneo, exclusivo del administrador. */
export function CreateTournamentDialog({ onClose, onSave }: CreateTournamentDialogProps) {
  return (
    <Dialog title="Crear torneo" onClose={onClose}>
      <Form
        fields={resources.torneos.fields}
        onSave={onSave}
        onCancel={onClose}
      />
    </Dialog>
  );
}
