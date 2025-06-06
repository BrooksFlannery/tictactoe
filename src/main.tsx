import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { LoginView } from './components/Login.tsx'
import { loadMatch, MatchView } from './components/MatchView.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import {loadLobby, LobbyView} from './components/LobbyView.tsx'


let router = createBrowserRouter([
  {
    path:"/",
    Component: App,
    children:[
      // {
      //   path:"/",
      //   Component: LoginView,
      // },
      {
        path:"/",
        Component: LobbyView,
        loader: loadLobby
      },
      {
        path:"/matchView/:matchId",
        Component: MatchView,
        loader : loadMatch
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
