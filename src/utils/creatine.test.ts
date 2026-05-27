import {
  calculateCreatineDoses,
  calculateCreatineMaintenanceDoseG,
  calculateCreatineSizeFocusedDoseG,
} from '@/src/utils/creatine';

describe('calculateCreatineMaintenanceDoseG', () => {
  it('uses 0.03 g per kg within the 3–5 g band', () => {
    expect(calculateCreatineMaintenanceDoseG(100)).toBe(3);
    expect(calculateCreatineMaintenanceDoseG(120)).toBe(3.6);
  });

  it('floors light bodyweights at 3 g', () => {
    expect(calculateCreatineMaintenanceDoseG(50)).toBe(3);
  });

  it('caps heavy bodyweights at 5 g', () => {
    expect(calculateCreatineMaintenanceDoseG(200)).toBe(5);
  });

  it('rejects invalid input', () => {
    expect(calculateCreatineMaintenanceDoseG(0)).toBeNull();
  });
});

describe('calculateCreatineDoses', () => {
  it('returns maintenance and loading amounts', () => {
    expect(calculateCreatineDoses(80)).toEqual({
      maintenanceGrams: 3,
      sizeFocusedGrams: 5,
      loadingGrams: 16,
    });
  });
});

describe('calculateCreatineSizeFocusedDoseG', () => {
  it('floors at 5 g for most normal bodyweights', () => {
    expect(calculateCreatineSizeFocusedDoseG(80)).toBe(5);
  });

  it('scales with bodyweight and caps at 10 g', () => {
    expect(calculateCreatineSizeFocusedDoseG(120)).toBe(6);
    expect(calculateCreatineSizeFocusedDoseG(250)).toBe(10);
  });
});
