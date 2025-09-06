# Node.js性能优化实战

Node.js应用的性能优化是一个复杂的主题，涉及内存管理、事件循环、集群等多个方面。本文将从实战角度分析优化方法和技巧。

## 理解事件循环

Node.js的事件循环是其高性能的核心，理解其工作原理对优化至关重要：

```javascript
// 事件循环阶段示例
console.log('1');

setImmediate(() => console.log('2'));

process.nextTick(() => console.log('3'));

setTimeout(() => console.log('4'), 0);

Promise.resolve().then(() => console.log('5'));

console.log('6');

// 输出顺序: 1, 6, 3, 5, 4, 2
```

### 优化事件循环

```javascript
// 避免阻塞事件循环
function heavyComputation(data) {
  return new Promise((resolve) => {
    setImmediate(() => {
      // 将计算分解为小块
      const result = processDataChunk(data);
      resolve(result);
    });
  });
}

// 使用 Worker Threads 处理 CPU 密集型任务
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.postMessage({ data: largeDataSet });
  worker.on('message', (result) => {
    console.log('计算完成:', result);
  });
} else {
  parentPort.on('message', ({ data }) => {
    const result = performHeavyCalculation(data);
    parentPort.postMessage(result);
  });
}
```

## 内存管理优化

### 内存泄漏检测

```javascript
// 监控内存使用
function monitorMemory() {
  const used = process.memoryUsage();
  console.log({
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`
  });
}

setInterval(monitorMemory, 5000);

// 避免内存泄漏的最佳实践
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 1000;
  }
  
  process(key, data) {
    // 限制缓存大小
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, data);
    return this.processData(data);
  }
  
  cleanup() {
    this.cache.clear();
  }
}
```

### 垃圾回收优化

```javascript
// 手动触发垃圾回收（仅在开发环境）
if (process.env.NODE_ENV === 'development') {
  global.gc && global.gc();
}

// 使用对象池减少GC压力
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.maxSize = maxSize;
  }
  
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }
  
  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}

// 使用示例
const bufferPool = new ObjectPool(
  () => Buffer.alloc(1024),
  (buffer) => buffer.fill(0),
  50
);
```

## 数据库优化

### 连接池管理

```javascript
const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// 使用连接池
async function getUser(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}
```

### 查询优化

```javascript
// 批量操作
async function batchInsertUsers(users) {
  const values = users.map(user => [user.name, user.email]);
  const sql = 'INSERT INTO users (name, email) VALUES ?';
  
  await pool.execute(sql, [values]);
}

// 使用索引和缓存
const Redis = require('redis');
const redis = Redis.createClient();

async function getUserWithCache(id) {
  const cacheKey = `user:${id}`;
  
  // 先检查缓存
  let user = await redis.get(cacheKey);
  if (user) {
    return JSON.parse(user);
  }
  
  // 从数据库获取
  user = await getUser(id);
  if (user) {
    // 缓存1小时
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
  }
  
  return user;
}
```

## HTTP服务优化

### 请求压缩

```javascript
const express = require('express');
const compression = require('compression');
const app = express();

// 启用gzip压缩
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

### 静态资源优化

```javascript
const express = require('express');
const path = require('path');

const app = express();

// 静态资源缓存
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// 设置缓存头
app.use((req, res, next) => {
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});
```

## 集群和负载均衡

### 使用Cluster模块

```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  
  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    cluster.fork(); // 重启工作进程
  });
} else {
  // 工作进程运行HTTP服务器
  const express = require('express');
  const app = express();
  
  app.get('/', (req, res) => {
    res.send(`Hello from worker ${process.pid}`);
  });
  
  app.listen(3000, () => {
    console.log(`工作进程 ${process.pid} 启动`);
  });
}
```

### PM2部署

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## 监控和分析

### 性能监控

```javascript
const express = require('express');
const app = express();

// 请求时间中间件
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    memory: process.memoryUsage()
  };
  
  res.status(200).json(healthCheck);
});
```

### 使用APM工具

```javascript
// 使用New Relic
require('newrelic');

// 或使用自定义监控
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .observe(duration);
  });
  
  next();
});
```

## 最佳实践总结

1. **异步优先**：使用异步操作避免阻塞
2. **内存管理**：监控内存使用，避免泄漏
3. **连接池**：合理配置数据库连接池
4. **缓存策略**：适当使用缓存减少计算
5. **集群部署**：利用多核CPU优势
6. **监控告警**：建立完善的监控体系

## 总结

Node.js性能优化需要从多个维度进行考虑，包括代码层面的优化、架构设计的改进、以及运维层面的配置。关键是要建立性能监控体系，持续优化和改进。
