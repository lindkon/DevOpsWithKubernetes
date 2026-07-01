cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: ubuntu
  labels:
    app: ubuntu
spec:
  containers:
  - image: alpine
    name: ubuntu
    command: ["/bin/sh", "-c"]
    args:
      - "apk add --no-cache curl && sleep 604800"
EOF



kubectl exec -it ubuntu -- /bin/bash
