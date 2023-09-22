export const grades = [
  { label: 'first grade', value: 1 },
  { label: 'seconde grade', value: 2 },
  { label: 'third grade', value: 3 },
  { label: 'fourth grade', value: 4 },
];
export const gradeMap = map(grades);

export const ranks = [
  { label: 'other', value: 0 },
  { label: 'professor', value: 1 },
  { label: 'associate professor', value: 2 },
  { label: 'lecturer', value: 3 },
];
export const rankMap = map(ranks);

export const sexes = [
  { label: 'male', value: 1 },
  { label: 'female', value: 0 },
];
export const sexMap = map(sexes);

export const raceLevels = [
  { label: '校级', value: 1 },
  { label: '省级', value: 2 },
  { label: '国家级一般', value: 3 },
  { label: '国家级重点', value: 4 },
];
export const raceLevelMap = map(raceLevels);

function map(arr) {
  const result = {};
  for (const { label, value } of arr) {
    result[value] = label;
  }
  return result;
}

export const permissionTypes = [
  'user',
  'race',
  'record',
  'role',
  'permission',
].map(key => ({
  label: key,
  value: key,
}));

export const actions = [
  'add',
  'delete',
  'update',
  'query',
  'import',
  'export',
].map(key => ({
  label: key,
  value: key,
}));
