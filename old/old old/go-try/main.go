package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/bcrypt"
	"os/exec"
)

var password = "$2a$10$iqFwmYIR9UkOtRTAuq.xqeLYrwov.kptFH.bTH6oUa33wbqO9PHPK" // bcrypt hash of "password"

// Config
var (
	toastlist = []string{"java", "osu!"}
	user      = "<user>"
	header    = `<head>
<title>toasterator</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>`
	toasted  = true
	disabled = true
)

func main() {
	go func() {
		for {
			if toasted {
				exec.Command("killall", toastlist...).Run()
			}
			if disabled {
				exec.Command("pkill", "-u", user).Run()
			}
			time.Sleep(5 * time.Second)
		}
	}()

	e := echo.New()

	e.Use(middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
		if username == "admin" && bcrypt.CompareHashAndPassword([]byte(password), []byte(password)) == nil {
			return true, nil
		}
		return false, nil
	}))

	e.GET("/", func(c echo.Context) error {
		return c.File("views/main.ecr")
	})

	e.GET("/shutdown", func(c echo.Context) error {
		exec.Command("shutdown", "now").Run()
		return c.String(http.StatusOK, "Shutdown Computer")
	})

	e.GET("/exit", func(c echo.Context) error {
		exec.Command("killall", "java").Run()
		return c.String(http.StatusOK, "Exit Toastlist")
	})

	e.GET("/logout", func(c echo.Context) error {
		exec.Command("pkill", "-u", user).Run()
		return c.String(http.StatusOK, "Logout User")
	})

	e.GET("/reboot", func(c echo.Context) error {
		exec.Command("reboot").Run()
		return c.String(http.StatusOK, "Reboot Computer")
	})

	e.GET("/toast", func(c echo.Context) error {
		toasted = true
		return c.String(http.StatusOK, "Toast Toastlist")
	})

	e.GET("/untoast", func(c echo.Context) error {
		toasted = false
		return c.String(http.StatusOK, "Untoast Toastlist")
	})

	e.GET("/add/:processname", func(c echo.Context) error {
		process := c.Param("processname")
		toastlist = append(toastlist, process)
		return c.String(http.StatusOK, "Add "+process+" to Toastlist")
	})

	e.GET("/remove/:processname", func(c echo.Context) error {
		process := c.Param("processname")
		for i, v := range toastlist {
			if v == process {
				toastlist = append(toastlist[:i], toastlist[i+1:]...)
				break
			}
		}
		return c.String(http.StatusOK, "Remove "+process+" from Toastlist")
	})

	e.GET("/disable", func(c echo.Context) error {
		disabled = true
		return c.String(http.StatusOK, "Disabled User "+user)
	})

	e.GET("/enable", func(c echo.Context) error {
		disabled = false
		return c.String(http.StatusOK, "Enabled User "+user)
	})

	e.Logger.Fatal(e.Start(":6010"))
}
