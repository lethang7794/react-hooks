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

type State = 'idle' | 'pending' | 'resolved' | 'rejected'

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const [pokemon, setPokemon] = React.useState<PokemonData | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [status, setStatus] = React.useState<State>('idle')

  React.useEffect(() => {
    if (!pokemonName) return

    async function fetchData() {
      setPokemon(null)
      setStatus('pending')
      try {
        const data = await fetchPokemon(pokemonName)
        setPokemon(data)
        setStatus('resolved')
      } catch (error) {
        setError(error)
        setStatus('rejected')
      }
    }
    fetchData()
  }, [pokemonName])

  if (status === 'idle') {
    return <>Submit a pokemon</>
  }
  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
  if (status === 'rejected' && error != null) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }
  if (status === 'resolved' && pokemon !== null) {
    return <PokemonDataView pokemon={pokemon} />
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
