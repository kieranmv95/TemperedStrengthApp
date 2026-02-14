import { getProgramById, programs } from '../utils/program';

describe('program utilities', () => {
  it('returns the matching program by id', () => {
    const sampleProgram = programs[0];

    expect(getProgramById(sampleProgram.id)).toEqual(sampleProgram);
  });

  it('returns undefined for unknown ids', () => {
    expect(getProgramById('missing-id')).toBeUndefined();
  });

  it('exposes unique program ids', () => {
    const ids = programs.map((program) => program.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
