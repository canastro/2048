import "./App.css";
import { Heading } from "./components/heading/heading";
import { Game } from "./game/game";

function App() {
  return (
    <>
      <Heading as="h1" size="9">
        2048
      </Heading>
      
      <main>
        <Game />
      </main>
    </>
  );
}

export default App;
