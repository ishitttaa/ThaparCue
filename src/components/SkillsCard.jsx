import { useState } from 'react';
import SkillPickerModal from './SkillPickerModal';
import {
  useAddCustomSkill,
  useMyCustomSkills,
  useMySkillIds,
  useRemoveCustomSkill,
  useSkills,
  useToggleMySkill,
} from '../hooks/useSkills';

export default function SkillsCard() {
  const { data: allSkills = [] } = useSkills();
  const { data: mySkillIds = [] } = useMySkillIds();
  const { data: customSkills = [] } = useMyCustomSkills();
  const toggle = useToggleMySkill();
  const addCustom = useAddCustomSkill();
  const removeCustom = useRemoveCustomSkill();
  const [open, setOpen] = useState(false);

  const mine = allSkills.filter((s) => mySkillIds.includes(s.id));
  const total = mine.length + customSkills.length;

  const error =
    toggle.error?.message || addCustom.error?.message || removeCustom.error?.message || '';

  return (
    <div
      className="glass-card profile-section anim-fade-up"
      style={{ marginTop: 'var(--space-6)' }}
    >
      <div className="section-header-row">
        <h2 className="font-display section-title">Skills</h2>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setOpen(true)}
        >
          {total > 0 ? 'Edit skills' : '+ Add skills'}
        </button>
      </div>

      {total === 0 ? (
        <p className="text-muted">
          No skills added yet. Adding them helps others find you.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {mine.map((s) => (
            <span key={s.id} className="tag active">{s.name}</span>
          ))}
          {customSkills.map((s) => (
            <span key={s.id} className="tag active">{s.name}</span>
          ))}
        </div>
      )}

      {open && (
        <SkillPickerModal
          skills={allSkills}
          selectedIds={mySkillIds}
          customSkills={customSkills}
          error={error}
          busy={addCustom.isPending}
          onClose={() => setOpen(false)}
          onToggle={(skillId) =>
            toggle.mutate({ skillId, add: !mySkillIds.includes(skillId) })
          }
          onAddCustom={(name) => addCustom.mutateAsync(name)}
          onRemoveCustom={(id) => removeCustom.mutate(id)}
        />
      )}
    </div>
  );
}