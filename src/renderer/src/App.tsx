import "./App.css"
import { MainContentRoutes } from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App(): JSX.Element {
  return (
    <div className={"frame"}>
      <Header />
      <main className={"mainContent"}>
        <div className={"contentWrapper"}>
          <div className={"innerContent"}>
            <div className={"contentContainer"}>
              <MainContentRoutes></MainContentRoutes>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
