package translators

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"os"
	"strings"

	texttospeech "cloud.google.com/go/texttospeech/apiv1"
	"google.golang.org/api/option"
	texttospeechpb "google.golang.org/genproto/googleapis/cloud/texttospeech/v1"
)

type Translator struct {
	client *texttospeech.Client
	ctx    context.Context
}

type CredentialsData struct {
	Type                    string `json:"type"`
	ProjectId               string `json:"project_id"`
	PrivateKeyId            string `json:"private_key_id"`
	PrivateKey              string `json:"private_key"`
	ClientEmail             string `json:"client_email"`
	ClientId                string `json:"client_id"`
	AuthUri                 string `json:"auth_uri"`
	TokenUri                string `json:"token_uri"`
	AuthProviderX509CertUrl string `json:"auth_provider_x509_cert_url"`
	ClientX509CertUrl       string `json:"client_x509_cert_url"`
}

func GetCredentials() option.ClientOption {
	pm := os.Getenv("GC_PRIVATE_KEY")
	backSlashFix := strings.Replace(pm, "\\n", "\n", -1)
	jsonCred := &CredentialsData{
		Type:                    os.Getenv("GC_ACCOUNT_TYPE"),
		ProjectId:               os.Getenv("GC_PROJECT_ID"),
		PrivateKeyId:            os.Getenv("GC_PRIVATE_KEY_ID"),
		PrivateKey:              backSlashFix,
		ClientEmail:             os.Getenv("GC_CLIENT_EMAIL"),
		ClientId:                os.Getenv("GC_CLIENT_ID"),
		AuthUri:                 os.Getenv("GC_AUTH_URI"),
		TokenUri:                os.Getenv("GC_TOKEN_URI"),
		AuthProviderX509CertUrl: os.Getenv("GC_AUTH_PROVIDER_X509_CERT_URL"),
		ClientX509CertUrl:       os.Getenv("GC_CLIENT_X509_CERT_URL"),
	}
	bs, e := json.Marshal(jsonCred)
	if e != nil {
		log.Fatalf("Could not create json from credentials struct %s", e)
	}
	opt := option.WithCredentialsJSON(bs)
	return opt
}

func NewTranslator(ctx context.Context) (*Translator, error) {
	options := GetCredentials()
	client, err := texttospeech.NewClient(ctx, options)
	if err != nil {
		return nil, err
	}
	return &Translator{client: client, ctx: ctx}, nil
}

func (t *Translator) Translate(text string, languageCode string) (io.Reader, error) {
	req := texttospeechpb.SynthesizeSpeechRequest{
		Input: &texttospeechpb.SynthesisInput{
			InputSource: &texttospeechpb.SynthesisInput_Text{Text: text},
		},
		Voice: &texttospeechpb.VoiceSelectionParams{
			LanguageCode: languageCode,
			SsmlGender:   texttospeechpb.SsmlVoiceGender_NEUTRAL,
		},
		AudioConfig: &texttospeechpb.AudioConfig{
			AudioEncoding: texttospeechpb.AudioEncoding_MP3,
		},
	}

	resp, err := t.client.SynthesizeSpeech(t.ctx, &req)
	if err != nil {
		return nil, err
	}
	return bytes.NewReader(resp.AudioContent), nil
}
