FROM golang:alpine
RUN apk add --no-cache git
RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN go mod download
RUN go build -o main ./
CMD ["./main"]