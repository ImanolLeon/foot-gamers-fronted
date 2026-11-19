import type { FieldSpec, Row } from '../../../lib/panel';
import { Dialog, Form, Table } from '../LiveUI';

type TorneoActionDialogProps = {
  action: 'editar' | 'inscribir' | 'estado' | 'grupos' | 'ganador';
  torneo: Row;
  inscritos: Row[];
  fields: FieldSpec[];
  onSave: (body: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
};

const titles: Record<TorneoActionDialogProps['action'], string> = {
  editar: 'Editar torneo',
  inscribir: 'Inscribir jugador',
  estado: 'Cambiar estado',
  grupos: 'Distribuir grupos',
  ganador: 'Asignar campeón',
};

/** Diálogo único para las acciones de edición del torneo. */
export function TorneoActionDialog({
  action,
  torneo,
  inscritos,
  fields,
  onSave,
  onClose,
}: TorneoActionDialogProps) {
  return (
    <Dialog title={titles[action]} onClose={onClose}>
      {action === 'ganador' && (
        <Table
          rows={inscritos}
          columns={[
            ['id', 'ID'],
            ['username', 'Jugador'],
          ]}
        />
      )}
      <Form
        key={action}
        fields={fields}
        initial={action === 'editar' || action === 'estado' ? torneo : {}}
        onSave={onSave}
        onCancel={onClose}
      />
    </Dialog>
  );
}
