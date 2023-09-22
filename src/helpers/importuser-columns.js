const columns = {
  student: [
    {
      title: 'Number',
      dataIndex: 'account',
      sort: (a, b) => a.account - b.account,
    },
    {
      title: 'Password',
      dataIndex: 'password',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
    },
    {
      title: 'Class',
      dataIndex: 'classname',
    },
  ],
  teacher: [
    {
      title: 'Number',
      dataIndex: 'account',
      sort: (a, b) => a.account - b.account,
    },
    {
      title: 'Password',
      dataIndex: 'password',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Level',
      dataIndex: 'rank',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
  ],
};

const types = Object.keys(columns);

export default function(type) {
  if (!types.includes(type)) {
    throw new Error(`type must in ${types.toString()}`);
  }
  return columns[type];
}
