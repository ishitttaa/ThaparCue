import { useState } from 'react';
import SkillPickerModal from './SkillPickerModal';
import {
  useAddCustomSkill,
  useMyCustomSkills,
  useMySkills,
  useRemoveCustomSkill,
  useSetCustomSkillLevel,
  useSetSkillLevel,
  useSkills,
  useToggleMySkill,
} from '../hooks/useSkills';

export default function SkillsCard() {
  const { data: allSkills = [] } = useSkills();
  const { data: mySkillRows = [] } = useMySkills();
  const { data: customSkills = [] } = useMyCustomSkills();
  const toggle = useToggleMySkill();
  const setLevel = useSetSkillLevel();
  const addCustom = useAddCustomSkill();
  const removeCustom = useRemoveCustomSkill();
  const setCustomLevel = useSetCustomSkillLevel();
  const [open, setOpen] = useState(false);

  const byId = new Map(allSkills.map((s) => [s.id, s]));
  const listed = mySkillRows
    .map((row) => ({ key: row.skill_id, name: byId.get(row.skill_id)?.name, level: row.level }))
    .filter((s) => s.name);
  const all = [
    ...listed,
    ...customSkills.map((c) => ({ key: c.id, name: c.name, level: c.level })),
  ];

  const error =
    toggle.error?.message ||
    setLevel.error?.message ||
    addCustom.error?.message ||
    removeCustom.error?.message ||
    setCustomLevel.error?.message ||
    '';

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
          {all.length > 0 ? 'Edit skills' : '+ Add skills'}
        </button>
      </div>

      {all.length === 0 ? (
        <p className="text-muted">
          No skills added yet. Adding them helps others find you.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {all.map((s) => (
            <span key={s.key} className="tag active" title={s.level}>
              {s.name}
              <span style={{ opacity: 0.7 }}> · {s.level}</span>
              {s.level === 'Expert' && ' ★'}
            </span>
          ))}
        </div>
      )}

      {open && (
        <SkillPickerModal
          skills={allSkills}
          mySkillRows={mySkillRows}
          customSkills={customSkills}
          error={error}
          busy={addCustom.isPending}
          onClose={() => setOpen(false)}
          onToggle={(skillId) =>
            toggle.mutate({
              skillId,
              add: !mySkillRows.some((row) => row.skill_id === skillId),
            })
          }
          onSetLevel={(skillId, level) => setLevel.mutate({ skillId, level })}
          onAddCustom={(name) => addCustom.mutateAsync(name)}
          onRemoveCustom={(id) => removeCustom.mutate(id)}
          onSetCustomLevel={(id, level) => setCustomLevel.mutate({ id, level })}
        />
      )}
    </div>
  );
}