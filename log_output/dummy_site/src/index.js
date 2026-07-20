const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);
const watch = new k8s.Watch(kc);

const NGINX_CONF = `server {
  listen 80;
  location = /dummy-site { return 301 /dummy-site/; }
  location /dummy-site/ { alias /usr/share/nginx/html/; index index.html; }
}`;

const createResources = async (obj) => {
  const { name, namespace, uid } = obj.metadata;
  const resourceName = `${name}-dummysite`;

  const html = await (await fetch(obj.spec.website_url)).text();

  const ownerReferences = [
    { apiVersion: 'stable.dwk/v1', kind: 'DummySite', name, uid },
  ];
  const labels = { app: resourceName };

  await coreApi.createNamespacedConfigMap({
    namespace,
    body: {
      metadata: { name: resourceName, namespace, ownerReferences },
      data: { 'index.html': html, 'site.conf': NGINX_CONF },
    },
  });

  await appsApi.createNamespacedDeployment({
    namespace,
    body: {
      metadata: { name: resourceName, namespace, ownerReferences },
      spec: {
        replicas: 1,
        selector: { matchLabels: labels },
        template: {
          metadata: { labels },
          spec: {
            containers: [
              {
                name: 'nginx',
                image: 'nginx:1.27-alpine',
                volumeMounts: [
                  { name: 'html', mountPath: '/usr/share/nginx/html' },
                  { name: 'conf', mountPath: '/etc/nginx/conf.d' },
                ],
              },
            ],
            volumes: [
              {
                name: 'html',
                configMap: {
                  name: resourceName,
                  items: [{ key: 'index.html', path: 'index.html' }],
                },
              },
              {
                name: 'conf',
                configMap: {
                  name: resourceName,
                  items: [{ key: 'site.conf', path: 'default.conf' }],
                },
              },
            ],
          },
        },
      },
    },
  });

  await coreApi.createNamespacedService({
    namespace,
    body: {
      metadata: { name: `${resourceName}-svc`, namespace, ownerReferences },
      spec: { selector: labels, ports: [{ port: 80 }] },
    },
  });

  console.log(`DummySite ${name} ready`);
};

watch.watch(
  '/apis/stable.dwk/v1/dummysites',
  {},
  (type, obj) => {
    if (type === 'ADDED') createResources(obj).catch(console.error);
  },
  console.error
);

console.log('DummySite controller started');