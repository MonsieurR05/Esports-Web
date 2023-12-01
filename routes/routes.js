const {response} = require("express");

const router = (app) => {
    const eGamesController = require("../controllers/eGames");
    app.get("/games", eGamesController.getAllGames);
    app.get("/games/:id", eGamesController.getGameById);
    app.post("/games/add", eGamesController.addGame);
    app.post("/games/delete/:id", eGamesController.deleteGame);
    app.post("/games/edit/:id", eGamesController.editGame);

    const ePlayersController = require("../controllers/ePlayers");
    app.get("/players", ePlayersController.getAllPlayers);
    app.get("/players/:id", ePlayersController.getPlayerById);
    app.post("/players/add", ePlayersController.addPlayer);
    app.post("/players/delete/:id", ePlayersController.deletePlayer);
    app.post("/players/edit/:id", ePlayersController.editPlayer);

    const specialityController = require("../controllers/speciality");
    app.get("/gamespec/:id", specialityController.getPlayergamesById)
    app.post("/gamespec/edit/:id", specialityController.editPlayerGameSpecialisations)
    app.get("/gamespecs", specialityController.getAllPlayerGames);
    app.get("/gamespecs/:id", specialityController.getPlayergamesById)
    app.post("/gamespecs/edit/:id", specialityController.editPlayerGameSpecialisations)


    // Add your other routes in here
    app.get("/", (request, response) => {
        response.render("../views/pages/home", {title: "home page"});
    });

     app.get("/addGame", (request, response) => {
        response.render("../views/pages/addGame", {title: "Add Game"});
    });

    app.get("/editGame/:id",  eGamesController.getGameById);
        
    app.get("/addPlayer", (request, response) => {
        response.render("../views/pages/addPlayer", {title: "Add Player"});
    });

    app.get("/editPlayer/:id", ePlayersController.getPlayerById);

    app.get("/", (request, response) => {
        response.render("../views/pages/gamespec", {title: "Add Player"});
    });

    app.get("/", (request, response) => {
        response.render("../views/pages/gamespecs", {title: "Add Player"});
    });
};

// Make the router available externally
module.exports = router;