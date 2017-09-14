import Mock from 'mockjs';

const Modules = [];

for (let i = 0; i < 10; i++) {
  Modules.push(Mock.mock({
    id: Mock.Random.guid(),
    ip: '127.0.0.1',
    status: 'started',
    moduleName: 'test',
    config: {
    	"basic":[{
    		key: 'port',
    		value: 123,
    		alias: "端口",
    		pattern: "\\d+"
    	}],

    	"extend": [{
    		key: "path",
    		value: "\/tmp",
    		alias: "日志目录",
    		pattern: "\/\\w+"
    	}]
    }
  }));
}

export { Modules };