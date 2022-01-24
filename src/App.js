import React, { useEffect, useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  //folosim useState pentru a salva ce dorim de la hhtp request
  //cu async inlocuim nevoie de a utiliza mereu then
  //si dupa folosim await pentru a salva ce avem la fech sau la response si acesam prin  data tot ce avem disponibil la  noul obiect creat  si cu map creem un nou obiect in care salvam tot ce dorim din obiectul data
  const [movies, setMovies] = useState([]);

  //folosim is loading ca sa cream un efect in caz ca datele se incarca
  const [isLoadinng, setIsLoading] = useState(false);

  //am creat stusu cu erro pentru al updata in caz ca primim o eroare cand vrem sa ne conectam
  const [error, setError] = useState(null);
  const fetchMoviesHandler = useCallback(async () => {
    //odata ce am chemat fuctia vrem sa shimbam si status in true (ca si cum sa inceput incarcarea)
    setIsLoading(true);

    //setam error cu null de fiecare data cand utilizam functia asa resetam  statusul si nu ramane cu un status adaugat dupa
    setError(null);
    //apoi spunem sa incerce codul daca nu mai jos avem un cach

    try {
      //cu fech trimtiem u request de unde vrem sa acesam api ,al doilea parametru se utilizeaza pentru o configura ,adaugand un header sau body sau schimband methoda hhtp(dar noi vom folosi methoda defoult care este get)
      //fech returneaza o promisiune
      //fech este asincron adica nu returneaza promisiunea imediat de acea folosim then pentru a specifica ce dorim sa facem,dupa in then primim un obiect de tip response iar apoi acesam methoda jason care ne transform obiectu din jason in  obiect de javascricpt
      //apoi primim alta promisiune de aceasta data este de tip javascript pe care il numim data asa avand acces la tot ce avem in obiectul result de exemplu result in cazu nostru   si dupa setam movies la ce avem in data results
      const response = await fetch(
        //adaugam movies pentru a crea un nou nod
        "https://kkkkk-387f6-default-rtdb.firebaseio.com//movies.json"
      );
      //mereu  cand ne conetam corect o sa primi un response ok ,si asa spunem daca resp nu este ok (introducem if aici ca response nu o sa fie ok sa nu mearga mai deparete)
      if (!response.ok) {
        throw new Error("Somthing went wrong");
      }
      const data = await response.json();
      //aici creem un ouu obiect cu proprietatile din data reslts si facandui un map salvam ce dorim (cum ar fi luam id ,numele etc ) si toate cu o alta denumire pe care o dorim noi
      //am scos mapu pentru ca am adaugat date dirent din baza de date
      //const transformatiedMovies = data.map((movieData) => {
      //  return {
      //   id: movieData.episode_id,
      //    title: movieData.title,
      // openingText: movieData.opening_crawl,
      //  };
      // });

      //pentru a adauga ce primim  de la baza de date dupa ce am facut post creem un array gol iar dupa cui for facem un loop la toate key din data,iar dupa facem un push pentru fiecare key ,si acesam proprietatile ,facand un drill unde se aflat key
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releasedDate: data[key].releasedDate,
        });
      }

      setMovies(loadedMovies);

      //sa salveze orice eroare si dupa specificam sa salveze ce avem la la error message iar dupa putem sa o vedem de forma dinamica in aplicatie
    } catch (error) {
      setError(error.message);
    }
    //odat ce am primit data il trecem la false pentru ca am terminat de primit datele,setam mereu loading fals indiferent daca avem o eroare saau nu
    setIsLoading(false);
  }, []);

  //folosim useEfect cand dorim cand initiem aplicatia sa se initieze si functia in functie daca se schimba ceva in functie de acea o avem ca parametru (si de acea folosim useCalback ca sa o salvam prima data cand sa creat si sa nu se mai reinitializeze de fiecare data ,doar daca se schimba ceva in ce utilizam la useState)
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  //aici tritem un post,in body specificam ce vrem sa adaugam  (ce avem la movie salvat in baza de date),DAR TREBUIE SA IL TRANSFORmam in json,si cu header descriem contentu care o sa fie trimis,folosim asyinc si await (primim si  data inapoi )
  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://kkkkk-387f6-default-rtdb.firebaseio.com//movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-tye": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };
  //con click conectam butonu cu functia

  let content = <p>Found no content</p>;

  if (isLoadinng) {
    content = <p>Is Loading</p>;
  }
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/*   {!isLoadinng && movies.length > 0 && <MoviesList movies={movies} />}{" "}
          asa specificam ca data isLoading este false si movies.lenght >0 adica daca avem filme disponibile sa ne arate pagina Movielist altfel  sa ne arate Loading
          {isLoadinng && <p>Loading ...</p>}
          {!isLoadinng && movies.length === 0 && !error && <p>No movies</p>}
          {!isLoadinng && error && <p>{error}</p>}
    
          ACELASI LUCRU DAR FACUM MAI FRUMOS AM SALVAT toata logigica in content si o aplicam aici
    */}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
