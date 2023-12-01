const pool = require("../data/config");

const getPlayergamesById = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT game.game_id, game.name, player.player_id ,player.name AS player_name
    FROM game
    RIGHT JOIN player ON player.player_id = ?
    WHERE game_id IS NOT NULL
    ORDER BY game.name ASC;`,
  id, (error, result) => {
            if (error){
                throw error;
            }
            console.log(result);
            response.render("../views/pages/gamespec", {
                playerGamesArray:result,
                player:result[0],
                gamer:result[1],
                title: "player"
            });
        });
};

const getAllgames = (request, response) => {
    pool.query(` SELECT * FROM game `, (error, result) => {
        if (error){
            throw error;
        }
        console.log(result);
        response.render("../views/pages/gamespec", {
            title: "games",
            playergamesArray: result,
            player: result[0],
            gamer: result[1]
        });
    });
};

const editPlayerGameSpecialisations = (request, response, next) => {
    const playerId = request.params.id;
    let gamesIdsArr = request.body.game_id || [];
    let gamesToInsert = [];
    console.log("REQUEST BODY: ", request.body);
    if (gamesIdsArr){
        if (!Array.isArray(gamesIdsArr)){
            gamesIdsArr = [gamesIdsArr];
        }
        for (let i = 0; i < gamesIdsArr.length; i++){
            gamesToInsert.push([playerId, gamesIdsArr[i]]);
        }
    }
    pool.getConnection(function(error, connection) {
        if (error){
            throw error;
        }
        connection.beginTransaction( function(error) {
            if (error) {
                throw error;
            }
            connection.query(`
                DELETE FROM gamespecialisation WHERE player_id = ?`,
                playerId, (error, result) => {
                    if (error) {
                        return connection.rollback( function() {
                            throw error;
                        });
                    }
                    console.log("DELETE QUERY: ", result);

                if (gamesToInsert.length === 0){
                    return connection.commit( function(error) {
                        connection.release();
                        if (error) {
                            return connection.rollback( function() {
                                throw error;
                            });
                        }
                        response.redirect(`/gamespecs`);
                    })
                }

                connection.query(`
                    INSERT INTO gamespecialisation(player_id, game_id)
                    VALUES ?`, [gamesToInsert], (error, result) => {
                        if (error) {
                            return connection.rollback( function() {
                                throw error;
                            });
                        }
                        console.log("INSERT QUERY: ", result);
                        connection.commit( function(error) {
                            connection.release();
                            if (error) {
                                return connection.rollback( function() {
                                    throw error;
                                });
                            }
                            console.log("TRANSACTION COMMIT: ", result);
                            response.redirect(`/gamespecs`);
                        })
                    })
                })
            })
        })
    };
    
    const getAllPlayerGames = (request, response) => {
        pool.query(`SELECT *, player.name AS "PlayerName", game.name AS "GameName" FROM player JOIN gamespecialisation USING(player_id) JOIN game USING(game_id)`, (error, result) => {
            if (error){
                throw error;
            }
            response.render("../views/pages/gamespecs", {
                title: "Games Players Play",
                playerGamesArray: result,
                player: result,
            });
        });
    };

    module.exports = {
        getAllgames,
        editPlayerGameSpecialisations,
        getPlayergamesById,
        getAllPlayerGames,
    };










