import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MatchView from './MatchView.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import {loadLobby, LobbyView} from './LobbyView.tsx'


let router = createBrowserRouter([
  {
    path:"/",
    Component: App,
    children:[
      {
        path:"/",
        Component: LobbyView,
        loader: loadLobby
      },
      {
        path:"/matchView/:matchId",
        Component: MatchView
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
