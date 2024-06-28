import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HS_SECRET;
const baseUrl = "https://api.hubapi.com";
const objectId = "2-31214154";

app.get("/pokemons", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    };
    const pokemons = await axios.get(
      `${baseUrl}/crm/v3/objects/2-31214154?properties=pokemon_name,pokemon_level,pokemon_element`,
      {
        headers,
      }
    );

    const data = {
      title: "Pokemons page",
      message: "Esses são os pokemons disponíveis na base",
      pokemons: pokemons.data.results,
    };

    return res.render("pokemons", data);
  } catch (error) {
    console.log(error);
    throw new Error("Error getting pokemons");
  }
});

app.get("/add-pokemon", async (req, res) => {
  try {
    return res.render("create-pokemons");
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.response.data.message,
    });
  }
});

app.post("/pokemons", async (req, res) => {
  try {
    const { body } = req;

    const data = {
      properties: body,
    };

    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    };

    await axios.post(`${baseUrl}/crm/v3/objects/${objectId}`, data, {
      headers,
    });

    const success = true;

    return res.render("create-pokemons", { success });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.response.data.message,
    });
  }
});

app.listen(process.env.PORT || 3001, () =>
  console.log(`Listening on http://localhost:${process.env.PORT || 3001}`)
);
