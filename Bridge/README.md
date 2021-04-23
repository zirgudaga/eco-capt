# eco-capt-bridge
bridge for eco-capt project

To add after modifications :  

```sh
git add .
git commit -m "new commit"
git push heroku main
```

To open the app :  
```sh
heroku ps:scale web=1
heroku open
```
To set some env varaible in heroku :
```sh
heroku config:set MY_VARIABLE=value_of_the_variable
```

Launch Flask App :  
```sh
export FLASK_ENV=development
export FLASK_APP=App
flask run
```
Terminal resp :
```sh
* Serving Flask app "App" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 328-810-260
```


# TO DO

- Doc pour Ledger et liste deroulante (jeu de data)
- Doc type measure
- show functions v0 to heroku
- add functions to detect measureType and code alert for detection