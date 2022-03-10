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
  | {status: 'pending'; pokemon: null}
  | {status: 'resolved'; pokemon: PokemonData}
  | {status: 'rejected'; error: Error}

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const [state, setState] = React.useState<PokemonState>({
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) return

    async function fetchData() {
      setState({status: 'pending', pokemon: null})
      try {
        const data = await fetchPokemon(pokemonName)
        setState({status: 'resolved', pokemon: data})
      } catch (error) {
        setState({status: 'rejected', error})
      }
    }
    fetchData()
  }, [pokemonName])

  if (state.status === 'idle') {
    return <>Submit a pokemon</>
  }
  if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
  if (state.status === 'rejected' && state.error != null) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
      </div>
    )
  }
  if (state.status === 'resolved' && state.pokemon !== null) {
    return <PokemonDataView pokemon={state.pokemon} />
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
