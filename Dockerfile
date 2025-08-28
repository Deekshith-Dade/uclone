FROM golang:1.25-alpine

WORKDIR /app

COPY go.mod ./

COPY *.go ./
COPY static ./static

RUN go build -o app

CMD ["./app"]

