/**
 * This is an example controller for the "countries" database table. 
 * You use these methods in your routes as callbacks. For instance, the
 * included method would be for the "/countries" URL.
 * 
 * Eventually, you will have a controller for each entity/table in your
 * database. Each controller contains methods that are used by the routes,
 * and interact with the named entity/table in the database. 
 */

// Gain access to our database connection
const pool = require("../data/config");

const getAllPlayers = (request, response) => {
    pool.query(`SELECT * FROM player`, (error, result) => {
        // If we get an error, throw it (this works like a "return" statement)
        if (error){
            throw error;
        }

        // Log the result of the database call to the console.
        console.log(result);

        // Pass the results of the database call to the countries view
        response.render("../views/pages/players", {
            title: "Players",
            playersArray: result
        });
    });
};

const getPlayerById = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT * FROM player WHERE player_id = ?`, 
  id, (error, result) => {
            if (error){
                throw error;
            }
            console.log(result);
            response.render("../views/pages/editPlayer", {
                player: result[0],
                title: "Edit Player"
            });
        });
};

const addPlayer = (request, response, next) => {
    console.log(request.body);
    pool.query('INSERT INTO player SET ?', request.body, (error, result) => {
        if (error){
            throw error;
        }
        response.redirect(`/players`);
    });
};

const deletePlayer = (request, response, next) => {
    const id = request.params.id;
 
    pool.query(`DELETE FROM player WHERE player_id = ?`, 
  id, (error, result) => {
        if (error){
            throw error;
        }
        console.log(request.body);
        response.redirect(`/players`);
    });
};

const editPlayer = (request, response, next) => {
    const id = request.params.id;
 
    console.log(request.body);  
    pool.query(`UPDATE player SET ? WHERE player_id = ?`,
	  [request.body, id], (error, result) => {
        if (error) {
            throw error;
        }
        response.redirect(`/players`);
    });
};


module.exports = {
    getAllPlayers, getPlayerById, addPlayer, deletePlayer, editPlayer, 
}