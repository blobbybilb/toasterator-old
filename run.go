package main

import (
	"fmt"
	"runtime"
)

func logoutUser(username string) {
	if runtime.GOOS == "windows" {
		fmt.Println("Logging out", username, "on Windows")
		fmt.Println("Not implemented")
	} else if runtime.GOOS == "linux" {

	} else {
		fmt.Println("Unsupported OS for logout", runtime.GOOS)
	}
}
