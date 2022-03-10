// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.tsx

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {PokemonData} from '../types'


type PokemonState =
  | {status: 'idle'}
  | {status: 'pending'}
  | {status: 'resolved'; pokemon: PokemonData}
  | {status: 'rejected'; error: Error}

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const [state, setState] = React.useState<PokemonState>({
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) return

    async function fetchData() {
      setState({status: 'pending'})
      try {
        const data = await fetchPokemon(pokemonName)
        setState({status: 'resolved', pokemon: data})
      } catch (error) {
        setState({status: 'rejected', error})
      }
    }
    fetchData()
  }, [pokemonName])

  switch (state.status) {
    case 'idle':
      return <>Submit a pokemon</>

    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />

    case 'rejected':
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
        </div>
      )

    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />

    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export {App}
