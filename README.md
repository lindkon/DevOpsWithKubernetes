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

## Commands I will forget

Build docker image:

```docker build -t lindkon/log-output:1.1 .```

Push image for kubernetes to find:

```docker push lindkon/log-output:1.1```

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

## Submission & Release Instructions

To ensure exercises are graded correctly, follow this exact workflow to publish releases for every completed task.

### 1. Commit Your Code
Once your application is running correctly in your cluster, commit and push your changes to your main branch.

`git add .`

`git commit -m "Complete Exercise 1.1"`

`git push origin main`

### 3. Create the Release Tag
You must create a GitHub release where the tag **exactly matches** the exercise number (e.g., `1.1`). 

**Using the command line:**

`git tag -a 1.1 -m "Exercise 1.1"`

`git push origin 1.1`

*(You can also draft the release and create the tag directly through the GitHub UI under the **Releases** tab.)*

### 4. Update Exercise Links
After creating the tag, edit the **Exercises** section at the top of this file. The link must point to the specific directory for that application, at that specific release tag.

**Format:**
`https://github.com/lindkon/DevOpsWithKubernetes/tree/EXERCISE_NUMBER/APP_DIRECTORY`