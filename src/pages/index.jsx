import { ToastContainer, toast } from 'react-toastify';
import styles from "@/styles/Home.module.scss";
import 'react-toastify/dist/ReactToastify.css';
import api from "@/components/api";
import React from "react";


export default function Home() {
  const [results, setResults] = React.useState({});

  const [search, setSearch] = React.useState("");

  const getPokemon = async () => {
    const searchFinal = search.toLowerCase().trim();
    api
      .get(`/pokemon/${searchFinal}`)
      .then((data) => {
        setResults(data.data);
      })
      .catch((error) => {
        toast.error("Pokemon não encontrado!");
        setResults({});
      });
  };

  return (
    <>
      <div className={styles.container}>
        <input
          type="text"
          className={styles.search}
          placeholder="Procure um pokemon:"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getPokemon();
            }
          }}
        />
        {results?.name ? (
          <div className={styles.pokemonCard}>
            <img
              src={results?.sprites?.front_default}
              alt={results?.name}
              className={styles.pokemonImage}
            />
            <div className={styles.pokemonInfo}>
              <h1 className={styles.pokemonName}>Pokemon: {results?.name}</h1>
              <h1 className={styles.pokemonInfo}>Peso: {results?.weight / 10}kg</h1>
              <h1 className={styles.pokemonInfo}>Altura: {results?.height / 10}m</h1>
              <h1 className={styles.pokemonInfo}>Tipo: {results?.types[0]?.type?.name}</h1>
            </div>
          </div>
        ) : null}
      </div>
      <ToastContainer />
    </>
  );
}
