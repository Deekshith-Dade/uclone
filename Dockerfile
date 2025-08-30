FROM golang:1.25-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
COPY *.go ./
COPY frontend ./frontend
COPY postgres ./postgres


RUN go build -o app


CMD ["./app"]

