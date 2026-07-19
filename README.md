# KubernetesSubmissions

## Exercises

### Chapter 2

- [1.1.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.1/log_output)
- [1.2.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.2/the_project)
- [1.3.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.3/log_output)
- [1.4.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.4/the_project)
- [1.5.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.5/the_project)
- [1.6.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.6/the_project)
- [1.7.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.7/log_output)
- [1.8.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.8/the_project)
- [1.9.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.9/log_output)
- [1.10.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.10/log_output)
- [1.11.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.11/log_output)
- [1.12.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.12/the_project)
- [1.13.](https://github.com/lindkon/DevOpsWithKubernetes/tree/1.13/the_project)

### Chapter 3

- [2.1.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.1/log_output)
- [2.2.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.2/the_project)
- [2.3.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.3/log_output)
- [2.4.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.4/the_project)
- [2.5.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.5/log_output)
- [2.6.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.6/the_project)
- [2.7.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.7/log_output)
- [2.8.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.8/the_project)
- [2.9.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.9/the_project)
- [2.10.](https://github.com/lindkon/DevOpsWithKubernetes/tree/2.10/the_project)

### Chapter 4

- [3.1.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.1/log_output)
- [3.2.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.2/log_output)
- [3.3.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.3/log_output)
- [3.4.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.4/log_output)
- [3.5.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.5/the_project)
- [3.6.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.6/the_project)
- [3.7.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.7/the_project)
- [3.8.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.8/the_project)
- [3.9.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.9/log_output)
- [3.10.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.10/the_project)
- [3.11.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.11/the_project)
- [3.12.](https://github.com/lindkon/DevOpsWithKubernetes/tree/3.12/the_project)

### Chapter 5

- [4.1.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.1/log_output)
- [4.2.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.2/the_project)
- [4.3.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.3/log_output)
- [4.4.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.4/log_output)
- [4.5.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.5/the_project)
- [4.6.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.6/the_project)
- [4.7.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.7/log_output)
- [4.8.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.8/the_project)
- [4.9.](https://github.com/lindkon/DevOpsWithKubernetes/tree/4.9/the_project)

## Commands I will forget
Create k3d cluster with Gateway:
k3d cluster create --agents 2 -p 8081:80@loadbalancer --port 8082:30080@agent:0 --k3s-arg '--disable=traefik@server:0'

Then:
kubectl apply --server-side -f https://github.com/envoyproxy/gateway/releases/latest/download/install.yaml

Finally:
kubectl -n envoy-gateway-system rollout status deployment/envoy-gateway --timeout=180s

Also remember this for PVs:
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube

Not sure if needed always but eg was not found initially:
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: eg
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
EOF

View project db:
kubectl exec -it todo-db-0 -n project -- psql -U todos -d todos          

Delete cluster when not needed:
gcloud container clusters delete dwk-cluster --zone=europe-north1-b

Create cluster:
gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.36 --disk-size=32 --num-nodes=4 --machine-type=e2-small

Build docker image:
docker build --platform linux/amd64 -t lindkon/ .

Push image for kubernetes to find:
docker push lindkon/

Apply through kustomize:
kubectl apply -k .

Preview:
kubectl kustomize .

Apply new deployment to kubernetes:

```kubectl apply -f manifests/deployment.yaml```

Restart kubernetes image:

```kubectl rollout restart deployment log-output```

Check logs for a pod:

```kubectl logs log-output-8474b95fd9-np68p```

Describe a pod or deployment or whatever:

```kubectl describe pod log-output-8474b95fd9-np68p```

Make config visible:

```kubectl config view --minify --raw```

Add package.json:

npm init -y

Add npm dependency:

npm install pg --save

change namespace with kubens and cluster with kubectx

to skip actions on commit add: 
[skip ci]

sops encrypt:

sops --encrypt \
       --age age1dsd0m8kt9dw90a2mvup8nk9ky4mz6zqms2up2l9d6qeltk9v5fjqhjfngj \
       --encrypted-regex '^(stringData)$' \
       secret.yaml > secret.enc.yaml

## Submission & Release Instructions

To ensure exercises are graded correctly, follow this exact workflow to publish releases for every completed task.

### 1. Commit Your Code
Once your application is running correctly in your cluster, commit and push your changes to your main branch.

`git add .`

`git commit -m "Complete Exercise 3.1"`

`git push origin main`

### 3. Create the Release Tag
You must create a GitHub release where the tag **exactly matches** the exercise number (e.g., `1.1`). 

**Using the command line:**

git tag -a 4.1 -m "Exercise 4.1"
git push origin 4.1

*(You can also draft the release and create the tag directly through the GitHub UI under the **Releases** tab.)*

### 4. Update Exercise Links
After creating the tag, edit the **Exercises** section at the top of this file. The link must point to the specific directory for that application, at that specific release tag.

**Format:**
`https://github.com/lindkon/DevOpsWithKubernetes/tree/EXERCISE_NUMBER/APP_DIRECTORY`

## Exercise 3.9: DIY vs DBaaS

### DIY pros
- Customizable, you have full control over the database
- You don't have to pay for a subscription or think as much about how to optimize usage costs.
- A barebones approach can be put together quickly and locally, lots of guides online to help. However you still have to set it up yourself and it can be time consuming if anything goes wrong
- You can use open-source software

### DIY cons
- You have to maintain availability yourself
- No one to bail you and help out if you mess up
- You have to know a lot more about how to manage the database
- You have to know how to manage hardware
- Scaling can get tricky as you have to buy and set up the hardware yourself if hosting yourself,
if hosting on GKE, for example, it's easier 
- You don't have as much time to spend on other stuff
- You are responsible for security and backups
- You are responsible for maintenance
- To make a backup you have to know how to dump the DB and store it yourself.

### DBaaS pros
- You sacrifice money for time, but not always as the upfront costs of a self hosted DB can be large
- To initialize you just pay the provider who then gives you an endpoint
- The service provider can assist you with issues
- Saves time on managing hardware and scaling
- Super good availability
- Some legal coverage is outsourced to the provider
- You don't have to know much about managing physical servers
- If you want extra security or backups you can just pay for it
- Backups are automated and expected as part of the service
- Costs scale more smoothly with usage

### DBaaS cons
- You are not in control of the database
- Can be expensive with unforeseen fees or if the provider hikes their rates
- You are sometimes "trapped" by the provider, it can be hard to switch