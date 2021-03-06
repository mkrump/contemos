package numbers

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/lambdacontext"

	"github.com/sirupsen/logrus"
)

type Getter interface {
	Get(number string, languageCode string) (string, error)
}

type Handler struct {
	logger *logrus.Logger
	Getter
}

func NewHandler(logger *logrus.Logger, getter Getter) *Handler {
	return &Handler{logger: logger, Getter: getter}
}

type ResponseBody struct {
	Number       string `json:"number"`
	LanguageCode string `json:"language_code"`
	Url          string `json:"url"`
}

type Bearer struct {
	Identity *Identity `json:"identity"`
	User     *User     `json:"user"`
	SiteUrl  string    `json:"site_url"`
	Alg      string    `json:"alg"`
}

type Identity struct {
	URL   string `json:"url"`
	Token string `json:"token"`
}

type User struct {
	AppMetaData  *AppMetaData  `json:"app_metadata"`
	Email        string        `json:"email"`
	Exp          int           `json:"exp"`
	Sub          string        `json:"sub"`
	UserMetadata *UserMetadata `json:"user_metadata"`
}
type AppMetaData struct {
	Provider string `json:"provider"`
}
type UserMetadata struct {
	FullName string `json:"full_name"`
}

func AuthMiddleware(h *Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lc, ok := lambdacontext.FromContext(r.Context())
		if !ok {
			err := errors.New("server error")
			h.logger.Errorf("error retrieving context %+v", r.Context())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		bearer := lc.ClientContext.Custom["netlify"]
		raw, err := base64.StdEncoding.DecodeString(bearer)
		if err != nil {
			h.logger.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		data := Bearer{}
		err = json.Unmarshal(raw, &data)
		if err != nil {
			h.logger.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if data.User == nil {
			err := errors.New("forbidden")
			h.logger.Errorf("Unauthenticated request bearer: %+v", bearer)
			http.Error(w, err.Error(), http.StatusForbidden)
			return
		}
		h.ServeHTTP(w, r)
	})
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("request: %s", r.URL.Query())
	number := r.URL.Query().Get("number")
	if number == "" {
		h.logger.Errorf("missing number %v", r.URL.Query())
		err := errors.New("missing number")
		http.Error(w, err.Error(), 404)
		return
	}
	languageCode := r.URL.Query().Get("languageCode")
	if languageCode == "" {
		h.logger.Errorf("missing languageCode %v", r.URL.Query())
		err := errors.New("missing languageCode")
		http.Error(w, err.Error(), 404)
		return
	}
	url, err := h.Get(number, languageCode)
	if err != nil {
		h.logger.WithError(err).Error(fmt.Sprintf("error getting translation for number: %s, languageCode: %s", number, languageCode))
		http.Error(w, fmt.Sprint(url), 500)
		return
	}
	enc := json.NewEncoder(w)
	// https://github.com/golang/go/issues/14749
	enc.SetEscapeHTML(false)
	rb := ResponseBody{
		Number:       number,
		LanguageCode: languageCode,
		Url:          url,
	}
	err = enc.Encode(rb)
	if err != nil {
		h.logger.WithError(err).Error("error encoding response")
		http.Error(w, fmt.Sprint(url), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}
