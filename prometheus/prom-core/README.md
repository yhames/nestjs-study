<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

NestJS에서 Prometheus와 Grafana 연동하는 방법에 대해 알아보려고 합니다.

> 참고자료  
> [Nest.js Metrics - Prometheus & Grafana Tutorial](https://www.youtube.com/watch?v=2ESOGJTXv1s&t=162s)

## Install Prometheus

먼저 CLI로 [nestjs-prometheus](https://github.com/willsoto/nestjs-prometheus)를 설치합니다.

```bash
npm install @willsoto/nestjs-prometheus prom-client
```

app.module.ts에 PrometheusModule를 import합니다.

```typescript
@Module({
  imports: [PrometheusModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Postman이나 브라우저에서 `GET /metrics` 요청을 보내면 기본적인 Metrics 정보를 확인할 수 있습니다.

```bash
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 0.331612

# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds.
# TYPE process_cpu_system_seconds_total counter
process_cpu_system_seconds_total 0.142212

# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total 0.473824

# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE process_start_time_seconds gauge
process_start_time_seconds 1710996600

# ...
```