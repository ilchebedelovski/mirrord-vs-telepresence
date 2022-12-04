# Mirrord

## Introduction

Run your service in the context of your cloud environment, with access to other microservices, databases, queues, and managed services, all without leaving the local setup you know and love. mirrord is an open-source tool that lets developers run local processes in the context of their cloud environment. It’s meant to provide the benefits of running your service on a cloud environment (e.g. staging) without actually going through the hassle of deploying it there, and without disrupting the environment by deploying untested code.


## Mirrord architecture

`mirrord` runs in two places - in the memory of your local process, and as a pod in your cloud environment. The two components work together to fuse your local process with its remote counterpart so that inputs to the remote pod are mirrored to the local process, and outputs from the local process are tunnelled to the remote pod. This includes network traffic, file access, and environment variable - everything needed to make your local process “think” it's running in the cloud.

The deployment to staging stage is expensive for several reasons:

- It often goes through a CI process, which is often slow (because of e.g. a long automated test suite having to pass in order to progress) and sometimes broken
- Since staging environments are usually shared, the environment is occasionally broken when an engineer deploys unstable code.

## How mirrored works

The mirrord-layer then hooks syscalls for your process, overriding its network behavior to listen to incoming traffic from the agent, instead of local sockets. It then subscribes to incoming traffic from the agent (whatever was sniffed by the agent on the port that’s being listened to locally), and whatever traffic reaches the remote pod is then duplicated by the agent, sent to the layer, and routed to the local process. Outgoing TCP traffic from the local process is intercepted by the mirrord-layer and forwarded to the agent, which in turn sends it out as if originating from the remote pod.


## Mirrord features

- `mirroring` - mirrord’s default configuration is to mirror incoming TCP traffic from the remote pod, i.e. run the local process in the context of cloud environment without disrupting incoming traffic for the remote pod. Any responses by the local process to the mirrored requests are dropped, and so whatever application is running on the remote pod continues to operate normally while the traffic is mirrored to the local process.
- `stealing` - mirrord can steal network traffic, i.e. intercept it and send it to the local process instead of the remote pod. This means that all incoming traffic is only handled by the local process.
- `outgoing` - mirrord’s outgoing traffic feature intercepts outgoing requests from the local process and sends them through the remote pod instead. Responses are then routed back to the local process. A simple use case of this feature is enabling the local process to make an API call to another service in the k8s cluster, for example, a database read/write.

## Demo

The mirrord cli needs to be installed locally, once it is installed it is communicating with the default `kubectl` context.

Application check
```
$ kubectl port-forward svc/example-blog 8080:8080
$ yarn workspace blog dev

$ curl http://localhost:3000

$ kubectl get po -l app=example-auditor
```

Mirrord exec
```
$ mirrord exec --no-fs -x NODE_ENV --target pod/example-blog-<hash>-<hash> yarn -- workspace blog dev
```


# Telepresence

Telepresence is an open source tool for Kubernetes application developers that lets you run a single service locally while connecting that service to a remote Kubernetes cluster. Telepresence is a CNCF sandbox tool built by the team at Ambassador Labs, the creators of Emissary-ingress (Kubernetes-native API gateway powered by Envoy Proxy).

## How does it work?

Telepresence consists of two core architecture components: the client-side (CLI) telepresence binary and (Kubernetes) cluster-side traffic-manager and traffic-agent.

1. The `telepresence connect` command utilizes the traffic-manager to establish a two-way (proxied) tunnel between your local development machine and the cluster. Now you can access remote K8s Service as if they were running locally.

2. Running `telepresence intercept service-name` triggers the traffic-manager to install a traffic-agent proxy container that runs within the Pods associated with the target Services. This can route remote traffic to your local dev machine for dev and test.


$ kubectl get ns
$ kubectl -n ambassador get pods, it is deployed with telepresence helm install
$ kubectl apply -f app.yaml
$ minikube service --url telepresence-demo

$ curl http://192.168.49.2:32721/

$ telepresence connect
$ telepresence status


$ cd telepresence && node app.js

$ telepresence list
$ telepresence intercept telepresence-demo  --port 9001

$ curl http://<ip-address>:<port>/


# Issues

Error
```
telepresence: error: connection error: desc = "transport: error while dialing: dial unix /var/run/telepresence-daemon.socket: connect: connection refused" (socket rm failed with remove /var/run/telepresence-daemon.socket: permission denied); this usually means that the process has terminated ungracefully
If you think you have encountered a bug, please run `telepresence gather-logs` and attach the telepresence_logs.zip to your github issue or create a new one: https://github.com/telepresenceio/telepresence/issues/new?template=Bug_report.md .
```

Solution
```
$ sudo rm /var/run/telepresence-daemon.socket
```

Error
```
2022-11-30 10:56:04.3191 info    connector/server-grpc : gRPC server started
2022-11-30 10:56:04.3219 error   connector/refresh-token : goroutine "/connector/refresh-token" exited with error: lstat /Users/ilchebedelovski/Library/Caches/telepresence: no such file or directory
```

Solution
```
$ mkdir -p /Users/$USER/Library/Caches/telepresence
```

Error
```
error: failed to clear chain TEL_INBOUND_TCP: running [/sbin/iptables -t nat -N TEL_INBOUND_TCP --wait]: exit status 3: iptables v1.8.7 (legacy): can't initialize iptables table `nat': iptables who? (do you need to insmod?)
Perhaps iptables or your kernel needs to be upgraded
```