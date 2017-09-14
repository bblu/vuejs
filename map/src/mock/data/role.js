import Mock from 'mockjs';

const Roles = [];

for (let i = 0; i < 86; i++) {
  Roles.push(Mock.mock({
    id: Mock.Random.guid(),
    created_date: Mock.Random.date(),
    name: 'test',
    remark: 'test'
  }));
}

export { Roles };