#!/bin/bash

if command -v migrate &> /dev/null
then
  migrate -source 'file://./migrations' -database 'postgresql://postgres:example@localhost:5432?sslmode=disable' up;

  migrate -source 'file://./migrations/blog' -database 'postgresql://postgres:example@localhost:5432/blog?sslmode=disable' up;
else
  docker run -v $(pwd)/migrations:/migrations migrate/migrate -path='/migrations/' -database 'postgresql://postgres:example@host.docker.internal:5432/?sslmode=disable' up;

  docker run -v $(pwd)/migrations:/migrations migrate/migrate -path='/migrations/blog' -database 'postgresql://postgres:example@host.docker.internal:5432/blog?sslmode=disable' up;
fi
