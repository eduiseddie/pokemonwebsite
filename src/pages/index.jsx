import { ToastContainer, toast } from 'react-toastify';
import styles from "@/styles/Home.module.scss";
import 'react-toastify/dist/ReactToastify.css';
import * as Icon from 'react-ionicons'
import api from "@/components/api";
import React from "react";

export default function Home() {
  const [results, setResults] = React.useState([]);

  const [search, setSearch] = React.useState("");

  const [offset, setOffset] = React.useState(0);

  const getPokemons = async () => {
    setResults([]);
    api
      .get(`/pokemon?limit=18&offset=${offset}`)
      .then((data) => {
        for (let i = 0; i < data.data.results.length; i++) {
          api
            .get(`/pokemon/${data.data.results[i].name}`)
            .then((data) => {
              setResults((oldArray) => [...oldArray, data.data]);
            })
            .catch((error) => {
              toast.error("Pokemon não encontrado!");
            })
            .finally(() => {
              console.log(results);
            })
        }
      })
      .catch((error) => {
        toast.error("Pokemon não encontrado!");
      });
  };

  const getPokemon = async () => {
    setResults([]);
    api
      .get(`/pokemon/${search}`)
      .then((data) => {
        setResults((oldArray) => [...oldArray, data.data]);
      })
      .catch((error) => {
        toast.error("Pokemon não encontrado!");
      });
  }

  React.useEffect(() => {
    getPokemons();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <input
          type="text"
          className={styles.search}
          placeholder="Procure um pokemon:"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (search === "" && e.key === "Enter") {
              getPokemons();
            } else if (e.key === "Enter") {
              getPokemon();
            }
          }}
        />
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={() => {
              if (offset > 0) {
                setOffset(offset - 18);
                getPokemons();
              }
            }}
          >
            <Icon.ChevronBackOutline fontSize="30px" color="#000000" />
          </button>
          <button
            className={styles.button}
            onClick={() => {
              setOffset(offset + 18);
              getPokemons();
            }}
          >
            <Icon.ChevronForwardOutline fontSize="30px" color="#000000" />
          </button>
        </div>
        <div className={styles.cards}>
          {
            results?.map((pokemon, index) => {
              return (
                <div className={styles.pokemonCard} key={index}>
                  <img
                    src={pokemon?.sprites?.front_default}
                    alt={pokemon?.name}
                    className={styles.pokemonImage}
                  />
                  <div className={styles.pokemonInfo}>
                    <h1 className={styles.pokemonName}>{pokemon?.name}</h1>
                    <h1 className={styles.pokemonInfo}>Peso: {pokemon?.weight / 10}kg</h1>
                    <h1 className={styles.pokemonInfo}>Altura: {pokemon?.height / 10}m</h1>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
