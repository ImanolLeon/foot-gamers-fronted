import type { FieldSpec, Row } from '../../../lib/panel';
import { Dialog, Form } from '../LiveUI';

type PartidoAction = 'editar' | 'resultado' | 'ganador';

type PartidoActionDialogProps = {
  action: PartidoAction;
  partido: Row;
  fields: FieldSpec[];
  onSave: (body: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
};

const titles: Record<PartidoAction, string> = {
  resultado: 'Registrar resultado',
  ganador: 'Asignar bando ganador',
  editar: 'Editar partido',
};

/** Diálogo para editar el partido, registrar resultado o asignar ganador. */
export function PartidoActionDialog({
  action,
  partido,
  fields,
  onSave,
  onClose,
}: PartidoActionDialogProps) {
  return (
    <Dialog title={titles[action]} onClose={onClose}>
      <Form
        key={action}
        fields={fields}
        initial={action === 'editar' ? partido : {}}
        onSave={onSave}
        onCancel={onClose}
      />
    </Dialog>
  );
}
