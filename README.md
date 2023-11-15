# FunChess

An online chess project developed for the college back-end discipline :video_game:

FunChess is developed with C# for the API and Typescript + React + NextJs for the web server.

![An image of a Chess board](images/play-page.jpg?raw=true)

## Getting Started

This topic will show how to run the project applications.

### Web Application

The front-end project is located in the path: ```./src/front-end/fun-chess-app/```

Upon arrival, execute the following commands:

```bash
npm install && npm run build && npm run start
# or
yarn install && yarn build && yarn start
```

### MSSQL Server

The API uses the MSSQL database to store and retrieve information.

For better compatibility in tests between operating systems, this example was given using Docker.

```bash
# Only on first installation
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=minhaSenh@123" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

After the first database installation, reuse the created container.

### API

Version: .NET 7.0

The API project is located in the path: ```./src/back-end/FunChess/src/FunChess.API/```

Upon arrival, execute the following command:

```bash
dotnet run -c Release --launch-profile http
```

## Test on local network

If you want multiple devices on the local network to be able to 
access the service without problems, you will need to use a common 
IP/domain between the API and the Web Server due to CORS.

### Files to be changed

#### API

Path: ```./src/back-end/FunChess/src/FunChess.API/Properties/launchSettings.json```

In the file, is needed to modify the used profile, changing the 
**applicationUrl** to the local IP of your machine or to a domain.

Example:

```json
{
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "http://192.168.0.3:5183",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
}
```

#### Web Application

Path: ```./src/front-end/fun-chess-app/next.config.js/```

In the file, is needed to modify the **apiUrl** to the same IP/domain and port where the API is.

Example:

```javascript
const nextConfig = {
    reactStrictMode: false,
    env: {
        apiUrl: "http://192.168.0.3:5183/Api/"
    }
}
```