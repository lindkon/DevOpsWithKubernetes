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

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: pixabay-apikey
data:
  API_KEY: "56531896-e21bf55eee72730b424839747"
EOF