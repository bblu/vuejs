import Mock from 'mockjs';
import avatar from '../../assets/user.png' 
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: avatar,
    name: '张某某'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    account: Mock.Random.name(),
    name: Mock.Random.cname(),
    email: Mock.mock('@EMAIL'),
    phone: 17767777566,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1),
    remark: 'test'
  }));
}

export { LoginUsers, Users };
