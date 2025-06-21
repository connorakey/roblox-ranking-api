
# Roblox Ranking API

A Roblox Ranking API that syncs with a MongoDB database to see the number of tokens remaining, this is also fully scalable and supports multiple users as it is hosted with MongoDB, and can be run within a docker container for extreme flexibility.







## Features

- MongoDB Interactions (check remaining tokens, checking if an API key is valid, and making sure the group id is correct)
- Promotion/Demotion of users within Roblox Groups
- Deleting Group Wall Posts
- Shouting Messages
- Exile users
- Change the Rank of User / Set rank of User
- Docker Container Flexibility
- Web API (with mongodb intergration, and error handling ensuring 100% uptime)

## Requirements
- NodeJS runtime environment
- Npm NodeJS Package Manager
- Docker Instance (optional)
- MongoDB Database (with URI)




## Deployment

To deploy this project with Docker, run the following commands on a **Linux** system as docker requires it. **NOTICE: Instances of $PORT should be set to the port in your .env file**, if you do not know how to setup a .env file please look at the wiki page.

```bash
  git clone https://github.com/connorakey/roblox-ranking-api
  cd roblox-ranking-api
  docker build -t roblox-ranking-api .
  docker run --env-file .env -p $PORT:$PORT roblox-ranking-api

```
Success! If you didn't get any error messages this has been sucessfully deployed!




## Run Locally
To run this program locally (without the use of docker) follow the steps below, this can apply to any operating system so long as the requirements are met. **Ensure you have created a .env file**, if you do not know how to setup a .env file please look at the wiki page.

Clone the project

```bash
  git clone https://github.com/connorakey/roblox-ranking-api
```

Go to the project directory

```bash
  cd roblox-ranking-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node .
```


## License

[GNU GPL](https://choosealicense.com/licenses/gpl-3.0/)






## Authors

- [@connorakey](https://www.github.com/connorakey)






## Created by Connor Akey
### Created main project on May 17th 2025
### Added Docker Support, Documentation and fully published on 22nd of June 2025
