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

## Commands I will forget

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

git tag -a 3.1 -m "Exercise 3.1"
git push origin 3.1

*(You can also draft the release and create the tag directly through the GitHub UI under the **Releases** tab.)*

### 4. Update Exercise Links
After creating the tag, edit the **Exercises** section at the top of this file. The link must point to the specific directory for that application, at that specific release tag.

**Format:**
`https://github.com/lindkon/DevOpsWithKubernetes/tree/EXERCISE_NUMBER/APP_DIRECTORY`