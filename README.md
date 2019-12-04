# rasp-kube-demo

Kubernetes deployment on Raspberry pi cluster

## Installation

### hardware require:

> 1 machine for HAProxy IP: 192.168.0.100  
> 1 machine nginx IP: 192.168.0.101  
> 2 machine for Master-Node IP: 192.168.0.101, 192.168.0.102  
> 4 raspberry pi IP: 192.168.0.103, 192.168.0.104, 192.168.0.105, 192.168.0.106

`all machine we use ubuntu 16.04 server image`

**Client Machine**

Installing cfssl

1- Download the binaries.

```
$ wget https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
$ wget https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
```

2- Add the execution permission to the binaries.

```
$ chmod +x cfssl*
```

3- Move the binaries to /usr/local/bin.

```
$ sudo mv cfssl_linux-amd64 /usr/local/bin/cfssl
$ sudo mv cfssljson_linux-amd64 /usr/local/bin/cfssljson
```

4- Verify the installation.

```
$ cfssl version
```

Installing kubectl

1- Download the binary.

```
$ wget https://storage.googleapis.com/kubernetes-release/release/v1.15.0/bin/linux/amd64/kubectl
```

2- Add the execution permission to the binary.

```
$chmod +x kubectl
```

3- Move the binary to /usr/local/bin.

```
$sudo mv kubectl /usr/local/bin
```

4- Verify the installation.

```
$ kubectl version
```

**HAProxy Machine**

1- SSH to the 10.10.10.93 Ubuntu machine.

2- Update the machine.

```
$ sudo apt-get update
$ sudo apt-get upgrade
```

3- Install HAProxy.

```
$ sudo apt-get install haproxy
```

4- Configure HAProxy to load balance the traffic between the three Kubernetes master nodes.

```
$ sudo vim /etc/haproxy/haproxy.cfg
global
...
default
...
frontend kubernetes
bind 192.168.0.100:6443
option tcplog
mode tcp
default_backend kubernetes-master-nodes


backend kubernetes-master-nodes
mode tcp
balance roundrobin
option tcp-check
server k8s-master-0 192.168.0.101:6443 check fall 2 rise 1
server k8s-master-1 192.168.0.102:6443 check fall 2 rise 1
```

5- Restart HAProxy.

```
$ sudo systemctl restart haproxy
```

Generating the TLS certificates
These steps can be done on your Linux desktop if you have one or on the HAProxy machine depending on where you installed the cfssl tool.

Creating a certificate authority
1- Create the certificate authority configuration file.

```
$ vim ca-config.json
{
  "signing": {
    "default": {
      "expiry": "8760h"
    },
    "profiles": {
      "kubernetes": {
        "usages": ["signing", "key encipherment", "server auth", "client auth"],
        "expiry": "8760h"
      }
    }
  }
}
```

2- Create the certificate authority signing request configuration file.

```
$ vim ca-csr.json
{
  "CN": "Kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
  {
    "C": "IE",
    "L": "Cork",
    "O": "Kubernetes",
    "OU": "CA",
    "ST": "Cork Co."
  }
 ]
}
```

3- Generate the certificate authority certificate and private key.

```
$ cfssl gencert -initca ca-csr.json | cfssljson -bare ca
```

4- Verify that the ca-key.pem and the ca.pem were generated.

```
$ ls -la
```

Creating the certificate for the Etcd cluster

1- Create the certificate signing request configuration file.

```
$ vim kubernetes-csr.json
{
  "CN": "kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
  {
    "C": "IE",
    "L": "Cork",
    "O": "Kubernetes",
    "OU": "Kubernetes",
    "ST": "Cork Co."
  }
 ]
}
```

2- Generate the certificate and private key.

```
$ cfssl gencert \
-ca=ca.pem \
-ca-key=ca-key.pem \
-config=ca-config.json \
-hostname=192.168.0.100,192.168.0.101,192.168.0.102,127.0.0.1,kubernetes.default \
-profile=kubernetes kubernetes-csr.json | \
cfssljson -bare kubernetes
```

3- Verify that the kubernetes-key.pem and the kubernetes.pem file were generated.

```
$ ls -la
```

4- Copy the certificate to each nodes.

```
$ scp ca.pem kubernetes.pem kubernetes-key.pem <user>@192.168.0.100:~
$ scp ca.pem kubernetes.pem kubernetes-key.pem <user>@192.168.0.101:~
$ scp ca.pem kubernetes.pem kubernetes-key.pem <user>@192.168.0.102:~
```

**Master Mahine**

install docker

```
$ sudo apt install docker.io
$ sudo systemctl start docker
$ sudo systemctl enable docker
```

Installing kubeadm, kublet, and kubectl

1- Add the Google repository key.

```
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
```

2- Add the Google repository.

```
$ vim /etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io kubernetes-xenial main
```

3- Update the list of packages.

```
$ apt-get update
```

4- Install kubelet, kubeadm and kubectl.

```
$ apt-get install kubelet kubeadm kubectl
```

5- Disable the swap.

```
$ swapoff -a
$ sed -i '/ swap / s/^/#/' /etc/fstab
```

**Raspberry Pi**

run script for setup

```
#!/bin/sh

# Install Docker
curl -sSL get.docker.com | sh && \
sudo usermod pi -aG docker

# Disable Swap
sudo dphys-swapfile swapoff && \
sudo dphys-swapfile uninstall && \
sudo update-rc.d dphys-swapfile remove
echo Adding " cgroup_enable=cpuset cgroup_enable=memory" to /boot/cmdline.txt
sudo cp /boot/cmdline.txt /boot/cmdline_backup.txt
orig="$(head -n1 /boot/cmdline.txt) cgroup_enable=cpuset cgroup_enable=memory"
echo $orig | sudo tee /boot/cmdline.txt

# Add repo list and install kubeadm
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && \
echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list && \
sudo apt-get update -q && \
sudo apt-get install -qy kubeadm
```

**Installing and configuring Etcd **

> For master node IP: 192.168.101, 192.168.0.102

2- Create a configuration directory for Etcd.

```
$ sudo mkdir /etc/etcd /var/lib/etcd
```

3- Move the certificates to the configuration directory.

```
$ sudo mv ~/ca.pem ~/kubernetes.pem ~/kubernetes-key.pem /etc/etcd
```

4- Download the etcd binaries.

```
$ wget https://github.com/coreos/etcd/releases/download/v3.3.9/etcd-v3.3.9-linux-amd64.tar.gz
```

5- Extract the etcd archive.

```
$ tar xvzf etcd-v3.3.9-linux-amd64.tar.gz
```

6- Move the etcd binaries to /usr/local/bin.

```
$ sudo mv etcd-v3.3.9-linux-amd64/etcd* /usr/local/bin/
```

7- Create an etcd systemd unit file.

> For 192.168.0.101

```
$ sudo vim /etc/systemd/system/etcd.service
[Unit]
Description=etcd
Documentation=https://github.com/coreos


[Service]
ExecStart=/usr/local/bin/etcd \
  --name 192.168.0.101 \
  --cert-file=/etc/etcd/kubernetes.pem \
  --key-file=/etc/etcd/kubernetes-key.pem \
  --peer-cert-file=/etc/etcd/kubernetes.pem \
  --peer-key-file=/etc/etcd/kubernetes-key.pem \
  --trusted-ca-file=/etc/etcd/ca.pem \
  --peer-trusted-ca-file=/etc/etcd/ca.pem \
  --peer-client-cert-auth \
  --client-cert-auth \
  --initial-advertise-peer-urls https://192.168.0.101:2380 \
  --listen-peer-urls https://192.168.0.101:2380 \
  --listen-client-urls https://192.168.0.101:2379,http://127.0.0.1:2379 \
  --advertise-client-urls https://192.168.0.101:2379 \
  --initial-cluster-token etcd-cluster-0 \
  --initial-cluster 192.168.0.101=https://192.168.0.101:2380,192.168.0.102=https://192.168.0.102:2380 \
  --initial-cluster-state new \
  --data-dir=/var/lib/etcd
Restart=on-failure
RestartSec=5



[Install]
WantedBy=multi-user.target
```

> For 192.168.0.102

```
$ sudo vim /etc/systemd/system/etcd.service
[Unit]
Description=etcd
Documentation=https://github.com/coreos


[Service]
ExecStart=/usr/local/bin/etcd \
  --name 192.168.0.102 \
  --cert-file=/etc/etcd/kubernetes.pem \
  --key-file=/etc/etcd/kubernetes-key.pem \
  --peer-cert-file=/etc/etcd/kubernetes.pem \
  --peer-key-file=/etc/etcd/kubernetes-key.pem \
  --trusted-ca-file=/etc/etcd/ca.pem \
  --peer-trusted-ca-file=/etc/etcd/ca.pem \
  --peer-client-cert-auth \
  --client-cert-auth \
  --initial-advertise-peer-urls https://192.168.0.102:2380 \
  --listen-peer-urls https://192.168.0.102:2380 \
  --listen-client-urls https://192.168.0.102:2379,http://127.0.0.1:2379 \
  --advertise-client-urls https://192.168.0.102:2379 \
  --initial-cluster-token etcd-cluster-0 \
  --initial-cluster 192.168.0.101=https://192.168.0.101:2380,192.168.0.102=https://192.168.0.102:2380 \
  --initial-cluster-state new \
  --data-dir=/var/lib/etcd
Restart=on-failure
RestartSec=5



[Install]
WantedBy=multi-user.target
```

8- Reload the daemon configuration.

```
$ sudo systemctl daemon-reload
```

9- Enable etcd to start at boot time.

```
$ sudo systemctl enable etcd
```

10- Start etcd.

```
$ sudo systemctl start etcd
```

**Initializing the master nodes**

> At Machine 192.168.0.101

Create the configuration file for kubeadm.

```
$ vim config.yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: stable
apiServerCertSANs:
- 192.168.0.100
controlPlaneEndpoint: "192.168.0.100:6443"
etcd:
  external:
    endpoints:
    - https://192.168.0.101:2379
    - https://192.168.0.102:2379
    caFile: /etc/etcd/ca.pem
    certFile: /etc/etcd/kubernetes.pem
    keyFile: /etc/etcd/kubernetes-key.pem
networking:
  podSubnet: 10.244.0.0/16
apiServerExtraArgs:
  apiserver-count: "3"

```

Initialize the machine as a master node.

```
$ sudo kubeadm init --config=config.yaml
```

Copy the certificates to the two other masters.

```
$ sudo scp -r /etc/kubernetes/pki <user>@192.168.0.102:~
```

**Join Master Node**

Remove the apiserver.crt and apiserver.key.

```
$ rm ~/pki/apiserver.*
```

Move the certificates to the /etc/kubernetes directory.

```
$ sudo mv ~/pki /etc/kubernetes/
```

Join master to master node

```
$ kubeadm join 192.168.0.100:6443 --token <token> \
    --discovery-token-ca-cert-hash <sha25> \
    --control-plane
```

**Join worker node**

> raspberry pi (IP: 192.168.0.103, IP: 192.168.0.104,IP: 192.168.0.105,IP: 192.168.0.106 )

Execute the "kubeadm join" command that you copied from the last step of the initialization of the masters.

```
$ sudo kubeadm join 192.168.0.100:6443 --token [your_token] --discovery-token-ca-cert-hash sha256:[your_token_ca_cert_hash]
```

**setup kubectl in client**

1- SSH to one of the master node.

```
ssh <user>@192.168.0.101
```

2- Add permissions to the admin.conf file.

```
$ sudo chmod +r /etc/kubernetes/admin.conf
```

3- From the client machine, copy the configuration file.

```
$ scp <user>@192.168.0.101:/etc/kubernetes/admin.conf .
```

4- Create the kubectl configuration directory.

```
$ mkdir ~/.kube
```

5- Move the configuration file to the configuration directory.

```
$ mv admin.conf ~/.kube/config
```

6- Modify the permissions of the configuration file.

```
$ chmod 600 ~/.kube/config
```

7- Go back to the SSH session on the master and change back the permissions of the configuration file.

```
$ sudo chmod 600 /etc/kubernetes/admin.conf
```

8- check that you can access the Kubernetes API from the client machine.

```
$ kubectl get nodes
```

**Deploying the overlay network**

Deploy the overlay network pods from the client machine.

```
 $ kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

2- Check that the pods are deployed properly.

```
$ kubectl get pods -n kube-system
```

3- Check that the nodes are in Ready state.

```
$ kubectl get nodes
NAME STATUS ROLES AGE VERSION
k8s-kubeadm-master-0 Ready master 18h v1.12.1
k8s-kubeadm-master-1 Ready master 18h v1.12.1
k8s-kubeadm-master-2 Ready master 18h v1.12.1
k8s-kubeadm-worker-0 Ready  16h v1.12.1
k8s-kubeadm-worker-1 Ready  16h v1.12.1
k8s-kubeadm-worker-2 Ready  16h v1.12.1
```

**Installing Kubernetes add-ons**

Installing the Kubernetes dashboard

1- Create the Kubernetes dashboard manifest.

```
$ vim kubernetes-dashboard.yaml
# Copyright 2017 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# Configuration to deploy release version of the Dashboard UI compatible with
# Kubernetes 1.8.
#
# Example usage: kubectl create -f
# ------------------- Dashboard Secret ------------------- #
apiVersion: v1
kind: Secret
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard-certs
  namespace: kube-system
type: Opaque
---
# ------------------- Dashboard Service Account ------------------- #
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
---
# ------------------- Dashboard Role & Role Binding ------------------- #
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: kubernetes-dashboard-minimal
  namespace: kube-system
rules:
  # Allow Dashboard to create 'kubernetes-dashboard-key-holder' secret.
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["create"]
  # Allow Dashboard to create 'kubernetes-dashboard-settings' config map.
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["create"]
  # Allow Dashboard to get, update and delete Dashboard exclusive secrets.
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["kubernetes-dashboard-key-holder", "kubernetes-dashboard-certs"]
  verbs: ["get", "update", "delete"]
  # Allow Dashboard to get and update 'kubernetes-dashboard-settings' config map.
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["kubernetes-dashboard-settings"]
  verbs: ["get", "update"]
  # Allow Dashboard to get metrics from heapster.
- apiGroups: [""]
  resources: ["services"]
  resourceNames: ["heapster"]
  verbs: ["proxy"]
- apiGroups: [""]
  resources: ["services/proxy"]
  resourceNames: ["heapster", "http:heapster:", "https:heapster:"]
  verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kubernetes-dashboard-minimal
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: kubernetes-dashboard-minimal
subjects:
- kind: ServiceAccount
  name: kubernetes-dashboard
  namespace: kube-system
---
# ------------------- Dashboard Deployment ------------------- #
kind: Deployment
apiVersion: apps/v1beta2
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: kubernetes-dashboard
  template:
    metadata:
      labels:
        k8s-app: kubernetes-dashboard
    spec:
      containers:
      - name: kubernetes-dashboard
        image: k8s.gcr.io/kubernetes-dashboard-amd64:v1.8.3
        ports:
        - containerPort: 8443
          protocol: TCP
        args:
          - --auto-generate-certificates
          # Uncomment the following line to manually specify Kubernetes API server Host
          # If not specified, Dashboard will attempt to auto discover the API server and connect
          # to it. Uncomment only if the default does not work.
          # - --apiserver-host=http://my-address:port
        volumeMounts:
        - name: kubernetes-dashboard-certs
          mountPath: /certs
          # Create on-disk volume to store exec logs
        - mountPath: /tmp
          name: tmp-volume
        livenessProbe:
          httpGet:
            scheme: HTTPS
            path: /
            port: 8443
          initialDelaySeconds: 30
          timeoutSeconds: 30
      volumes:
      - name: kubernetes-dashboard-certs
        secret:
          secretName: kubernetes-dashboard-certs
      - name: tmp-volume
        emptyDir: {}
      serviceAccountName: kubernetes-dashboard
      # Comment the following tolerations if Dashboard must not be deployed on master
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
---
# ------------------- Dashboard Service ------------------- #
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  ports:
    - port: 443
      targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
```

2- Deploy the dashboard.

```
$ kubectl create -f kubernetes-dashboard.yaml
```

**Build and Deploying services**

Build and deploy the services to Kubernetes cluster

```
$ ./deploy.sh
```

**Config external network proxy to Kubernetes services**

We use nginx to proxy network requests to our cluster

```conf
worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    upstream nodes {
        ip_hash;

        server localhost:3001;
        server localhost:3002;
    }
    server {
        listen       80;
        server_name  localhost;
        location / {
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_pass http://192.168.0.103:31318/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
        location /summary {
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_pass http://192.168.0.103:31319/summary;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
        location /data {
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_pass http://192.168.0.103:31319/data;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
    include servers/*;
}
```
