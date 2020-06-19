package main

import (
	"context"
	"flag"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/mkrump/numbers/api/handlers"
	"github.com/mkrump/numbers/api/loggers"
	"github.com/mkrump/numbers/api/storage"
	"github.com/mkrump/numbers/api/translationservice"
	"github.com/mkrump/numbers/api/translators"
	"github.com/sirupsen/logrus"

	"net/http"
	"os"

	"github.com/apex/gateway"
)

func initLogger() *logrus.Logger {
	l := loggers.NewDefaultLogger()
	return l
}

func initTranslator() *translators.Translator {
	ctx := context.Background()
	t, err := translators.NewTranslator(ctx)
	if err != nil {
		log.Fatalf("error initializing app: %v", err)
	}
	return t
}

func initUploader() *storage.S3 {
	region := os.Getenv("S3_REGION")
	if region == "" {
		log.Fatal("Need to set env var S3_REGION")
	}
	config := aws.Config{Region: aws.String(region)}
	bucket := os.Getenv("S3_BUCKET")
	if bucket == "" {
		log.Fatal("Need to set env var S3_BUCKET")
	}
	cloudfrontDomain := os.Getenv("CLOUDFRONT_DOMAIN")
	if cloudfrontDomain == "" {
		log.Fatal("Need to set env var CLOUDFRONT_DOMAIN")
	}
	return storage.NewS3(bucket, cloudfrontDomain, config)
}

func main() {
	t := initTranslator()
	u := initUploader()
	l := initLogger()
	ts := translationservice.NewTranslationService(l, t, u)
	h := handlers.NewHandler(l, ts)
	port := flag.Int("port", -1, "specify a port to use http rather than AWS Lambda")
	flag.Parse()
	listener := gateway.ListenAndServe
	var portStr string
	if *port != -1 {
		portStr = fmt.Sprintf(":%d", *port)
		listener = http.ListenAndServe
	}
	http.Handle("/api/numbers", h)
	log.Fatal(listener(portStr, nil))
}
