FROM golang:1.25-alpine

WORKDIR /app

COPY go.mod ./
COPY *.go ./
COPY static ./static
COPY postgres ./postgres


RUN go build -o app


CMD ["./app"]

