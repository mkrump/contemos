package translators

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/mkrump/numbers/api/loggers"
	"github.com/sirupsen/logrus"

	"github.com/stretchr/testify/suite"
)

type TranslatorTestSuite struct {
	*logrus.Logger
	suite.Suite
	APIKey string
}

func TestTranslationServiceSuite(t *testing.T) {
	l := loggers.NewDefaultLogger()
	s := &TranslatorTestSuite{Logger: l}
	fmt.Println(os.Getwd())
	appCredentials := os.Getenv("GC_ACCOUNT_TYPE")
	if appCredentials == "" {
		t.Fatal("Need to set env var GC_ACCOUNT_TYPE")
	}
	suite.Run(t, s)
}

func (suite *TranslatorTestSuite) TestTTSIntegrationTranslate() {
	ctx := context.Background()
	fmt.Println(os.Getwd())

	t, err := NewTranslator(ctx)
	suite.NoError(err)

	_, err = t.Translate("1", "es")
	suite.NoError(err)
}
