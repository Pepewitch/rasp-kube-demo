#! /bin/sh


tag=$1
mkdir -p deploy/$tag
names='rasp-gateway rasp-database rasp-summary rasp-frontend'
for name in $names
do
  cd $name
  ~/.docker/cli-plugins/docker-buildx/buildx build --platform linux/arm64,linux/arm/v7 -t sk134pepe/$name:$tag --push .
  cd ..
  sed s/latest/$tag/g k8s/$name-deployment.yaml > deploy/$tag/$name-deployment.yaml
  sed s/latest/$tag/g k8s/$name-service.yaml > deploy/$tag/$name-service.yaml
done

kubectl apply -f deploy/$tag