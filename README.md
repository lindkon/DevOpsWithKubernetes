# KubernetesSubmissions

## Exercises

### Chapter 2

- [1.1.](https://github.com/mluukkai/KubernetesSubmissions/tree/1.1/log_output)
- [1.2.](https://github.com/mluukkai/KubernetesSubmissions/tree/1.2/the_project)
- [1.3.](https://github.com/mluukkai/KubernetesSubmissions/tree/1.3/log_output)
- [1.4.](https://github.com/mluukkai/KubernetesSubmissions/tree/1.4/the_project)
- [1.5.](https://github.com/mluukkai/docker-test/tree/1.5)


## Commands I will forget

Build docker image:
```docker build -t lindkon/log-output:1.1 .```
Push image for kubernetes to find:
```docker push lindkon/log-output:1.1```
Apply new deployment to kubernetes:
```kubectl apply -f log_output/manifests/deployment.yaml```
Restart kubernetes image:
```kubectl rollout restart deployment log-output```
Check logs for a pod:
```kubectl logs log-output-8474b95fd9-np68p```