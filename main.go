package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	db "github.com/deekshith-dade/app/postgres"
)

func getDrivers(w http.ResponseWriter, req *http.Request){
		rows, err := db.Connection.Query("SELECT name FROM drivers")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()

	data := ""
	for rows.Next() {
		var name string
		err = rows.Scan(&name)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(name)
		data += fmt.Sprintf("%s ", name)
	}

	err = rows.Err()
	if err != nil {
		log.Println(err)
	}
	fmt.Fprintf(w, data)
	
}

func getData(w http.ResponseWriter, req *http.Request) {
  fmt.Fprintf(w, "Hello world\n")
}

func main() {
	log.Println("Starting application")
	db.InitDB()
	defer db.Connection.Close()
	http.Handle("/", http.FileServer(http.Dir("./frontend/dist")))
	http.HandleFunc("/drivers", getDrivers)
  http.HandleFunc("/data", getData)

	serverEnv := os.Getenv("SERVER_ENV")

	if serverEnv == "DEV" {
		http.ListenAndServe(":8080", nil)
	}else if serverEnv == "PROD" {
		http.ListenAndServeTLS(":443",
		"/etc/letsencrypt/live/app.deekshith.me/fullchain.pem",
		"/etc/letsencrypt/live/app.deekshith.me/privkey.pem",
			nil,
		)

	}

  }


