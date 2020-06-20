package numbers

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/sirupsen/logrus"

	"github.com/stretchr/testify/suite"
)

type TranslatorTestSuite struct {
	*logrus.Logger
	suite.Suite
	APIKey string
}

func TestTTSSuite(t *testing.T) {
	l := NewDefaultLogger()
	s := &TranslatorTestSuite{Logger: l}
	fmt.Println(os.Getwd())
	appCredentials := os.Getenv("GC_ACCOUNT_TYPE")
	if appCredentials == "" {
		t.Fatal("Need to set env var GC_ACCOUNT_TYPE")
	}
	suite.Run(t, s)
}

func (suite *TranslatorTestSuite) TestTTSIntegration() {
	ctx := context.Background()
	fmt.Println(os.Getwd())

	t, err := NewTTS(ctx)
	suite.NoError(err)

	_, err = t.Translate("1", "es")
	suite.NoError(err)
}
