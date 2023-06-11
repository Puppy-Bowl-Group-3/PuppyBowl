const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-ACC-PT-WEB-PT-D";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/COHORT-NAME/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  console.log("this workin?");
  try {
    const response = await fetch(APIURL);
    const allPlayers = await response.json();
    console.log(allPlayers);
    return allPlayers;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/${id}`);
    const singlePlayer = response.json;
    return singlePlayer;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // stringify player data
      body: JSON.stringify({
        name: playerObj.name,
        breed: playerObj.breed,
        status: playerObj.status,
        teamId: playerObj.teamId,
        imageUrl: playerObj.imageUrl,
      }),
    });
    const result = await response.json();
    if (result.ok) {
      console.log("result: ");
    }
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/${playerId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Deleted Player");
      const players = await fetchAllPlayers();
      renderAllPlayers(players.data.players);
    } else {
      console.error("Error Deleting Player");
    }
  } catch (error) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerList) => {
  // console.log("hi");
  try {
    // console.log(playerList);
    playerContainer.innerHTML = "";
    playerList.forEach((player) => {
      // console.log(player.name);
      const playerElement = document.createElement("div");
      playerElement.classList.add("player");
      playerElement.innerHTML = `
                <h2>${player.name}</h2>
                <p>${player.breed}</p>
                <p>${player.status}</p>
                <p>${player.teamId}</p>
                <p>${player.cohortId}</p>
                <img src="${player.imageUrl}" alt="${player.name}">
                <button class="details-button" data-id="${player.id}">See Details</button>
                <button class="delete-button" data-id="${player.id}">Delete</button>
            `;
      playerContainer.appendChild(playerElement);
      const detailsButton = playerElement.querySelector(".details-button");
      detailsButton.addEventListener("click", (event) => {
        // your code here
        event.preventDefault();
        fetchSinglePlayer(player.id);
        // console.log(party.id);
      });
      // delete player
      const deleteButton = playerElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        // your code here
        event.preventDefault();
        removePlayer(player.id);
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  // Add player form
  let formHtml = `
        <form>
        <label for="playerName">New Player</label>
        <input type="text" id="playerName" name="playerName" placeholder="Player Name">
        <label for="breed">Player Breed</label>
        <input type="text" id="breed" name="breed" placeholder="Player Breed">
        <label for="status">Player Status</label>
        <select id="status" name="status"> 
            <option value="bench">bench</option> 
            <option value="field">field</option>
        </select>
        <label for="imageUrl">Player Photo URL</label>
        <input type="text" id="imageUrl" name="imageUrl" placeholder="Photo URL http://...">
        <label for="teamId">Team</label>
        <input type="text" id="teamId" name="teamId" placeholder="null">
        <button type="submit">Add Player</button>
        </form>
        `;

  newPlayerFormContainer.innerHTML = formHtml;

  let form = newPlayerFormContainer.querySelector("form");
  // event listener on "submit" for "Add Player" button
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    // caprutr form data entries in player object
    let playerData = {
      name: form.playerName.value,
      breed: form.breed.value,
      status: form.status.value,
      imageUrl: form.imageUrl.value,
      teamId: form.teamId.value,
    };

    try {
      await addNewPlayer(playerData);
      //get new players list
      const player = await fetchAllPlayers();
      // display new players list
      renderAllPlayers(player.data.players);
      // clear form for next wntry
      form.playerName.value = "";
      form.breed.value = "";
      form.status.value = "";
      form.imageUrl.value = "";
      form.teamId.value = "";
      console.log("Clear New Player");
    } catch (err) {
      console.error("Uh oh, trouble rendering the new player form!", err);
    }
  });
};

const init = async () => {
  const players = await fetchAllPlayers();
  // console.log(players.data.players);
  renderAllPlayers(players.data.players);

  renderNewPlayerForm();
};

init();
