#! /bin/sh

names='rasp-gateway rasp-database rasp-summary rasp-frontend'
for name in $names
do
  cd $name
  docker build --tag sk134pepe/$name:latest .
  docker push sk134pepe/$name:latest
  cd ..
done
